import type { CollectionConfig } from 'payload'

export const ReceptionRelocation: CollectionConfig = {
  slug: 'receptionrelocation',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Control de inventario vehicular',
  },
  labels: {
    singular: 'Recepción de traslado vehicular',
    plural: 'Recepción de traslados vehiculares',
  },
  fields: [
    {
      type: 'relationship',
      name: 'relocation',
      label: 'Traslado',
      relationTo: 'relocation',
      hasMany: false,
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'arrivaldate',
          label: 'Fecha de recepción',
          type: 'date',
          required: false,
          timezone: true,
          admin: {
            width: '50%',
            date: {
              displayFormat: 'd MMM yyy',
            },
          },
        },

        {
          name: 'warehouseincoming',
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
    afterChange: [
      async ({ doc, req, operation }) => {
        const { payload } = req

        if (operation === 'create') {
          try {
            // 1. Obtener el traslado relacionado con toda su información

            const idRelocation =
              typeof doc.relocation === 'object' ? doc.relocation.id : doc.relocation

            const relocation = await payload.findByID({
              collection: 'relocation',
              id: idRelocation,
              depth: 2,
            })

            if (!relocation) {
              throw new Error('No se encontro el traslado relacionado')
            }

            // 2. Liberar placas si existen
            if (relocation.internalplates) {
              await payload.update({
                collection: 'internalplates',
                id:
                  typeof relocation.internalplates === 'object'
                    ? relocation.internalplates.id
                    : relocation.internalplates,
                data: { status: 'liberada' },
              })
              console.log('Placa interna liberada')
            }

            if (relocation.externalplates) {
              await payload.update({
                collection: 'externalplates',
                id:
                  typeof relocation.externalplates === 'object'
                    ? relocation.externalplates.id
                    : relocation.externalplates,
                data: { status: 'liberada' },
              })
              console.log('Placa externa liberada')
            }

            // 3. Actualizar el estado del traslado a "recepcionada"
            await payload.update({
              collection: 'relocation',
              id: idRelocation,
              data: { status: 'recepcionada' },
            })

            // 4. Actualizar el inventario con el almacén de destino
            if (relocation.vehicle) {
              // Primero encontrar el registro de inventario
              const inventoryRes = await payload.find({
                collection: 'inventory',
                where: {
                  vehicle: {
                    equals: relocation.vehicle,
                  },
                },
                limit: 1,
              })

              if (inventoryRes?.docs.length > 0) {
                await payload.update({
                  collection: 'inventory',
                  id: inventoryRes.docs[0].id,
                  data: {
                    status: 'En Stock',
                    location: doc.warehouseincoming,
                  },
                })
                console.log('Inventario actualizado')
              }
            }

            // 5. Crear registro de movimiento de entrada
            let companyId = null

            // Obtener el registro de inventario para el vehículo
            const inventoryRes = await payload.find({
              collection: 'inventory',
              where: { vehicle: { equals: relocation.vehicle } },
              limit: 1,
              depth: 1,
            })

            if (inventoryRes.docs.length > 0) {
              const inventoryRecord = inventoryRes.docs[0]

              // Obtener companyId desde el inventario
              if (inventoryRecord.dealership) {
                companyId =
                  typeof inventoryRecord.dealership === 'object'
                    ? inventoryRecord.dealership.id
                    : inventoryRecord.dealership
              }
            }

            await payload.create({
              collection: 'movements',
              data: {
                vehicle: relocation.vehicle,
                company: companyId,
                movementdate: doc.arrivaldate || new Date(),
                typemovement: 'entrada',
                motivemovement: 'Recepción de traslado vehicular',
                warehouse: doc.warehouseincoming,
                status: 'activo',
                relocationId: idRelocation,
              },
            })

            //Registrar ID de recepción
            await payload.update({
              collection: 'relocation',
              id: idRelocation,
              data: {
                receptionrelocation: doc.id,
              },
            })
            console.log('Registro de movimiento de entrada creado')
          } catch (error) {
            console.error(`Error en proceso de recepción: ${error}`)
            throw new Error('No se pudo completar el proceso de recepcion')
          }
        }
      },
    ],
  },
}
