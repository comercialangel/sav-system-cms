import type { CollectionConfig } from 'payload'

export const PriceAssignment: CollectionConfig = {
  slug: 'priceassignment',
  labels: {
    singular: 'Asignación de Precio',
    plural: 'Asignaciones de Precio',
  },
  admin: {
    group: 'Ventas vehiculares',
    useAsTitle: 'inventoryItem',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'inventoryItem',
      label: 'Vehículo en Inventario',
      type: 'relationship',
      relationTo: 'inventory',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Seleccione el vehículo único a precificar.',
      },
      filterOptions: {
        status: { equals: 'En Stock' },
        'priceAssignment.id': { exists: false },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'currency',
          label: 'Moneda de Costo',
          type: 'relationship',
          relationTo: 'typecurrency',
          required: true,
          admin: {
            width: '33%',
            description:
              'Moneda del costo de compra (tomada de la compra o seleccionada manualmente).',
          },
        },
        {
          name: 'purchaseCost',
          label: 'Costo de Compra',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            width: '33%',
            description: 'Costo de compra en la moneda seleccionada, ingresado manualmente.',
          },
        },
        {
          name: 'transportCost',
          label: 'Costo de Traslado (USD)',
          type: 'number',
          required: false,
          admin: {
            width: '34%',
            readOnly: false,
            description:
              'Importado desde PurchaseTransportation, en USD. Pero ingresado manualmente en el Frontend',
          },
        },

        {
          name: 'totalCost',
          label: 'Costo Total (USD)',
          type: 'number',
          required: true,
          admin: {
            width: '50%',
            readOnly: false,
            description: 'Suma de compra + traslado + GPS, redondeado a 2 decimales.',
          },
          hooks: {
            beforeChange: [
              ({ data }) => {
                const total = (data?.purchaseCost || 0) + (data?.transportCost || 0)
                return parseFloat(total.toFixed(2))
              },
            ],
          },
        },
        {
          name: 'profitMargin',
          label: 'Margen de Ganancia',
          type: 'number',
          min: 0,
          max: 4000,
          defaultValue: 0,
          admin: {
            width: '50%',
            description: 'Porcentaje aplicado sobre el costo total.',
          },
        },
        {
          name: 'suggestedPrice',
          label: 'Precio de Venta sugerido (USD)',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            width: '33%',
            description:
              'Calculado automáticamente o ingresado manualmente, redondeado a 2 decimales.',
          },
          hooks: {
            beforeChange: [
              ({ data }) => {
                const margin = data?.profitMargin || 0
                const calculatedPrice = (data?.totalCost || 0) + margin
                return parseFloat(calculatedPrice.toFixed(2))
              },
            ],
          },
        },
      ],
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'Borrador', value: 'draft' },
        { label: 'Activo', value: 'active' },
        { label: 'Archivado', value: 'archived' },
      ],
      defaultValue: 'active',
      required: true,
    },
    {
      name: 'notes',
      label: 'Notas',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Notas sobre ajustes manuales en el precio.',
      },
    },
  ],

  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        const { payload } = req

        // Validación inicial común
        if (doc.status !== 'active' || !doc.inventoryItem) return

        // Extraer y validar inventoryId
        let inventoryId
        if (typeof doc.inventoryItem === 'object' && doc.inventoryItem?.id) {
          inventoryId = doc.inventoryItem.id
        } else if (typeof doc.inventoryItem === 'string') {
          inventoryId = doc.inventoryItem
        } else {
          console.error('inventoryItem no válido:', doc.inventoryItem)
          throw new Error('inventoryItem no contiene un ID válido')
        }
        // Obtener el documento de inventario
        let inventory
        try {
          inventory = await payload.findByID({
            collection: 'inventory',
            id: inventoryId,
            depth: 2, // Aumentar depth para asegurar que vehicle esté poblado
          })
          // console.log('Inventario encontrado:', inventory)
        } catch (error) {
          console.error('Fallo al obtener inventario:', error)
          throw new Error(`No se pudo encontrar el inventario con ID: ${inventoryId}`)
        }

        // Validar y extraer vehicleId
        let vehicleId
        if (typeof inventory.vehicle === 'object' && inventory.vehicle?.id) {
          vehicleId = inventory.vehicle.id
        } else if (typeof inventory.vehicle === 'string') {
          vehicleId = inventory.vehicle
        } else {
          console.error('vehicle no válido en inventario:', inventory.vehicle)
          throw new Error('vehicle no contiene un ID válido')
        }

        // Validar y extraer currencyId
        let currencyId
        if (typeof doc.currency === 'object' && doc.currency?.id) {
          currencyId = doc.currency.id
        } else if (typeof doc.currency === 'string') {
          currencyId = doc.currency
        } else {
          console.error('currency no válido:', doc.currency)
          throw new Error('currency no contiene un ID válido')
        }

        let currency
        try {
          currency = await payload.findByID({
            collection: 'typecurrency',
            id: currencyId,
          })
          // console.log('Moneda encontrada:', currency)
        } catch (error) {
          console.error('Fallo al obtener moneda:', error)
          throw new Error(`No se pudo encontrar la moneda con ID: ${currencyId}`)
        }

        const exchangeRate = currency.codecurrency === 'USD' ? 1 : 0

        // --- BLOQUE CREATE ---

        // --- BLOQUE CREATE ---
        if (operation === 'create') {
          let newPricelist
          try {
            newPricelist = await payload.create({
              collection: 'pricelists',
              data: {
                vehicle: vehicleId,
                pricelistName: 'Precio contado',
                currency: currencyId,
                price: parseFloat(doc.suggestedPrice.toFixed(2)),
                exchangeRate: exchangeRate,
                status: 'active',
                // createdBy: req.user?.id,
                // updatedBy: req.user?.id,
              },
            })
            // console.log('Pricelist creado:', newPricelist)
          } catch (createError) {
            console.error('Fallo en creación de Pricelist:', {
              vehicleId,
              currencyId,
              error: createError,
            })
            throw new Error('Fallo al crear nueva lista de precios')
          }

          try {
            // Obtener el array actual de activePricelist
            const currentPricelists = Array.isArray(inventory.activePricelist)
              ? inventory.activePricelist
              : []

            await payload.update({
              collection: 'inventory',
              id: inventoryId,
              data: {
                priceAssignment: doc.id,
                activePricelist: [...currentPricelists, newPricelist.id], // Añadir el nuevo ID
              },
            })
            console.log(
              `Inventario actualizado exitosamente (PriceAssignment: ${doc.id}, Pricelist: ${newPricelist.id})`,
            )
          } catch (inventoryError) {
            console.error('Fallo al actualizar Inventory:', inventoryError)
            throw new Error('Fallo al vincular lista de precios al inventario')
          }
        }

        // --- BLOQUE UPDATE ---
        if (operation === 'update') {
          try {
            const existingPricelist = await payload.find({
              collection: 'pricelists',
              where: {
                vehicle: { equals: vehicleId },
                pricelistName: { equals: 'Precio público' },
              },
              limit: 1,
            })

            if (!existingPricelist.docs.length) {
              console.error('No se encontró lista de precios para el vehículo:', vehicleId)
              throw new Error(`No existe lista de precios para el vehículo ${vehicleId}`)
            }

            try {
              await payload.update({
                collection: 'pricelists',
                id: existingPricelist.docs[0].id,
                data: {
                  currency: currencyId,
                  price: parseFloat(doc.suggestedPrice.toFixed(2)),
                  exchangeRate,
                  updatedBy: req.user?.id,
                },
              })
              console.log(`Pricelist actualizado exitosamente: ${existingPricelist.docs[0].id}`)
            } catch (updateError) {
              console.error('Fallo al actualizar Pricelist:', {
                pricelistId: existingPricelist.docs[0].id,
                error: updateError,
              })
              throw new Error('Fallo al actualizar lista de precios existente')
            }
          } catch (findError) {
            console.error('Fallo al buscar Pricelist existente:', findError)
            throw new Error('Error en búsqueda de lista de precios')
          }
        }
      },
    ],

    beforeDelete: [
      async ({ id, req }) => {
        const items = await req.payload.find({
          collection: 'inventory',
          where: { priceAssignment: { equals: id } },
        })
        for (const item of items.docs) {
          await req.payload.update({
            collection: 'inventory',
            id: item.id,
            data: {
              priceAssignment: null,
              activePricelist: null, // Limpiar el array completo
              status: 'En Stock',
            },
          })
          console.log(`Inventario actualizado al eliminar PriceAssignment: ${item.id}`)
        }
      },
    ],
  },
}
