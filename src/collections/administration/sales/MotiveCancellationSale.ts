import type { CollectionConfig } from 'payload'

export const MotiveCancellationSale: CollectionConfig = {
  slug: 'motivecancellationsale',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'motivecancellation',
    group: 'Ventas vehiculares',
  },
  labels: {
    singular: 'Motivo de cancelación de venta',
    plural: 'Motivos de cancelaciones de ventas',
  },
  fields: [
    {
      name: 'motivecancellation',
      label: 'Motivo de cancelación',
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
