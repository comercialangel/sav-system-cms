import type { CollectionConfig } from 'payload'

export const PeriodPayment: CollectionConfig = {
  slug: 'periodpayment',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'periodpayment',
    group: 'Ventas vehiculares',
  },
  labels: {
    singular: 'Periodo de pago vehicular',
    plural: 'Periodos de pagos vehiculares',
  },
  fields: [
    {
      name: 'periodpayment',
      label: 'Periodo',
      type: 'text',
      required: true,
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
