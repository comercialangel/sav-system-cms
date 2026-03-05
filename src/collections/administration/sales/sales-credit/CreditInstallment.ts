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
      name: 'lateFee', //ejem, 200
      label: 'Multa por mora',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'lateFeeForgiven', //montos de mora perdonados/condonados (ej: 150 de los 200 de mora fue perdonado)
      label: 'Mora Condonada/Perdonada',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'lateFeePaid', //montos de mora pagados (ej: 50 de los 200 de mora fue pagado)
      label: 'Mora Pagada en Efectivo',
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
        { label: 'Refinanciada', value: 'refinanciada' },
        { label: 'Reprogramada', value: 'reprogramada' },
        { label: 'Liquidada', value: 'liquidada' }, // NUEVO: Para las cuotas que mueren en la liquidación
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
      hasMany: true,
    },
  ],
  // hooks: {
  //   afterChange: [
  //     async ({ doc, operation, req }) => {
  //       // Solo nos importa si se hizo un pago manual
  //       if (operation !== 'update') return doc

  //       // Si el Cron está corriendo, evitamos recursividad con este contexto
  //       if (req.context.skipMoraCalculation) return doc

  //       // LÓGICA ÚNICA: ACTUALIZAR ESTADO DEL PLAN (Padre)
  //       // Esto verifica si al pagar esta cuota, el plan se completa.
  //       try {
  //         const planId = typeof doc.creditPlan === 'object' ? doc.creditPlan.id : doc.creditPlan
  //         const { payload } = req

  //         // Usamos counts para ser eficientes
  //         const [lateCount, totalCount, paidCount] = await Promise.all([
  //           payload.count({
  //             collection: 'creditinstallment',
  //             where: { creditPlan: { equals: planId }, lateFee: { greater_than: 0 } },
  //             req,
  //           }),
  //           payload.count({
  //             collection: 'creditinstallment',
  //             where: { creditPlan: { equals: planId } },
  //             req,
  //           }),
  //           payload.count({
  //             collection: 'creditinstallment',
  //             where: { creditPlan: { equals: planId }, status: { equals: 'pagada' } },
  //             req,
  //           }),
  //         ])

  //         const hasLate = lateCount.totalDocs > 0
  //         const isFullyPaid =
  //           paidCount.totalDocs === totalCount.totalDocs && totalCount.totalDocs > 0

  //         let newPlanStatus = 'activo' as 'activo' | 'completado' | 'moroso'
  //         if (isFullyPaid) newPlanStatus = 'completado'
  //         else if (hasLate) newPlanStatus = 'moroso'

  //         // Solo hacemos update si es necesario (leemos status actual o lanzamos update ciegamente)
  //         // Lanzarlo ciegamente es barato:
  //         await payload.update({
  //           collection: 'creditplan',
  //           id: planId,
  //           data: { status: newPlanStatus },
  //           req,
  //         })
  //       } catch (e) {
  //         console.error('Error actualizando estado del plan:', e)
  //       }
  //       return doc
  //     },
  //   ],
  // },
}
