import type { CollectionConfig } from 'payload'

export const VehicleDelivery: CollectionConfig = {
  slug: 'vehicledelivery',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Entregas y devoluciones',
  },
  labels: {
    singular: 'Entrega de vehicular',
    plural: 'Entregas de vehiculos',
  },
  fields: [
    {
      name: 'finalsale',
      label: 'Venta vehicular final',
      type: 'relationship',
      relationTo: 'finalsale',
      required: false,
      hasMany: false,
      admin: {
        allowCreate: false,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'typedelivery',
          label: 'Tipo de entrega',
          type: 'select',
          admin: {
            width: '50%',
          },
          options: [
            { label: 'Entrega vehicular', value: 'entrega-vehicular' },
            { label: 'Entrega de TIVE', value: 'entrega-de-tive' },
            { label: 'Entrega de placas', value: 'entrega-de-placas' },
            { label: 'Entrega de segunda llave', value: 'entrega-de-segunda-llave' },
          ],
          required: true,
        },
        {
          name: 'deliverydate',
          label: 'Fecha de entrega',
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
      ],
    },
    {
      name: 'deliveryplace',
      label: 'Lugar de entrega',
      type: 'text',
      required: false,
    },
    {
      name: 'vehicledeliveryfiles',
      label: 'Archivos',
      type: 'array',
      labels: {
        singular: 'Archivo',
        plural: 'Archivos',
      },
      required: false,
      fields: [
        {
          name: 'mediavehicledelivery',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediavehicledelivery',
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
      name: 'statusdelivery',
      label: 'Estado de entrega',
      type: 'select',
      admin: {
        width: '50%',
        position: 'sidebar',
      },
      options: [
        { label: 'Pendiente', value: 'pendiente' },
        { label: 'Entregado', value: 'entregado' },
      ],
      required: true,
      defaultValue: 'pendiente',
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        // Solo actuamos si se marca como 'entregado' la entrega FÍSICA del vehículo
        if (
          (operation === 'create' || operation === 'update') &&
          doc.statusdelivery === 'entregado' &&
          previousDoc?.statusdelivery !== 'entregado' &&
          doc.typedelivery === 'entrega-vehicular'
        ) {
          const { payload } = req

          // 1. Obtener la venta final para saber qué vehículo es
          const saleId = typeof doc.finalsale === 'object' ? doc.finalsale?.id : doc.finalsale
          if (!saleId) return doc

          const sale = await payload.findByID({
            collection: 'finalsale',
            id: saleId,
            req,
          })

          const vehicleId = typeof sale.vehicle === 'object' ? sale.vehicle?.id : sale.vehicle
          if (!vehicleId) return doc

          // 2. Buscamos el inventario de ese vehículo
          // (Nota: el estado ya debe ser 'Vendido' gracias al hook de finalsale)
          const { docs: inventoryDocs } = await payload.find({
            collection: 'inventory',
            where: { vehicle: { equals: vehicleId } },
            limit: 1,
            req,
          })

          const inventoryDoc = inventoryDocs[0]

          if (inventoryDoc) {
            // EXTRACCIÓN CORRECTA: Sacamos la empresa y el almacén desde el inventario
            const dealershipId =
              typeof inventoryDoc.dealership === 'object'
                ? inventoryDoc.dealership.id
                : inventoryDoc.dealership
            const currentWarehouseId =
              typeof inventoryDoc.location === 'object'
                ? inventoryDoc.location?.id
                : inventoryDoc.location

            // (Opcional) Buscar el almacén "Entregado al Cliente" si lo manejas así
            const { docs: customerWarehouses } = await payload.find({
              collection: 'warehouse',
              where: { name: { equals: 'Entregado al Cliente' } }, // Ajusta al nombre real
              limit: 1,
              req,
            })
            const customerWarehouseId = customerWarehouses[0]?.id || currentWarehouseId

            // 3. Ejecutar la Baja Logística Real
            await payload.update({
              collection: 'inventory',
              id: inventoryDoc.id,
              data: {
                quantity: 0, // ¡Ahora sí salió de la empresa físicamente!
                location: customerWarehouseId, // Actualizamos su ubicación
              },
              req,
            })

            // 4. Crear el Movimiento de Auditoría con el dealership correcto
            await payload.create({
              collection: 'movements',
              data: {
                vehicle: vehicleId,
                company: dealershipId, // Tomado de item.dealership
                movementdate: doc.deliverydate, // La fecha REAL de entrega
                typemovement: 'salida',
                motivemovement: 'Venta final', // Motivo exacto que usabas
                warehouse: currentWarehouseId, // El almacén de donde salió
                status: 'efectuado', // El estado exacto que usabas
              },
              req,
            })
          }
        }
        return doc
      },
    ],
  },
}
