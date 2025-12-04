import type { CollectionConfig } from 'payload'
import { headersWithCors } from 'payload'
export const Inventory: CollectionConfig = {
  slug: 'inventory',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Control de inventario vehicular',
  },
  labels: {
    singular: 'Inventario vehicular',
    plural: 'Inventario vehicular',
  },
  fields: [
    {
      name: 'quantity',
      label: 'Cantidad',
      type: 'number', // Usually 1 for vehicles
      required: true,
      min: 0,
      defaultValue: 1,
    },
    {
      name: 'vehicle',
      label: 'Vehículo',
      type: 'relationship',
      relationTo: 'vehicle',
      required: true,
    },
    {
      name: 'purchaseReception',
      label: 'Recepción de compra asociada',
      type: 'relationship',
      relationTo: 'purchasereceptions',
      required: true,
      unique: false, // Cada recepción solo puede tener un ítem en inventory
      admin: {
        description: 'Vínculo al documento donde se registró la recepción del vehículo',
      },
    },
    {
      name: 'transactionDate',
      label: 'Fecha de operación',
      type: 'date',
      required: false,
    },

    {
      name: 'dealership',
      label: 'Empresa',
      type: 'relationship',
      relationTo: 'company',
      required: true,
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      options: ['En Stock', 'Reservado', 'En Tránsito', 'Vendido'],
      defaultValue: 'En Stock',
      required: true,
    },
    {
      name: 'operation',
      label: 'Operación realizada',
      type: 'select',
      options: ['Compra', 'Venta'],
      defaultValue: 'Compra',
      required: true,
    },
    {
      name: 'location',
      label: 'Ubicación',
      type: 'relationship',
      relationTo: 'warehouse',
      required: true,
      admin: {
        description: 'Ubicación del vehículo (o "Entregado al cliente" si está entregado)',
      },
    },
    //campos agregados para manejar precios
    {
      name: 'priceAssignment',
      label: 'Asignación de precio',
      type: 'relationship',
      relationTo: 'priceassignment',
      required: false,
      index: true,
      admin: {
        description: 'Precio de venta para este vehículo.',
      },
    },
    {
      name: 'activePricelist',
      label: 'Lista de Precios Activa',
      type: 'relationship',
      relationTo: 'pricelists',
      required: false,
      hasMany: true,
      index: true,
      admin: {
        description: 'Lista de precios activa para este vehículo.',
        condition: (data) => data?.status !== 'Vendido',
      },
    },
  ],

  endpoints: [
    //endpoint obtener vehículos por establecimiento
    {
      path: '/inventory-summary',
      method: 'get',
      handler: async (req) => {
        try {
          const result = await req.payload.db.collections['inventory'].aggregate([
            {
              // Filtrar por estados relevantes
              $match: {
                status: { $in: ['En Stock', 'En Tránsito', 'Reservado', 'Vendido'] },
              },
            },
            {
              // Unir con warehouses
              $lookup: {
                from: 'warehouses', // Nombre correcto en MongoDB
                localField: 'location', // Campo en inventories que apunta a warehouses._id
                foreignField: '_id',
                as: 'location',
              },
            },
            {
              $unwind: {
                path: '$location',
                preserveNullAndEmptyArrays: true, // Maneja location ausente
              },
            },
            {
              // Unir con establishments
              $lookup: {
                from: 'establishments', // Nombre correcto en MongoDB
                localField: 'location.establishment', // Campo en warehouses que apunta a establishments._id
                foreignField: '_id',
                as: 'location.establishment',
              },
            },
            {
              $unwind: {
                path: '$location.establishment',
                preserveNullAndEmptyArrays: true, // Maneja establishment ausente
              },
            },
            {
              // Agrupar por establecimiento y sumar quantity
              $group: {
                _id: {
                  $ifNull: ['$location.establishment.establishmentname', 'Sin Establecimiento'],
                },
                value: { $sum: { $ifNull: ['$quantity', 1] } }, // Suma quantity, por defecto 1
                debugDocs: {
                  // Para depuración
                  $push: {
                    inventoryId: '$_id',
                    locationId: '$location._id',
                    establishmentId: '$location.establishment._id',
                    status: '$status',
                    quantity: '$quantity',
                  },
                },
              },
            },
            {
              // Proyectar al formato esperado
              $project: {
                key: '$_id',
                value: 1,
                debugDocs: 1, // Temporal para depuración
                _id: 0,
              },
            },
            {
              // Ordenar por conteo descendente
              $sort: {
                value: -1,
              },
            },
          ])

          // Respuesta final
          const finalResult = result.map(({ key, value }) => ({ key, value }))

          return Response.json(
            {
              success: true,
              data: finalResult,
              count: finalResult.length,
            },
            {
              headers: headersWithCors({
                headers: new Headers(),
                req,
              }),
            },
          )
        } catch (error) {
          return Response.json(
            { error: 'Error en consulta', details: error },
            {
              status: 500,
              headers: headersWithCors({
                headers: new Headers(),
                req,
              }),
            },
          )
        }
      },
    },

    //endpoint obtener vehículos disponibles (en stock)
    {
      path: '/available-vehicles',
      method: 'get',
      handler: async (req) => {
        const { payload } = req

        try {
          const inventoryItems = await payload.find({
            collection: 'inventory',
            where: { status: { equals: 'En Stock' } },
            depth: 2,
            pagination: false,
            sort: '-createdAt',
          })

          const result = inventoryItems.docs.map((item) => {
            const v = item.vehicle // TypeScript infiere: string | PopulatedVehicle
            const d = item.dealership // string | PopulatedDealership

            // === VEHÍCULO (solo nombres, sin any) ===
            const brand =
              typeof v === 'string'
                ? ''
                : v.brand
                  ? typeof v.brand === 'string'
                    ? v.brand
                    : v.brand.brand || ''
                  : ''
            const model =
              typeof v === 'string'
                ? ''
                : v.model
                  ? typeof v.model === 'string'
                    ? v.model
                    : v.model.model || ''
                  : ''
            const version =
              typeof v === 'string'
                ? ''
                : v.version
                  ? typeof v.version === 'string'
                    ? v.version
                    : v.version.version || ''
                  : ''
            const color =
              typeof v === 'string'
                ? ''
                : v.color
                  ? typeof v.color === 'string'
                    ? v.color
                    : v.color.color || ''
                  : ''
            const year = typeof v === 'string' ? '' : v.yearmodel || ''

            const vehicleStr =
              `${brand} ${model} ${color} ${year} / ${version}`.trim().replace(/\s+/g, ' ') ||
              'Vehículo no identificado'

            // === CONDICIÓN, FOTO, PLACA ===
            const condition =
              typeof v === 'string' ? 'Nuevo' : v.conditionvehicle?.condition || 'Nuevo'
            const referenceimage =
              typeof v === 'string'
                ? null
                : typeof v.referenceimage === 'object'
                  ? (v.referenceimage?.thumbnailURL ?? null)
                  : null
            const licensePlatesNumber =
              typeof v === 'string' ? null : (v.licensePlates?.licensePlatesNumber ?? null)
            const vehicleId = typeof v === 'string' ? v : v.id

            // === DEALERSHIP ===
            const dealershipId = typeof d === 'string' ? d : (d?.idcode ?? '')
            const dealershipName = typeof d === 'string' ? '' : (d?.companyname ?? '')
            const dealershipRuc = typeof d === 'string' ? '' : (d?.identificationnumber ?? '')
            // === NUEVO: LOCATION (almacén) ===
            const locationName = item.location
              ? typeof item.location === 'string'
                ? 'Desconocido'
                : item.location.warehousename || 'Sin nombre'
              : 'Sin ubicación'

            const locationID = item.location
              ? typeof item.location === 'string'
                ? item.location
                : item.location.id || null
              : null

            return {
              vehicle: vehicleStr,
              vehicleId,
              vin: typeof v === 'string' ? '' : v.vin ? `CH: ${v.vin}` : '',
              motor: typeof v === 'string' ? '' : v.motor ? `MT: ${v.motor}` : '',
              conditionvehicle: condition,
              referenceimage,
              licensePlatesNumber,
              dealership: dealershipId,
              dealershipName,
              dealershipRuc,
              inventoryId: item.id,
              locationName,
              locationID,
            }
          })

          return Response.json(
            { docs: result },
            { status: 200, headers: headersWithCors({ headers: new Headers(), req }) },
          )
        } catch (error) {
          console.error('Error endpoint /available-vehicles:', error)
          return Response.json(
            { error: 'Error interno del servidor', details: error },
            { status: 500, headers: headersWithCors({ headers: new Headers(), req }) },
          )
        }
      },
    },
  ],
}
