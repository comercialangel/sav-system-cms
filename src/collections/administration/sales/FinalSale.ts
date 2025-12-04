import { generateInstallments } from '@/utils/generateInstallments'
import type { CollectionConfig } from 'payload'
import { headersWithCors } from 'payload'

export const FinalSale: CollectionConfig = {
  slug: 'finalsale',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'typesale',
    group: 'Ventas vehiculares',
  },
  labels: {
    singular: 'Venta final',
    plural: 'Ventas finales',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'saledate',
          label: 'Fecha de venta',
          type: 'date',
          timezone: true,
          required: true,
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
          name: 'typesale',
          label: 'Tipo de venta',
          type: 'select',
          required: true,
          admin: {
            width: '33%',
          },
          options: [
            {
              label: 'Contado',
              value: 'contado',
            },
            {
              label: 'Crédito',
              value: 'crédito',
            },
          ],
        },
        {
          name: 'typecurrency',
          label: 'Tipo de moneda de venta',
          type: 'relationship',
          relationTo: 'typecurrency',
          required: true,
          hasMany: false,
          admin: {
            width: '33%',
            allowCreate: false,
          },
        },
        {
          name: 'exchangerate',
          label: 'Tipo de cambio',
          type: 'number',
          defaultValue: 1,
          required: true,
          admin: {
            width: '34%',
          },
        },
      ],
    },
    {
      name: 'customer',
      label: 'Cliente(s)',
      type: 'relationship',
      relationTo: 'buyer',
      required: true,
      hasMany: true,
      admin: {
        allowCreate: true,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'vehicle',
          label: 'Unidad vehicular',
          type: 'relationship',
          relationTo: 'vehicle',
          required: true,
          hasMany: false,
          admin: {
            width: '67%',
            allowCreate: false,
          },
        },
        {
          name: 'pricesale',
          label: 'Precio de venta',
          type: 'number',
          required: true,
          admin: {
            width: '33%',
          },
        },
      ],
    },
    {
      name: 'paymentList',
      label: 'Lista de pagos',
      type: 'array',
      labels: {
        singular: 'Pago',
        plural: 'Pagos',
      },
      required: true,
      admin: {
        description: 'Esta sección debe ser llenado exclusivamente para ventas al contado.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'paymentdate',
              label: 'Fecha de pago',
              type: 'date',
              required: true,
              timezone: true,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'typepayment',
              label: 'Tipo de pago',
              type: 'relationship',
              relationTo: 'typepayment',
              required: true,
              hasMany: false,
              admin: {
                width: '50%',
                allowCreate: false,
              },
            },
            {
              name: 'typecurrencyreceived',
              label: 'Tipo de moneda recibida',
              type: 'relationship',
              relationTo: 'typecurrency',
              required: true,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: false,
              },
            },
            {
              name: 'valuereceived',
              label: 'Valor recibido',
              type: 'number',
              required: true,
              admin: {
                width: '34%',
              },
            },
            {
              name: 'accountcompany',
              label: 'Cuenta bancaria',
              type: 'relationship',
              relationTo: 'accountcompany',
              required: false,
              hasMany: false,
              admin: {
                width: '67%',
                allowCreate: false,
              },
            },
            {
              name: 'operationnumber',
              label: 'Número de operación',
              type: 'number',
              required: false,
              admin: {
                width: '33%',
              },
            },
          ],
        },
        {
          name: 'mediavoucher',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediasale',
          required: false,
        },
        {
          name: 'observationspayment',
          label: 'Obseravciones',
          type: 'textarea',
          required: false,
        },
      ],
    },
    {
      name: 'salefiles',
      label: 'Archivos de venta',
      type: 'array',
      required: false,
      labels: {
        singular: 'Archivo',
        plural: 'Archivos',
      },
      fields: [
        {
          name: 'mediasale',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediasale',
          required: true,
        },
      ],
    },
    {
      name: 'observations',
      label: 'Obseravciones',
      type: 'textarea',
      required: false,
    },

    // === CAMPOS DE CRÉDITO (solo visibles si typesale === 'crédito') ===
    {
      type: 'row',
      fields: [
        {
          name: 'initialPayment',
          label: 'Inicial (obligatoria)',
          type: 'number',
          required: true,
          min: 1,
          admin: {
            condition: (_, sibling) => sibling?.typesale === 'crédito',
            width: '50%',
          },
        },
        {
          name: 'interestRate',
          label: 'Tasa de interés anual (%)',
          type: 'number',
          required: true,
          min: 0,
          defaultValue: 2,
          admin: {
            step: 0.01,
            condition: (_, sibling) => sibling?.typesale === 'crédito',
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'termMonths',
          label: 'Plazo (meses)',
          type: 'number',
          required: true,
          min: 1,
          max: 72,
          defaultValue: 36,
          admin: {
            condition: (_, sibling) => sibling?.typesale === 'crédito',
            width: '50%',
            description: 'Al cambiar, se regenerará el cronograma completo (solo si no hay pagos).',
          },
        },
        {
          name: 'creditStartDate',
          label: 'Fecha de inicio del crédito',
          type: 'date',
          required: true,
          timezone: true,
          admin: {
            condition: (_, sibling) => sibling?.typesale === 'crédito',
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'amountToFinance',
      label: 'Monto a financiar (calculado)',
      type: 'number',
      admin: {
        readOnly: true,
        condition: (_, sibling) => sibling?.typesale === 'crédito',
      },
    },
    {
      name: 'monthlyPayment',
      label: 'Cuota mensual (calculada)',
      type: 'number',
      admin: {
        readOnly: true,
        condition: (_, sibling) => sibling?.typesale === 'crédito',
      },
    },

    // Relación con plan de crédito
    {
      name: 'creditPlan',
      label: 'Plan de crédito asociado',
      type: 'relationship',
      relationTo: 'creditplan',
      hasMany: false,
      admin: {
        position: 'sidebar',
        condition: (data) => data?.typesale === 'crédito',
        readOnly: true,
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
        {
          label: 'Activo',
          value: 'activo',
        },
        {
          label: 'Completado',
          value: 'completado',
        },
        {
          label: 'Pendiente',
          value: 'pendiente',
        },
        {
          label: 'Anulado',
          value: 'anulado',
        },
      ],
      defaultValue: 'activo',
    },
    {
      name: 'statusreceipt',
      label: 'Emisión de comprobante',
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
          label: 'Emitido',
          value: 'emitido',
        },
        {
          label: 'No aplicable',
          value: 'no aplicable',
        },
      ],
      defaultValue: 'pendiente',
    },
    {
      name: 'collaborator',
      label: 'Colaborador',
      type: 'relationship',
      relationTo: 'collaborator',
      required: false,
      hasMany: false,
      admin: {
        position: 'sidebar',
        allowCreate: false,
      },
    },
    {
      name: 'salereservation',
      label: 'Reservación',
      type: 'relationship',
      relationTo: 'salereservation',
      required: false,
      hasMany: false,
      admin: {
        position: 'sidebar',
        allowCreate: false,
      },
    },
    {
      name: 'saleorder',
      label: 'Pedido',
      type: 'relationship',
      relationTo: 'saleorder',
      required: false,
      hasMany: false,
      admin: {
        allowCreate: false,
        position: 'sidebar',
      },
    },
    {
      name: 'salehomewarranty',
      label: 'Garantía inmobiliaría',
      type: 'relationship',
      relationTo: 'salehomewarranty',
      required: false,
      hasMany: false,
      admin: {
        allowCreate: false,
        position: 'sidebar',
      },
    },
  ],

  hooks: {
    // BEFORECHANGE → Cálculos, validaciones Y CREAR/ACTUALIZAR PLAN (sin finalSale)
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        const { payload } = req

        if (data.typesale !== 'crédito') return data

        const principal = data.pricesale - (data.initialPayment || 0)
        if (principal <= 0) {
          throw new Error('La cuota inicial debe ser menor al precio de venta')
        }

        let currentPlanId = data.creditPlan || originalDoc?.creditPlan
        if (currentPlanId && typeof currentPlanId === 'object') {
          currentPlanId = currentPlanId.id
        }

        // Bloquear edición si ya hay pagos
        if (currentPlanId) {
          const plan = await payload.findByID({
            collection: 'creditplan',
            id: currentPlanId,
          })

          if (plan?.totalPaid > 0) {
            throw new Error(
              'No se puede modificar la venta: ya existen pagos registrados en el plan de crédito. Usa "Refinanciar" si es necesario.',
            )
          }
        }

        // CÁLCULO CON LA FÓRMULA DE LA EMPRESA (interés simple lineal) + REDONDEO A ENTERO
        const decimalInterestRate = (data.interestRate || 0) / 100
        const monthlyPayment =
          (principal * decimalInterestRate * data.termMonths + principal) / data.termMonths

        data.amountToFinance = Math.round(principal) // Redondea principal a entero (consistencia)
        data.monthlyPayment = Math.round(monthlyPayment) // Redondeo a entero más cercano (ej: 100.30 → 100, 100.50 → 101)

        // LÓGICA DE CRÉDITO
        if (!currentPlanId) {
          // === GENERAR CORRELATIVO ===
          console.log('Generando correlativo en FinalSale...')
          const year = new Date().getFullYear()
          const prefix = `CRED-${year}-`

          let nextNumber = 1
          try {
            const lastPlan = await payload.find({
              collection: 'creditplan',
              where: { creditPlanNumber: { like: `${prefix}%` } },
              sort: '-creditPlanNumber',
              limit: 1,
            })

            if (lastPlan.docs.length > 0) {
              const lastCode = lastPlan.docs[0]?.creditPlanNumber
              if (typeof lastCode === 'string') {
                const match = lastCode.match(/(\d+)$/)
                if (match) {
                  nextNumber = parseInt(match[0], 10) + 1
                }
              }
            }
          } catch (err) {
            console.error('Error buscando último plan:', err)
          }

          let creditPlanNumber = `${prefix}${String(nextNumber).padStart(4, '0')}`

          // Anti-race: Verifica unique y retry
          let isUnique = false
          let attempts = 0
          while (!isUnique && attempts < 5) {
            const existing = await payload.find({
              collection: 'creditplan',
              where: { creditPlanNumber: { equals: creditPlanNumber } },
              limit: 1,
            })
            if (existing.docs.length === 0) {
              isUnique = true
            } else {
              nextNumber++
              creditPlanNumber = `${prefix}${String(nextNumber).padStart(4, '0')}`
              attempts++
            }
          }
          if (!isUnique) {
            creditPlanNumber = `${prefix}${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000)}`
          }

          // === CREAR NUEVO PLAN (envía creditPlanNumber) ===
          const newPlan = await payload.create({
            collection: 'creditplan',
            data: {
              creditPlanNumber,
              amountToFinance: data.amountToFinance,
              monthlyPayment: data.monthlyPayment,
              startDate: data.creditStartDate,
              termMonths: data.termMonths,
              interestRate: data.interestRate as number,
              status: 'activo',
              totalPaid: 0,
              remainingBalance: principal,
            },
          })

          data.creditPlan = newPlan.id
          console.log('Seteando creditPlan en data:', newPlan.id)
        } else if (operation === 'update') {
          // ACTUALIZAR PLAN (sin tocar número)
          console.log('Actualizando creditplan existente...')
          await payload.update({
            collection: 'creditplan',
            id: currentPlanId,
            data: {
              amountToFinance: data.amountToFinance,
              monthlyPayment: data.monthlyPayment,
              startDate: data.creditStartDate,
              termMonths: data.termMonths,
              interestRate: data.interestRate as number,
              remainingBalance: principal,
            },
          })
        }

        return data
      },
    ],

    // AFTERCHANGE → Procesos post-venta + GENERAR CUOTAS + SETEAR finalSale en creditplan
    afterChange: [
      async ({ doc, operation, req }) => {
        const { payload } = req

        const {
          typesale,
          creditPlan: currentCreditPlan,
          vehicle,
          saledate,
          status,
          statusreceipt,
        } = doc

        const vehicleId = typeof vehicle === 'object' ? vehicle.id : vehicle

        // 1. PROCESOS POST-VENTA (inventario, recibo, entregas)
        if (operation === 'create' && status === 'activo' && statusreceipt === 'pendiente') {
          try {
            const inventoryResult = await payload.find({
              collection: 'inventory',
              where: { vehicle: { equals: vehicleId }, status: { not_equals: 'Vendido' } },
              depth: 1,
            })

            if (inventoryResult.docs.length > 0) {
              const item = inventoryResult.docs[0]
              const dealershipId =
                typeof item.dealership === 'object' ? item.dealership.id : item.dealership

              await payload.update({
                collection: 'inventory',
                id: item.id,
                data: { status: 'Vendido', operation: 'Venta', transactionDate: saledate },
              })

              await payload.create({
                collection: 'movements',
                data: {
                  vehicle: vehicleId,
                  company: dealershipId,
                  movementdate: saledate,
                  typemovement: 'salida',
                  motivemovement: 'Venta final',
                  warehouse: item.location,
                  status: 'activo',
                },
              })
            }

            await payload.create({
              collection: 'receiptsale',
              data: { finalsale: doc.id, status: 'pendiente' },
            })

            // Crear entregas pendientes
            const deliveryTypes: {
              type:
                | 'entrega-vehicular'
                | 'entrega-de-tive'
                | 'entrega-de-placas'
                | 'entrega-de-segunda-llave'
              label: string
            }[] = [
              { type: 'entrega-vehicular', label: 'Entrega vehicular' },
              { type: 'entrega-de-tive', label: 'Entrega de TIVE' },
              { type: 'entrega-de-placas', label: 'Entrega de placas' },
              { type: 'entrega-de-segunda-llave', label: 'Entrega de segunda llave' },
            ]
            for (const d of deliveryTypes) {
              await payload.create({
                collection: 'vehicledelivery',
                data: {
                  finalsale: doc.id,
                  typedelivery: d.type,
                  deliverydate: null,
                  statusdelivery: 'pendiente',
                  observations: `Pendiente - ${d.label}`,
                },
              })
            }
          } catch (err) {
            console.error('Error en procesos post-venta:', err)
          }
        }

        // 2. SI NO ES CRÉDITO → salir
        if (typesale !== 'crédito') return doc

        // 3. SETEAR finalSale EN CREDITPLAN + GENERAR CUOTAS
        let currentPlanId = currentCreditPlan
        if (currentPlanId && typeof currentPlanId === 'object') {
          currentPlanId = currentPlanId.id
        }

        if (currentPlanId) {
          console.log('Seteando finalSale en creditplan y generando installments...')

          // Setea finalSale en creditplan (bidireccional)
          await payload.update({
            collection: 'creditplan',
            id: currentPlanId,
            data: { finalSale: doc.id },
          })

          // Recálculo financiero
          const principal = doc.pricesale - (doc.initialPayment || 0)

          // Borra installments viejos si update
          if (operation === 'update') {
            const plan = await payload.findByID({ collection: 'creditplan', id: currentPlanId })
            if (plan.totalPaid === 0) {
              await payload.delete({
                collection: 'creditinstallment',
                where: { creditPlan: { equals: currentPlanId } },
              })
            }
          }

          // INSTANCIA DE generateInstallments (con los 6 params exactos)
          await generateInstallments(
            payload, // Payload
            currentPlanId, // planId
            principal, // financedAmount
            doc.termMonths, // termMonths
            doc.creditStartDate, // startDate
            doc.interestRate, // interestRate
          )
        }

        return doc
      },
    ],
  },

  endpoints: [
    //endpoint eliminar archivo de venta
    {
      path: '/:id/remove-file/:fileArrayId',
      method: 'delete',
      handler: async (req) => {
        try {
          //1. Acceso correcto a los parámetros de ruta
          const id = req.routeParams?.id as string
          const fileArrayId = req.routeParams?.fileArrayId as string

          if (!id || !fileArrayId) {
            return Response.json(
              { error: 'Se requieren los parámetros id y fileArrayId' },
              {
                status: 400,
                headers: headersWithCors({
                  headers: new Headers(),
                  req,
                }),
              },
            )
          }

          // 2. Obtener el documento actual
          const currentDoc = await req.payload.findByID({
            collection: 'finalsale',
            id,
            depth: 1,
            req,
          })

          if (!currentDoc) {
            return Response.json(
              { error: 'Venta final no encontrada' },
              {
                status: 404,
                headers: headersWithCors({
                  headers: new Headers(),
                  req,
                }),
              },
            )
          }

          // 3. Validación del archivo
          const fileToDelete = currentDoc.salefiles?.find((file) => file.id === fileArrayId)

          if (!fileToDelete?.mediasale) {
            return Response.json(
              { error: 'Archivo no encontrado en esta compra' },
              {
                status: 404,
                headers: headersWithCors({
                  headers: new Headers(),
                  req,
                }),
              },
            )
          }

          // 4. Eliminación segura del archivo físico
          const mediaId =
            typeof fileToDelete.mediasale === 'string'
              ? fileToDelete.mediasale
              : fileToDelete.mediasale.id

          await req.payload.delete({
            collection: 'mediasale',
            id: mediaId,
            req,
          })

          // 5. Actualización eficiente del documento
          const updatedDoc = await req.payload.update({
            collection: 'finalsale',
            id,
            data: {
              salefiles: currentDoc.salefiles?.filter((file) => file.id !== fileArrayId),
            },
            req,
          })

          // 6. Respuesta informativa
          return Response.json(
            {
              success: true,
              message: 'Archivo eliminado exitosamente',
              purchase: updatedDoc,
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
            { error: 'Error eliminando archivo', details: error },
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

    //endpoint obtener entregas pendientes
    {
      path: '/pending-deliveries',
      method: 'get',
      handler: async (req) => {
        try {
          const { payload } = req

          // 1. Inventario
          const inventoryResult = await payload.find({
            collection: 'inventory',
            where: {
              and: [
                { status: { equals: 'Vendido' } },
                { deliveryStatus: { equals: 'Pendiente de entrega' } },
              ],
            },
            depth: 1,
            limit: 0,
          })

          if (!inventoryResult.docs.length) {
            return Response.json(
              { data: [], total: 0 },
              {
                headers: headersWithCors({ headers: new Headers(), req }),
              },
            )
          }

          const vehicleIds = inventoryResult.docs
            .map((i) => (typeof i.vehicle === 'string' ? i.vehicle : i.vehicle?.id))
            .filter(Boolean)

          // 2. Consultas paralelas
          const [salesResult, vehiclesResult] = await Promise.all([
            payload.find({
              collection: 'finalsale',
              where: { 'vehicle.id': { in: vehicleIds } },
              depth: 1,
              limit: 0,
            }),
            payload.find({
              collection: 'vehicle',
              where: { id: { in: vehicleIds } },
              depth: 2,
              limit: 0,
            }),
          ])

          // 3. Clientes
          const buyerIds = salesResult.docs
            .flatMap((s) => (Array.isArray(s.customer) ? s.customer : []))
            .map((c) => (typeof c === 'string' ? c : c.id))
            .filter(Boolean)

          const buyersResult =
            buyerIds.length > 0
              ? await payload.find({
                  collection: 'buyer',
                  where: { id: { in: buyerIds } },
                  depth: 0,
                  limit: 0,
                })
              : { docs: [] }

          // 4. Mapas
          const vehicleMap = Object.fromEntries(
            vehiclesResult.docs.map((v) => {
              const brand = v.brand
                ? typeof v.brand === 'string'
                  ? v.brand
                  : v.brand.brand || ''
                : ''
              const model = v.model
                ? typeof v.model === 'string'
                  ? v.model
                  : v.model.model || ''
                : ''
              const version = v.version
                ? typeof v.version === 'string'
                  ? v.version
                  : v.version.version || ''
                : ''
              const color = v.color
                ? typeof v.color === 'string'
                  ? v.color
                  : v.color.color || ''
                : ''
              const year = v.yearmodel || ''

              const vehicleStr =
                `${brand} ${model} ${color} ${year} / ${version}`.trim().replace(/\s+/g, ' ') ||
                '[Sin datos]'

              return [
                v.id,
                {
                  vehicleID: v.id,
                  vehicle: vehicleStr,
                  vin: v.vin ? `CH: ${v.vin}` : '',
                  motor: v.motor ? `MT: ${v.motor}` : '',
                  year: v.yearmodel || null,
                  plate: v.licensePlates?.licensePlatesNumber || null,
                },
              ]
            }),
          )

          const buyerMap = Object.fromEntries(
            buyersResult.docs.map((b) => [
              b.id,
              {
                id: b.id,
                name: b.fullname || '[Sin nombre]',
                document: b.identificationnumber || null,
                phone: b.numbermovil || null,
                email: b.email || null,
              },
            ]),
          )

          const saleMap = Object.fromEntries(
            salesResult.docs.map((s) => [
              typeof s.vehicle === 'string' ? s.vehicle : s.vehicle?.id,
              s,
            ]),
          )

          // 5. Resultado
          const result = inventoryResult.docs.map((item) => {
            const vehicleId = typeof item.vehicle === 'string' ? item.vehicle : item.vehicle?.id
            const sale = saleMap[vehicleId]
            const vehicle = vehicleMap[vehicleId] || {
              vehicle: '[Vehículo no encontrado]',
              vehicleId,
              vin: '',
              motor: '',
              color: null,
              year: null,
              plate: null,
            }

            const customers =
              sale && Array.isArray(sale.customer)
                ? sale.customer.map((c) => {
                    const buyerId = typeof c === 'string' ? c : c.id
                    return buyerMap[buyerId] || { id: buyerId, name: '[No encontrado]' }
                  })
                : []

            return {
              id: sale?.id || item.id, // ← Usa sale.id o inventory.id como fallback
              saleId: sale?.id || null,
              saledate: sale?.saledate || null,
              typesale: sale?.typesale || null,
              pricesale: sale?.pricesale || null,
              status: sale?.status || null,
              statusreceipt: sale?.statusreceipt || null,
              customers,
              vehicle,
              inventory: {
                id: item.id,
                location:
                  typeof item.location === 'string' ? item.location : item.location?.id || null,
                transactionDate: item.transactionDate || null,
                dealership: item.dealership
                  ? typeof item.dealership === 'string'
                    ? item.dealership
                    : {
                        id: item.dealership.id,
                        name: item.dealership.companyname || '[Sin nombre]',
                      }
                  : null,
              },
            }
          })

          return Response.json(
            { docs: result, total: result.length },
            { headers: headersWithCors({ headers: new Headers(), req }) },
          )
        } catch (error) {
          console.error('Error en /pending-deliveries:', error)
          return Response.json(
            { error: 'Error interno', details: error },
            { status: 500, headers: headersWithCors({ headers: new Headers(), req }) },
          )
        }
      },
    },
  ],
}
