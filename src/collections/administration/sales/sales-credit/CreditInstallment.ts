// collections/CreditInstallment.ts
import type { CollectionConfig } from 'payload'

export const CreditInstallment: CollectionConfig = {
  slug: 'creditinstallment',
  access: {
    read: () => true,
    create: () => false, // Solo desde generateInstallments
    update: () => false, // Solo desde CreditPayment (via hook)
    // delete: () => false, // Auditoría permanente
  },
  admin: {
    useAsTitle: 'installmentNumber',
    group: 'Créditos',
  },
  labels: { singular: 'Cuota', plural: 'Cuotas' },
  fields: [
    // === NÚMERO DE CUOTA ===
    {
      name: 'installmentNumber',
      label: 'Número de cuota',
      type: 'number',
      required: true,
      min: 1,
      admin: { readOnly: true },
    },

    // === FECHAS ===
    {
      name: 'dueDate',
      label: 'fecha de vencimiento',
      type: 'date',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'paidDate',
      label: 'fecha de pago',
      type: 'date',
      admin: { readOnly: true },
    },

    // === DESGLOSE DE MONTOS ===
    {
      name: 'principal',
      label: 'Capital por cuota',
      type: 'number',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'interest',
      label: 'Interés por cuota',
      type: 'number',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'totalDue',
      label: 'Cuota total',
      type: 'number',
      required: true,
      admin: { readOnly: true },
    },

    // === PAGOS ===
    {
      name: 'paidAmount',
      label: 'Monto pagado',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },

    // === MORA ===
    {
      name: 'daysLate',
      label: 'Días de mora',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'lateFee',
      label: 'Multa por mora',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },

    // === ESTADO ===
    {
      name: 'status',
      label: 'Estado de cuota',
      type: 'select',
      required: true,
      defaultValue: 'pendiente',
      options: [
        { label: 'Pendiente', value: 'pendiente' },
        { label: 'Parcial', value: 'parcial' },
        { label: 'Pagada', value: 'pagada' },
        { label: 'Vencida', value: 'vencida' },
      ],
      admin: { readOnly: true },
    },

    // === RELACIONES ===
    {
      name: 'creditPlan',
      label: 'Plan de crédito asociado',
      type: 'relationship',
      relationTo: 'creditplan',
      required: true,
      hasMany: false,
      index: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'payments',
      label: 'Pagos asociados',
      type: 'join',
      collection: 'creditpayment',
      on: 'installments',
      hasMany: false,
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // Solo nos importa si se hizo un pago manual
        if (operation !== 'update') return doc

        // Si el Cron está corriendo, evitamos recursividad con este contexto
        if (req.context.skipMoraCalculation) return doc

        // LÓGICA ÚNICA: ACTUALIZAR ESTADO DEL PLAN (Padre)
        // Esto verifica si al pagar esta cuota, el plan se completa.
        try {
          const planId = typeof doc.creditPlan === 'object' ? doc.creditPlan.id : doc.creditPlan
          const { payload } = req

          // Usamos counts para ser eficientes
          const [lateCount, totalCount, paidCount] = await Promise.all([
            payload.count({
              collection: 'creditinstallment',
              where: { creditPlan: { equals: planId }, lateFee: { greater_than: 0 } },
            }),
            payload.count({
              collection: 'creditinstallment',
              where: { creditPlan: { equals: planId } },
            }),
            payload.count({
              collection: 'creditinstallment',
              where: { creditPlan: { equals: planId }, status: { equals: 'pagada' } },
            }),
          ])

          const hasLate = lateCount.totalDocs > 0
          const isFullyPaid =
            paidCount.totalDocs === totalCount.totalDocs && totalCount.totalDocs > 0

          let newPlanStatus = 'activo' as 'activo' | 'completado' | 'moroso'
          if (isFullyPaid) newPlanStatus = 'completado'
          else if (hasLate) newPlanStatus = 'moroso'

          // Solo hacemos update si es necesario (leemos status actual o lanzamos update ciegamente)
          // Lanzarlo ciegamente es barato:
          await payload.update({
            collection: 'creditplan',
            id: planId,
            data: { status: newPlanStatus },
          })
        } catch (e) {
          console.error('Error actualizando estado del plan:', e)
        }
        return doc
      },
    ],
  },

  // hooks: {
  //   afterChange: [
  //     async ({ doc, operation, req: { payload } }) => {
  //       if (!['create', 'update'].includes(operation)) return doc

  //       // Evitar si es actualización por pago (para no recalcular mora cada vez)
  //       if (operation === 'update' && doc.paidAmount > 0) return doc

  //       // ←←← LA CLAVE: extraer el ID del plan correctamente
  //       const planId = typeof doc.creditPlan === 'object' ? doc.creditPlan.id : doc.creditPlan

  //       // === CÁLCULO DE MORA ===
  //       let daysLate = 0
  //       let lateFee = 0
  //       let status = doc.status

  //       if (!['pagada', 'parcial'].includes(doc.status)) {
  //         const today = new Date()
  //         today.setHours(0, 0, 0, 0)
  //         const dueDate = new Date(doc.dueDate)
  //         dueDate.setHours(0, 0, 0, 0)

  //         if (today > dueDate) {
  //           daysLate = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

  //           // Obtener tasa de mora del plan
  //           const plan = await payload.findByID({
  //             collection: 'creditplan',
  //             id: planId, // ← ahora sí es string
  //           })

  //           const dailyRate = plan?.lateFeeRate || 0.01
  //           const debt = doc.totalDue - (doc.paidAmount || 0)
  //           lateFee = Math.round(debt * dailyRate * daysLate * 100) / 100

  //           status = 'vencida'
  //         } else {
  //           status = 'pendiente'
  //         }
  //       }

  //       const needsUpdate =
  //         doc.daysLate !== daysLate || doc.lateFee !== lateFee || doc.status !== status

  //       if (needsUpdate) {
  //         await payload.update({
  //           collection: 'creditinstallment',
  //           id: doc.id,
  //           data: { daysLate, lateFee, status },
  //         })
  //       }

  //       // === ACTUALIZAR ESTADO DEL PLAN ===
  //       const { docs: allInstallments } = await payload.find({
  //         collection: 'creditinstallment',
  //         where: { creditPlan: { equals: planId } }, // ← también aquí usamos planId
  //         pagination: false,
  //       })

  //       const hasLate = allInstallments.some((i) => (i.lateFee || 0) > 0)
  //       const allPaid = allInstallments.every((i) => i.status === 'pagada')

  //       const newPlanStatus = allPaid ? 'completado' : hasLate ? 'moroso' : 'activo'

  //       await payload.update({
  //         collection: 'creditplan',
  //         id: planId, // ← AHORA SÍ: string correcto
  //         data: { status: newPlanStatus },
  //       })

  //       return doc
  //     },
  //   ],
  // },

  // hooks: {
  //   afterChange: [
  //     async ({ doc, operation, req }) => {
  //       const { payload, context } = req

  //       if (!['create', 'update'].includes(operation)) return doc

  //       // Evitar loops infinitos
  //       if (context.skipMoraCalculation) return doc

  //       // Evitar si es actualización por pago (para no recalcular mora cada vez)
  //       if (operation === 'update' && doc.paidAmount > 0) return doc

  //       // Extraer planId correctamente
  //       const planId = typeof doc.creditPlan === 'object' ? doc.creditPlan.id : doc.creditPlan

  //       try {
  //         // === CÁLCULO DE MORA ===
  //         let daysLate = 0
  //         let lateFee = 0
  //         let status = doc.status

  //         if (!['pagada', 'parcial'].includes(doc.status)) {
  //           const today = new Date()
  //           today.setHours(0, 0, 0, 0)
  //           const dueDate = new Date(doc.dueDate)
  //           dueDate.setHours(0, 0, 0, 0)

  //           if (today > dueDate) {
  //             daysLate = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

  //             // Obtener tasa de mora del plan
  //             const plan = await payload.findByID({
  //               collection: 'creditplan',
  //               id: planId,
  //             })

  //             const dailyRate = plan?.lateFeeRate || 0.01
  //             const debt = doc.totalDue - (doc.paidAmount || 0)
  //             lateFee = Math.round(debt * dailyRate * daysLate * 100) / 100

  //             status = 'vencida'
  //           } else {
  //             status = 'pendiente'
  //           }
  //         }

  //         const needsUpdate =
  //           doc.daysLate !== daysLate || doc.lateFee !== lateFee || doc.status !== status

  //         if (needsUpdate) {
  //           await payload.update({
  //             collection: 'creditinstallment',
  //             id: doc.id,
  //             data: { daysLate, lateFee, status },
  //             context: { skipMoraCalculation: true }, // ← Evita loop
  //           })
  //         }

  //         // === ACTUALIZAR ESTADO DEL PLAN (optimizado: usa counts en lugar de find all) ===
  //         const [lateCount, totalCount, paidCount] = await Promise.all([
  //           payload.count({
  //             collection: 'creditinstallment',
  //             where: { creditPlan: { equals: planId }, lateFee: { greater_than: 0 } },
  //           }),
  //           payload.count({
  //             collection: 'creditinstallment',
  //             where: { creditPlan: { equals: planId } },
  //           }),
  //           payload.count({
  //             collection: 'creditinstallment',
  //             where: { creditPlan: { equals: planId }, status: { equals: 'pagada' } },
  //           }),
  //         ])

  //         const hasLate = lateCount.totalDocs > 0
  //         const allPaid = paidCount.totalDocs === totalCount.totalDocs

  //         const newPlanStatus = allPaid ? 'completado' : hasLate ? 'moroso' : 'activo'

  //         await payload.update({
  //           collection: 'creditplan',
  //           id: planId,
  //           data: { status: newPlanStatus },
  //         })

  //         return doc
  //       } catch (err) {
  //         console.error('Error en hook afterChange de CreditInstallment:', err)
  //         return doc // No falla la operación
  //       }
  //     },
  //   ],
  // },

  // collections/CreditInstallment.ts
}
