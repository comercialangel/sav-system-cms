import type { CollectionConfig } from 'payload'

export const ExpenseProcedureAAP: CollectionConfig = {
  slug: 'expenseprocedureaap',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'expense',
    group: 'Trámites vehiculares',
  },
  labels: {
    singular: 'Concepto de costo de trámite AAP',
    plural: 'Conceptos de costos de trámite AAP',
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
