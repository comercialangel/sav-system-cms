import type { CollectionConfig } from 'payload'

export const ExpenseProcedureTitleTransfer: CollectionConfig = {
  slug: 'expenseproceduretitletransfer',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'expense',
    group: 'Trámites vehiculares',
  },
  labels: {
    singular: 'Concepto de costo de trámite de transferencia de titularidad vehicular',
    plural: 'Conceptos de costos de trámite de transferencia de titularidad vehicular',
  },
  fields: [
    {
      name: 'expense',
      label: 'Concepto',
      type: 'text',
      required: true,
      unique: true,
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
          label: 'Inactivo',
          value: 'inactivo',
        },
      ],
      defaultValue: 'activo',
    },
  ],
}
