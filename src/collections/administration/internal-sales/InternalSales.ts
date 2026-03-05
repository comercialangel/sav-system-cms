import type { CollectionConfig } from 'payload'

export const InternalSales: CollectionConfig = {
  slug: 'internal-sales',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Ventas vehiculares',
  },
  labels: {
    singular: 'Venta interna (asociados)',
    plural: 'Ventas internas (asociados)',
  },
  fields: [
    {
      name: 'vehicle',
      label: 'Unidad vehicular',
      type: 'relationship',
      relationTo: 'vehicle',
      required: true,
      hasMany: false,
      admin: {
        allowCreate: false,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'company',
          label: 'Empresa vendedora',
          type: 'relationship',
          relationTo: 'company',
          required: true,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },
        {
          name: 'saledate',
          label: 'Fecha de venta',
          type: 'date',
          required: true,
          timezone: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'typecurrency',
          label: 'Tipo de moneda de venta',
          type: 'relationship',
          relationTo: 'typecurrency',
          required: true,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },
        {
          name: 'pricesale',
          label: 'Precio de venta',
          type: 'number',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'exchargerate',
          label: 'Tipo de cambio',
          type: 'number',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'companyCustomer',
      label: 'Empresa compradora',
      type: 'relationship',
      relationTo: 'company',
      required: true,
      hasMany: false,
      maxDepth: 2,
      admin: {
        allowCreate: false,
      },
    },
    {
      name: 'internalsalefiles',
      label: 'Archivos',
      type: 'array',
      labels: {
        singular: 'Archivo',
        plural: 'Archivos',
      },
      required: false,
      fields: [
        {
          name: 'mediainternalsale',
          label: 'Archivo',
          type: 'upload',
          maxDepth: 4,
          relationTo: 'mediainternalsale',
          required: false,
        },
      ],
    },
    {
      name: 'observations',
      label: 'Observaciones',
      type: 'textarea',
      required: false,
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      required: true,
      admin: {
        position: 'sidebar',
      },
      options: [
        {
          label: 'Activo',
          value: 'activo',
        },
        {
          label: 'Inactivo',
          value: 'inactivo',
        },
      ],
      defaultValue: 'activo',
    },
    {
      name: 'statusReceipt',
      label: 'Estado de comprabante',
      type: 'select',
      required: true,
      admin: {
        position: 'sidebar',
      },
      options: [
        {
          label: 'Pendiente',
          value: 'pendiente',
        },
        {
          label: 'Generado',
          value: 'generado',
        },
      ],
      defaultValue: 'pendiente',
    },
    {
      type: 'relationship',
      name: 'createdBy',
      label: 'Creado por',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
        allowEdit: false,
      },
    },
    {
      type: 'relationship',
      name: 'updatedBy',
      label: 'Actualizado por',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
        allowEdit: false,
      },
    },
  ],

  hooks: {
    beforeChange: [
      async ({ req: { user }, data, operation }) => {
        try {
          // Validar que company y companyCustomer no sean la misma empresa
          const companyId = typeof data.company === 'object' ? data.company?.id : data.company
          const companyCustomerId =
            typeof data.companyCustomer === 'object'
              ? data.companyCustomer?.id
              : data.companyCustomer

          if (companyId && companyCustomerId && companyId === companyCustomerId) {
            throw new Error('La empresa vendedora y la empresa compradora no pueden ser la misma')
          }

          // Asignar createdBy y updatedBy
          if (user) {
            if (operation === 'create' && !data.createdBy) {
              data.createdBy = user.id
            }
            data.updatedBy = user.id
          }

          return data
        } catch (error) {
          throw new Error(`Error en beforeChange de InternalSales: ${error}`)
        }
      },
    ],

    afterChange: [
      async ({ doc, req: { payload }, operation }) => {
        // Solo procesar para operaciones create o cuando se activa una venta
        if (operation === 'create' && doc.status === 'activo') {
          try {
            // Extraer datos del documento de venta interna
            const { vehicle, company, companyCustomer, saledate, id } = doc

            // Validar que los campos necesarios existan
            if (!vehicle || !company || !companyCustomer || !saledate) {
              throw new Error(
                'Faltan datos requeridos: vehículo, empresa vendedora, compradora o fecha de venta',
              )
            }

            // Normalizar los IDs
            const vehicleId = typeof vehicle === 'object' ? vehicle.id : vehicle
            const companyId = typeof company === 'object' ? company.id : company
            const companyCustomerId =
              typeof companyCustomer === 'object' ? companyCustomer.id : companyCustomer

            // 1. Buscar el registro de inventario de la Empresa A (vendedora)
            const sellerInventory = await payload.find({
              collection: 'inventory',
              where: {
                and: [
                  { vehicle: { equals: vehicleId } },
                  { dealership: { equals: companyId } },
                  { status: { not_equals: 'Vendido' } },
                ],
              },
              depth: 0,
            })

            if (sellerInventory.docs.length === 0) {
              throw new Error('No se encontró el vehículo en el inventario de la empresa vendedora')
            }

            const sellerInventoryItem = sellerInventory.docs[0]

            // Extraer el purchaseReceptionId directamente
            const purchaseReceptionId =
              typeof sellerInventoryItem.purchaseReception === 'object'
                ? sellerInventoryItem.purchaseReception?.id
                : sellerInventoryItem.purchaseReception

            console.log('purchaseReceptionId extraído:', purchaseReceptionId)

            if (!purchaseReceptionId) {
              throw new Error(
                'El campo purchaseReception no está definido en el inventario original',
              )
            }

            // Verificar que el purchaseReceptionId existe en purchasereceptions
            const purchaseReception = await payload
              .findByID({
                collection: 'purchasereceptions',
                id: purchaseReceptionId,
              })
              .catch(() => null)

            if (!purchaseReception) {
              throw new Error(
                `El ID de purchaseReception ${purchaseReceptionId} no existe en la colección purchasereceptions`,
              )
            }

            // 2. Actualizar el inventario de la Empresa A (vendedora)
            await payload.update({
              collection: 'inventory',
              id: sellerInventoryItem.id,
              data: {
                status: 'Vendido',
                operation: 'Venta',
                transactionDate: saledate,
              },
            })

            console.log(`Inventario de Empresa A actualizado: ID ${sellerInventoryItem.id}`)

            // 3. Crear un nuevo registro en el inventario de la Empresa B (compradora)
            const newBuyerInventory = await payload.create({
              collection: 'inventory',
              data: {
                quantity: 1,
                vehicle: vehicleId,
                purchaseReception: purchaseReceptionId,
                transactionDate: saledate,
                dealership: companyCustomerId,
                status: 'En Stock',
                operation: 'Compra',
                location: sellerInventoryItem.location,
              },
            })

            console.log(`Inventario de Empresa B creado: ID ${newBuyerInventory.id}`)

            // 4. Crear movimientos en la colección movements
            // Movimiento de salida (venta) para la Empresa A
            const saleMovement = await payload.create({
              collection: 'movements',
              data: {
                vehicle: vehicleId,
                company: companyId,
                movementdate: saledate,
                typemovement: 'salida',
                motivemovement: 'Venta interna',
                warehouse: sellerInventoryItem.location,
                status: 'efectuado',
                relocationId: id, // Vincular al documento de InternalSales
              },
            })

            console.log(`Movimiento de salida creado para Empresa A: ID ${saleMovement.id}`)

            // Movimiento de entrada (compra) para la Empresa B
            const purchaseMovement = await payload.create({
              collection: 'movements',
              data: {
                vehicle: vehicleId,
                company: companyCustomerId,
                movementdate: saledate,
                typemovement: 'entrada',
                motivemovement: 'Compra interna',
                warehouse: sellerInventoryItem.location,
                status: 'efectuado',
                relocationId: id, // Vincular al documento de InternalSales
              },
            })

            console.log(`Movimiento de entrada creado para Empresa B: ID ${purchaseMovement.id}`)

            // Crear un nuevo documento en receiptsale
            const receiptSale = await payload.create({
              collection: 'receiptsale',
              data: {
                internalsales: id,
                status: 'pendiente',
              },
            })

            console.log(`Documento creado en receiptsale: ID ${receiptSale.id}`)

            console.log(
              `Venta interna procesada: Vehículo ${vehicleId} transferido de ${companyId} a ${companyCustomerId} con purchaseReception ${purchaseReceptionId}`,
            )
          } catch (error) {
            console.error('Error en el hook afterChange de InternalSales:', error)
            console.error('Detalles del error:', error)
            throw new Error(`Error procesando la venta interna: ${error}`)
          }
        }

        return doc
      },
    ],
  },
}
