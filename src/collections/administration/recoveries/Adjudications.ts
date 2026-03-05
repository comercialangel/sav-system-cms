// src/collections/Adjudications.ts
import { headersWithCors, type CollectionConfig } from 'payload'

export const Adjudications: CollectionConfig = {
  slug: 'adjudications',
  labels: { singular: 'Adjudicación', plural: 'Adjudicaciones' },
  admin: {
    group: 'Post-Venta y Legales',
  },
  fields: [
    // 1. Vinculación (El Origen)
    {
      name: 'recoveryCase',
      type: 'relationship',
      relationTo: 'recoveries',
      label: 'Expediente de Recuperación',
      required: true,
      hasMany: false,
      filterOptions: {
        status: { equals: 'in_custody' }, // Solo autos que ya tenemos físicamente
      },
    },

    // 2. Datos basicos del vehículo al momento de la adjudicación
    // Es vital registrar esto de nuevo porque el kilometraje aumentó, número de llaves, etc.
    {
      name: 'vehicleData',
      type: 'group',
      label: 'Datos del Vehículo Físico',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'currentMileage',
              type: 'number',
              label: 'Kilometraje Actual',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'vehiclekey',
              label: 'Llaves de contacto',
              type: 'number',
              required: false,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'color',
              type: 'text',
              label: 'Color',
              admin: { width: '33%' },
            },
            {
              name: 'licensePlateUsageType',
              type: 'text',
              label: 'Tipo de uso de placa',
              admin: { width: '34%' },
            },
          ],
        },
      ],
    },

    // 3. ESTADO FÍSICO Y VALORIZACIÓN
    {
      type: 'row',
      fields: [
        {
          name: 'conditionRating',
          label: 'Calificación de Estado',
          type: 'select',
          options: ['Excelente', 'Bueno', 'Regular', 'Malo/Para Reparar'],
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'accountingValue',
          type: 'number',
          required: true,
          label: 'Valor de Adjudicación (Costo Contable)',
          admin: { width: '50%' },
        },
        {
          name: 'observations',
          type: 'textarea',
          label: 'Daños visibles (Rayones, golpes, etc.)',
        },
      ],
    },

    {
      name: 'inboundwarehouse',
      label: 'Ubicación',
      type: 'relationship',
      relationTo: 'warehouse',
      required: true,
      admin: {
        description:
          'Almacén de destino para este vehículo adjudicado. Es importante para la logística de almacenamiento.',
      },
    },

    // 4. ESTADO DE LA ADJUDICACIÓN
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Borrador / Inspección', value: 'draft' },
        { label: 'Procesado (Ingresado a Stock)', value: 'processed' },
      ],
      defaultValue: 'draft',
    },
  ],
  endpoints: [
    {
      path: '/:id/liquidate',
      method: 'post',
      handler: async (req) => {
        try {
          const { payload, routeParams } = req
          const adjudicationId = routeParams?.id as string

          // 1. Obtener el body
          const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
          const { warehouse: warehouseId, company: companyId } = body

          if (!warehouseId || !companyId) {
            return Response.json(
              { error: 'Debe especificar el almacén (warehouse) y la empresa (company).' },
              { status: 400, headers: headersWithCors({ headers: new Headers(), req }) },
            )
          }

          // 2. Traer la Adjudicación
          const adjudication = await payload.findByID({
            collection: 'adjudications',
            id: adjudicationId,
            req,
          })

          if (adjudication.status === 'processed') {
            return Response.json(
              { error: 'Esta adjudicación ya fue procesada.' },
              { status: 400, headers: headersWithCors({ headers: new Headers(), req }) },
            )
          }

          // 3. Traer la Recuperación y la Venta Original
          const recoveryId =
            typeof adjudication.recoveryCase === 'object'
              ? adjudication.recoveryCase?.id
              : adjudication.recoveryCase

          const recovery = await payload.findByID({
            collection: 'recoveries',
            id: recoveryId,
            req,
          })

          const saleId =
            typeof recovery.originalSale === 'object'
              ? recovery.originalSale.id
              : recovery.originalSale

          const sale = await payload.findByID({
            collection: 'finalsale',
            id: saleId,
            req,
          })

          const planId = typeof sale.creditPlan === 'object' ? sale.creditPlan?.id : sale.creditPlan

          // Obtener el Vehículo Original desde finalsale
          const originalVehicleId =
            typeof sale.vehicle === 'object' ? sale.vehicle.id : sale.vehicle

          if (!originalVehicleId) {
            return Response.json(
              { error: 'La venta original no tiene un vehículo vinculado para clonar.' },
              { status: 400, headers: headersWithCors({ headers: new Headers(), req }) },
            )
          }

          // Consultamos el vehículo original con depth: 1 para asegurar la data
          const originalVehicle = await payload.findByID({
            collection: 'vehicle',
            id: originalVehicleId,
            depth: 2,
            req,
          })

          // === FASE A: LOGÍSTICA (CLONAJE PERFECTO CON TU PATRÓN) ===
          const newVehicle = await payload.create({
            collection: 'vehicle',
            data: {
              // 1. Relaciones: Extraemos los IDs estrictamente como strings
              brand:
                typeof originalVehicle.brand === 'object' && originalVehicle.brand
                  ? originalVehicle.brand.id
                  : (originalVehicle.brand as string),
              model: originalVehicle.model,
              version: originalVehicle.version,
              color: originalVehicle.color,
              yearmanufacture: originalVehicle.yearmanufacture,
              yearmodel: originalVehicle.yearmodel,
              vin: originalVehicle.vin,
              motor: originalVehicle.motor,
              cylindercapacity: originalVehicle.cylindercapacity,
              fuel: originalVehicle.fuel,
              transmission: originalVehicle.transmission,
              traction: originalVehicle.traction,
              carbody: originalVehicle.carbody,
              category: originalVehicle.category,
              seat: originalVehicle.seat,
              rimnumber: originalVehicle.rimnumber,
              typerim: originalVehicle.typerim,
              equipmentbasic: {
                vehiclekey: adjudication.vehicleData?.vehiclekey,
              },

              // 3. Campos requeridos en vehicle
              internalequipment: {
                totalExpenseInUSD: 0,
                totalExpenseInPEN: 0,
              },

              externalequipment: {
                totalExpenseExUSD: 0,
                totalExpenseExPEN: 0,
              },

              conditionvehicle: {
                condition: 'Usado',
                mileage: adjudication?.vehicleData?.currentMileage,
                note: 'Reingreso por adjudicación coactiva.',
              },
              licensePlates: {
                licensePlatesNumber: originalVehicle.licensePlates?.licensePlatesNumber,
                licensePlateUsageType: adjudication.vehicleData?.licensePlateUsageType,
              },
            },
            req,
          })

          // Crear Inventario (Sin el campo priceAssignment porque ahora es un join)
          await payload.create({
            collection: 'inventory',
            data: {
              quantity: 1,
              vehicle: newVehicle.id,
              transactionDate: new Date().toISOString(),
              dealership: companyId,
              status: 'En Stock',
              operation: 'Adjudicación',
              location: adjudication.inboundwarehouse,
              // priceAssignment: adjudication?.accountingValue,
            },
            req,
          })

          await payload.create({
            collection: 'movements',
            data: {
              vehicle: newVehicle.id,
              company: companyId,
              movementdate: new Date().toISOString(),
              typemovement: 'entrada',
              motivemovement: 'Adjudicación por impago',
              warehouse: warehouseId,
            },
            req,
          })

          // === FASE B: FINANCIERA (Matar Deuda) ===
          if (planId) {
            await payload.update({
              collection: 'creditplan',
              id: planId,
              data: { status: 'liquidado' },
              req,
            })

            const { docs: unpaidInstallments } = await payload.find({
              collection: 'creditinstallment',
              where: {
                and: [
                  { creditPlan: { equals: planId } },
                  { status: { in: ['pendiente', 'parcial', 'vencida'] } },
                ],
              },
              pagination: false,
              req,
            })

            for (const inst of unpaidInstallments) {
              await payload.update({
                collection: 'creditinstallment',
                id: inst.id,
                data: { status: 'liquidada' },
                context: { skipMoraCalculation: true },
                req,
              })
            }
          }

          // === FASE C: CIERRE LEGAL ===
          await payload.update({
            collection: 'recoveries',
            id: recoveryId,
            data: { status: 'adjudicated' },
            req,
          })
          await payload.update({
            collection: 'adjudications',
            id: adjudicationId,
            data: { status: 'processed' },
            req,
          })

          return Response.json(
            { success: true, vehicleId: newVehicle.id },
            { status: 200, headers: headersWithCors({ headers: new Headers(), req }) },
          )
        } catch (error) {
          req.payload.logger.error(`Error liquidando: ${error}`)
          return Response.json(
            {
              error: 'Error interno liquidando.',
              details: error instanceof Error ? error.message : 'Error desconocido',
            },
            { status: 500, headers: headersWithCors({ headers: new Headers(), req }) },
          )
        }
      },
    },
  ],
}
