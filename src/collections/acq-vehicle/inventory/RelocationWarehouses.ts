import type { CollectionConfig } from 'payload'

export const RelocationWarehouses: CollectionConfig = {
  slug: 'relocationwarehouses',
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
    singular: 'Traslado vehicular entre almacenes',
    plural: 'Traslados vehiculares entre almacenes',
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
          name: 'movementdate',
          label: 'Fecha de salida',
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
          name: 'warehousedestination',
          label: 'Almacén de destino',
          type: 'relationship',
          relationTo: 'warehouse',
          required: true,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },
      ],
    },
    {
      name: 'driver',
      label: 'Conductor',
      type: 'relationship',
      relationTo: 'driver',
      required: true,
      hasMany: false,
      admin: {
        allowCreate: false,
      },
    },
    {
      name: 'observations',
      label: 'Observaciones',
      type: 'textarea',
      required: false,
    },
    {
      name: 'warehouseorigin',
      label: 'Almacén de origen',
      type: 'relationship',
      relationTo: 'warehouse',
      hasMany: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
        allowEdit: false,
      },
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
        { label: 'Activo', value: 'activo' },
        { label: 'Cancelado', value: 'cancelado' },
      ],
      defaultValue: 'activo',
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create' && doc.status === 'activo') {
          const { payload } = req
          try {
            // 1. Buscar el documento de inventario para el vehículo
            const inventoryRes = await payload.find({
              collection: 'inventory',
              where: {
                vehicle: { equals: doc.vehicle },
                status: { in: ['En Stock', 'Reservado', 'En Tránsito'] }, // Solo documentos activos
              },
              limit: 1,
              depth: 1, // Necesario para obtener relaciones completas
            })

            if (inventoryRes.docs.length === 0) {
              console.error(
                'No se encontró un documento de inventario para el vehículo:',
                doc.vehicle,
              )
              throw new Error('No se encontró el registro de inventario para el vehículo')
            }

            const inventoryDoc = inventoryRes.docs[0]

            // 2. Obtener datos del inventario (empresa y almacén de origen)
            const companyId =
              typeof inventoryDoc.dealership === 'object'
                ? inventoryDoc.dealership.id
                : inventoryDoc.dealership

            const warehouseOriginId =
              typeof inventoryDoc.location === 'object'
                ? inventoryDoc.location?.id
                : inventoryDoc.location

            // 3. Obtener los establecimientos de los almacenes
            const originWarehouse = await payload.findByID({
              collection: 'warehouse',
              id: warehouseOriginId,
              depth: 1, // Para obtener el establecimiento
            })

            const destinationWarehouse = await payload.findByID({
              collection: 'warehouse',
              id:
                typeof doc.warehousedestination === 'object'
                  ? doc.warehousedestination.id
                  : doc.warehousedestination, // <-- Extrae el ID si es un objeto
              depth: 1, // Para obtener el establecimiento
            })

            // 4. Validar que los almacenes estén en el mismo distrito
            const originEstablishment = await payload.findByID({
              collection: 'establishment',
              id:
                typeof originWarehouse.establishment === 'object'
                  ? originWarehouse.establishment.id
                  : originWarehouse.establishment,
              depth: 1,
            })

            const destinationEstablishment = await payload.findByID({
              collection: 'establishment',
              id:
                typeof destinationWarehouse.establishment === 'object'
                  ? destinationWarehouse.establishment.id
                  : destinationWarehouse.establishment,
              depth: 1,
            })

            const originDistritoId =
              typeof originEstablishment.distrito === 'object'
                ? originEstablishment.distrito.id
                : originEstablishment.distrito
            const destinationDistritoId =
              typeof destinationEstablishment.distrito === 'object'
                ? destinationEstablishment.distrito.id
                : destinationEstablishment.distrito

            // Validar que ambos almacenes estén en la misma direccion
            if (originDistritoId !== destinationDistritoId) {
              console.warn(
                `El traslado no aplicable: Almacen de origen (${originDistritoId}) y destino (${destinationDistritoId}) no estan en la misma direccion.`,
              )
              throw new Error('Los almacenes no estan en la misma direccion')
            }

            // 5. Crear el movimiento de salida
            const exitMovement = await payload.create({
              collection: 'movements',
              data: {
                vehicle: doc.vehicle,
                company: companyId,
                movementdate: doc.movementdate,
                typemovement: 'salida',
                motivemovement: 'Salida vehicular a otro almacén',
                warehouse: warehouseOriginId, // Almacén de origen
                status: 'activo',
                relocationId: doc.id, // Vincular con el traslado original
              },
            })

            // 6. Crear el movimiento de entrada
            const entryMovement = await payload.create({
              collection: 'movements',
              data: {
                vehicle: doc.vehicle,
                company: companyId,
                movementdate: doc.movementdate,
                typemovement: 'entrada',
                motivemovement: 'Ingreso vehicular a nuevo almacén',
                warehouse: doc.warehousedestination, // Almacén destino
                status: 'activo',
                relocationId: doc.id, // Vincular con el traslado original
              },
            })

            // 7. Actualizar el inventario
            await payload.update({
              collection: 'inventory',
              id: inventoryDoc.id,
              data: {
                location: doc.warehousedestination, // Actualizar al nuevo almacén
              },
            })

            //8. Actualizar el warehouseorigin
            await payload.update({
              collection: 'relocationwarehouses',
              id: doc.id,
              data: {
                warehouseorigin: warehouseOriginId, // Actualizar almacén de origen
              },
            })

            console.log(
              `Movimientos de salida (${exitMovement.id}) y entrada (${entryMovement.id}) creados para el vehiculo ${doc.vehicle}, y ubicacion actualizada al almacen ${doc.warehouse}`,
            )
          } catch (error) {
            console.error('Error procesando el traslado entre almacenes:', error)
            throw error // Lanzar error para notificar al usuario
          }
        }
      },
    ],

    afterDelete: [
      async ({ doc, req }) => {
        if (doc.status === 'activo') {
          const { payload } = req
          try {
            // Determinar si el documento eliminado es un traslado genérico o un movimiento derivado
            const isDerivedMovement =
              doc.typemovement === 'salida' || doc.typemovement === 'entrada'
            const relocationId = doc.relocationId || doc.id

            // 1. Buscar y eliminar los movimientos asociados
            let movementsToDelete: { id: string }[] = []

            if (isDerivedMovement) {
              // Caso 1: Se eliminó un movimiento derivado (salida o entrada)
              const complementaryType = doc.typemovement === 'salida' ? 'entrada' : 'salida'

              const complementaryMovement = await payload.find({
                collection: 'movements',
                where: {
                  relocationId: { equals: relocationId },
                  typemovement: { equals: complementaryType },
                },
                limit: 1,
              })

              if (complementaryMovement.docs.length > 0) {
                movementsToDelete = complementaryMovement.docs
              }
            } else {
              // Caso 2: Se eliminó el traslado genérico
              const relatedMovements = await payload.find({
                collection: 'movements',
                where: {
                  relocationId: { equals: relocationId },
                  id: { not_equals: doc.id },
                },
              })
              movementsToDelete = relatedMovements.docs
            }

            // Eliminar los movimientos encontrados
            for (const movement of movementsToDelete) {
              await payload.delete({
                collection: 'movements',
                id: movement.id,
              })
            }

            // 2. Buscar el documento de inventario, incluyendo vehículos reservados
            const inventoryRes = await payload.find({
              collection: 'inventory',
              where: {
                vehicle: { equals: doc.vehicle },
                status: { in: ['En Stock', 'En Tránsito', 'Reservado'] },
              },
              limit: 1,
              depth: 1,
            })

            if (inventoryRes.docs.length === 0) {
              console.error(
                'No se encontro un documento de inventario para el vehiculo:',
                doc.vehicle,
              )
              return
            }

            const inventoryDoc = inventoryRes.docs[0]

            // 3. Determinar el almacén de origen para revertir el inventario
            let revertWarehouseId = null
            const exitMovement = await payload.find({
              collection: 'movements',
              where: {
                relocationId: { equals: relocationId },
                typemovement: { equals: 'salida' },
              },
              limit: 1,
            })
            revertWarehouseId = exitMovement.docs.length > 0 ? exitMovement.docs[0].warehouse : null

            // 4. Revertir la ubicación
            await payload.update({
              collection: 'inventory',
              id: inventoryDoc.id,
              data: {
                location: revertWarehouseId || inventoryDoc.location,
              },
            })

            console.log(
              `Movimientos asociados eliminados y estado del vehiculo ${doc.vehicle} revertido al almacen ${revertWarehouseId || 'sin cambios'}`,
            )
          } catch (error) {
            console.error('Error manejando la eliminacion del movimiento:', error)
            throw error
          }
        }
      },
    ],
  },
}
