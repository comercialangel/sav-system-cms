// collections/CreditPlan.ts
import type { CollectionConfig } from 'payload'

export const CreditPlan: CollectionConfig = {
  slug: 'creditplan',
  access: {
    // Esto es lo que usan el 99% de proyectos reales
    create: () => true, // ← necesario para que el hook cree el plan
    read: () => true,
    update: ({ req }) => !!req.user,
  },
  labels: { singular: 'Plan de Crédito', plural: 'Planes de Crédito' },
  admin: {
    useAsTitle: 'creditPlanNumber',
    group: 'Créditos',
  },
  fields: [
    // === Número único ===
    {
      name: 'creditPlanNumber',
      label: 'Correlativo de crédito',
      type: 'text',
      unique: true,
      index: true,
      required: true,
      admin: { readOnly: true },
    },

    // === Venta ===
    {
      name: 'finalSale',
      type: 'relationship',
      relationTo: 'finalsale',
      hasMany: false,
      index: true,
    },

    // === Parámetros (copiados de FinalSale) ===
    {
      name: 'amountToFinance',
      label: 'Monto a financiar',
      type: 'number',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'monthlyPayment',
      label: 'Cuota mensual',
      type: 'number',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'startDate',
      label: 'Fecha de inicio del crédito',
      type: 'date',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'termMonths',
      label: 'Plazo (meses)',
      type: 'number',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'interestRate',
      label: 'Tasa de interés anual (%)',
      type: 'number',
      required: true,
      admin: { readOnly: true },
    },

    // === REFINANCIAMIENTO (BIDIRECCIONAL) ===
    {
      name: 'parentPlan',
      label: 'Refinanciamiento asociado',
      type: 'relationship',
      relationTo: 'creditplan',
      hasMany: false,
      admin: {
        description: 'Plan del que proviene este (si fue refinanciado)',
        position: 'sidebar',
      },
    },
    {
      name: 'refinancedPlans',
      label: 'Historial de refinaciamientos',
      type: 'relationship',
      relationTo: 'creditplan',
      hasMany: true,
      admin: {
        description: 'Planes generados a partir de este',
        position: 'sidebar',
        isSortable: true,
      },
      filterOptions: ({ id }) => ({
        parentPlan: { equals: id },
      }),
    },
    {
      name: 'refinancingReason',
      label: 'Motivo de refinanciamiento',
      type: 'select',
      options: [
        { label: 'Mora', value: 'mora' },
        { label: 'Mejor tasa', value: 'mejor_tasa' },
        { label: 'Extensión de plazo', value: 'extension_plazo' },
        { label: 'Otro', value: 'otro' },
      ],
      admin: {
        condition: ({ parentPlan }) => !!parentPlan,
      },
    },

    // === Estado financiero ===
    {
      name: 'totalPaid',
      label: 'Pago total',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'remainingBalance',
      label: 'Saldo pendiente (balance de pago)',
      type: 'number',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'lateFeeRate',
      label: 'Tasa fija por mora',
      type: 'number',
      defaultValue: 0.01, // 1% diario
      admin: { description: 'Tasa diaria de mora (ej: 0.01 = 1%)' },
    },

    {
      name: 'status',
      label: 'Estado de plan de crédito',
      type: 'select',
      defaultValue: 'activo',
      admin: { position: 'sidebar' },
      options: ['activo', 'refinanciado', 'reprogramado', 'completado', 'moroso', 'cancelado'],
      index: true,
    },

    // === Cuotas ===
    {
      name: 'installments',
      label: 'Cuotas asociadas a crédito',
      type: 'join',
      collection: 'creditinstallment',
      on: 'creditPlan',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
  ],
}
