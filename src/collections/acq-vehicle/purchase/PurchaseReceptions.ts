import type { CollectionConfig } from 'payload'

export const PurchaseReceptions: CollectionConfig = {
  slug: 'purchasereceptions',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  labels: {
    singular: 'Recepción de compra',
    plural: 'Recepción de compras',
  },
  admin: {
    group: 'Adquisiciones vehiculares',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'purchase',
          label: 'Compra asociada',
          type: 'relationship',
          relationTo: 'purchase',
          required: true,
          index: true,
          admin: {
            description: 'Compra a la que pertenece esta recepción',
          },
        },
        {
          name: 'transportation',
          label: 'Traslado asociado',
          type: 'relationship',
          relationTo: 'purchasetransportation',
          required: false,
          admin: {
            description: 'Traslado que se utilizó para transportar este vehículo',
          },
        },
        {
          name: 'datereception',
          label: 'Fecha de recepción',
          type: 'date',
          required: true,
          timezone: true,
          admin: {
            width: '50%',
            date: {
              displayFormat: 'd MMM yyy',
            },
          },
        },
        {
          name: 'warehouse',
          label: 'Almacén de ingreso',
          type: 'relationship',
          relationTo: 'warehouse',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
            position: 'sidebar',
          },
        },
        {
          name: 'receivedby',
          label: 'Recibido por',
          type: 'relationship',
          relationTo: 'collaborator',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
          },
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
      name: 'vehicle',
      label: 'Datos del vehiculo',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            // Aquí defines todos los atributos del vehículo
            {
              name: 'brand',
              label: 'Marca',
              type: 'relationship',
              relationTo: 'brand',
              required: true,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: true,
              },
            },
            {
              name: 'model',
              label: 'Modelo',
              type: 'relationship',
              relationTo: 'model',
              required: true,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: true,
              },
            },
            {
              name: 'version',
              label: 'Versión',
              type: 'relationship',
              relationTo: 'version',
              required: true,
              hasMany: false,
              admin: {
                width: '34%',
                allowCreate: true,
              },
            },
            {
              name: 'color',
              label: 'Color',
              type: 'relationship',
              relationTo: 'color',
              required: true,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: true,
              },
            },
            {
              name: 'yearmanufacture',
              label: 'Año de fabricación',
              type: 'number',
              required: false,
              admin: {
                width: '33%',
              },
            },
            {
              name: 'yearmodel',
              label: 'Año de modelo',
              type: 'number',
              required: true,
              admin: {
                width: '34%',
              },
            },
            {
              name: 'vin',
              label: 'Chasis',
              type: 'text',
              required: true,
              maxLength: 17,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'motor',
              label: 'Motor',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'cylindercapacity',
              label: 'Cilindrada',
              type: 'number',
              required: true,
              admin: {
                width: '33%',
              },
            },
            {
              name: 'fuel',
              label: 'Combustible',
              type: 'relationship',
              relationTo: 'fuel',
              required: true,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: true,
              },
            },
            {
              name: 'transmission',
              label: 'Transmisión',
              type: 'relationship',
              relationTo: 'transmission',
              required: true,
              hasMany: false,
              admin: {
                width: '34%',
                allowCreate: true,
              },
            },
            {
              name: 'traction',
              label: 'Tracción',
              type: 'relationship',
              relationTo: 'traction',
              required: true,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: true,
              },
            },
            {
              name: 'carbody',
              label: 'Carrocería',
              type: 'relationship',
              relationTo: 'carbody',
              required: true,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: true,
              },
            },
            {
              name: 'category',
              label: 'Cartegoría',
              type: 'relationship',
              relationTo: 'category',
              required: true,
              hasMany: false,
              admin: {
                width: '34%',
                allowCreate: true,
              },
            },
            {
              name: 'seat',
              label: 'Asientos',
              type: 'number',
              required: true,
              admin: {
                width: '33%',
              },
            },
            {
              name: 'rimnumber',
              label: 'Número de aro',
              type: 'number',
              required: true,
              admin: {
                width: '33%',
              },
            },
            {
              name: 'typerim',
              label: 'Tipo de aro',
              type: 'relationship',
              relationTo: 'typerim',
              required: true,
              hasMany: false,
              admin: {
                width: '34%',
                allowCreate: true,
              },
            },
            {
              name: 'mileage',
              label: 'Kilometraje',
              type: 'text',
              required: false,
              defaultValue: '0',
              admin: {
                width: '33%',
              },
            },
            {
              name: 'vehiclekey',
              label: 'Llaves de contacto',
              type: 'number',
              required: false,
              admin: {
                width: '33%',
              },
            },
            {
              name: 'licensePlatesNumber',
              label: 'Placas de rodaje',
              type: 'text',
              required: false,
              admin: {
                width: '33%',
              },
            },
            {
              name: 'licensePlateUsageType',
              label: 'Tipo de uso',
              type: 'relationship',
              relationTo: 'typeuse',
              required: false,
              hasMany: false,
              admin: {
                width: '67%',
                allowCreate: false,
              },
            },
          ],
        },
      ],
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
      async ({ req, data, operation }) => {
        if (req.user) {
          if (operation === 'create') {
            data.createdBy = req.user.id
          }
          data.updatedBy = req.user.id
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req, operation }) => {
        const { payload } = req

        try {
          // Operación de creación o actualización con cambios relevantes
          if (operation === 'create' || (operation === 'update' && previousDoc)) {
            // 1. Manejo del traslado asociado y placas
            if (doc.transportation) {
              const transportationId =
                typeof doc.transportation === 'object' ? doc.transportation.id : doc.transportation

              const transportation = await payload.findByID({
                collection: 'purchasetransportation',
                id: transportationId,
                depth: 1,
              })

              // Solo procesar si el estado es 'en transito'
              if (transportation && transportation.status === 'en transito') {
                // Liberar placas según el tipo
                if (transportation.optionsplate === 'interna' && transportation.internalplates) {
                  const plateIdInternal =
                    typeof transportation.internalplates === 'object'
                      ? transportation.internalplates.id
                      : transportation.internalplates

                  await payload.update({
                    collection: 'internalplates',
                    id: plateIdInternal,
                    data: {
                      status: 'liberada',
                    },
                  })
                  console.log('Placa interna liberada')
                } else if (
                  transportation.optionsplate === 'externa' &&
                  transportation.externalplates
                ) {
                  const plateIdExternal =
                    typeof transportation.externalplates === 'object'
                      ? transportation.externalplates.id
                      : transportation.externalplates

                  await payload.update({
                    collection: 'externalplates',
                    id: plateIdExternal,
                    data: {
                      status: 'liberada',
                    },
                  })
                  console.log('Placa externa liberada')
                }

                // Actualizar estado del traslado
                await payload.update({
                  collection: 'purchasetransportation',
                  //id: doc.transportation,
                  id:
                    typeof doc.transportation === 'object'
                      ? doc.transportation.id
                      : doc.transportation,
                  data: {
                    status: 'completado',
                  },
                })
                console.log(`Traslado ${doc.transportation} marcado como completado`)
              }
            }

            //2. Obtener datos de la compra
            const purchaseId = typeof doc.purchase === 'object' ? doc.purchase.id : doc.purchase

            const purchaseAssociated = await payload.findByID({
              collection: 'purchase',
              id: purchaseId,
              depth: 1,
            })

            if (!purchaseAssociated || !purchaseAssociated.company) {
              console.error('Compra o empresa no encontrada')
              return
            }

            const companyId =
              typeof purchaseAssociated.company === 'object'
                ? purchaseAssociated.company.id
                : purchaseAssociated.company

            if (operation === 'create') {
              //2.1 Crear registro de vehículo
              const newVehicle = await payload.create({
                collection: 'vehicle',
                data: {
                  ...doc.vehicle,
                  purchaseReception: doc.id,
                  conditionvehicle: {
                    condition: purchaseAssociated.vehicle?.condition,
                    mileage: doc.vehicle?.mileage,
                  },
                  licensePlates: {
                    licensePlatesNumber: doc.vehicle.licensePlatesNumber,
                    licensePlateUsageType: doc.vehicle.licensePlateUsageType,
                  },
                  equipmentbasic: {
                    vehiclekey: doc.vehicle.vehiclekey,
                  },
                },
              })

              //2.2 Crear registro en inventario
              await payload.create({
                collection: 'inventory',
                data: {
                  quantity: 1,
                  vehicle: newVehicle.id,
                  purchaseReception: doc.id, // ¡Aquí vinculamos la recepción!
                  transactionDate: new Date().toISOString(),
                  dealership: companyId,
                  status: 'En Stock',
                  operation: 'Compra',
                  location: doc.warehouse,
                },
              })

              //2.3 Registrar movimiento
              await payload.create({
                collection: 'movements',
                data: {
                  vehicle: newVehicle.id,
                  company: companyId,
                  movementdate: doc.datereception,
                  typemovement: 'entrada',
                  motivemovement: 'Recepción de compra',
                  warehouse: doc.warehouse,
                },
              })
            } else if (operation === 'update') {
              //3. Actualización de datos
              //3.1 Actualizar vehículo existente
              const existingVehicle = await payload.find({
                collection: 'vehicle',
                where: { purchaseReception: { equals: doc.id } },
                limit: 1,
              })

              if (existingVehicle.docs.length > 0) {
                await payload.update({
                  collection: 'vehicle',
                  id: existingVehicle.docs[0].id,
                  data: {
                    ...doc.vehicle,
                    conditionvehicle: {
                      condition: purchaseAssociated.vehicle?.condition,
                      mileage: doc.vehicle?.mileage,
                    },
                    licensePlates: {
                      licensePlatesNumber: doc.vehicle.licensePlatesNumber,
                      licensePlateUsageType: doc.vehicle.licensePlateUsageType.id,
                    },
                    equipmentbasic: {
                      vehiclekey: doc.vehicle.vehiclekey,
                    },
                  },
                })

                //3.2 Actualizar inventario
                const inventory = await payload.find({
                  collection: 'inventory',
                  where: { vehicle: { equals: existingVehicle.docs[0].id } },
                  limit: 1,
                })

                if (inventory.docs.length > 0) {
                  await payload.update({
                    collection: 'inventory',
                    id: inventory.docs[0].id,
                    data: {
                      purchaseReception: doc.id, // Nuevo campo
                      location: doc.warehouse,
                    },
                  })
                }
                //3.3 Actualizar movimiento
                const movement = await payload.find({
                  collection: 'movements',
                  where: { vehicle: { equals: existingVehicle.docs[0].id } },
                  limit: 1,
                })
                if (movement.docs.length > 0) {
                  await payload.update({
                    collection: 'movements',
                    id: movement.docs[0].id,
                    data: {
                      movementdate: doc.datereception,
                      warehouse: doc.warehouse,
                    },
                  })
                }
              }
            }

            //4. Actualizar estado de la compra
            await payload.update({
              collection: 'purchase',
              id: purchaseId,
              data: {
                statusreception: 'recepcionado',
                // receptions: doc.id,
              },
            })
          }
        } catch (error) {
          console.error('Error en hook de recepcion:', error)
          throw new Error('No se pudo completar el proceso de recepcion')
        }
      },
    ],
  },
}
