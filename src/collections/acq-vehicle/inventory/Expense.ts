import type { CollectionConfig } from 'payload'

export const Expense: CollectionConfig = {
  slug: 'expense',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'expense',
    group: 'Control de inventario vehicular',
  },
  labels: {
    singular: 'Concepto de gasto de traslado',
    plural: 'Conceptos de gastos de traslado',
  },
  fields: [
    {
      name: 'expense',
      label: 'concepto de gasto',
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
