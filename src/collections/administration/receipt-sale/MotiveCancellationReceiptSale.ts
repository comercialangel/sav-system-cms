import type { CollectionConfig } from 'payload'

export const MotiveCancellationReceiptSale: CollectionConfig = {
  slug: 'motivecancellationreceiptsale',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'motivecancellation',
    group: 'Ventas vehiculares',
  },
  labels: {
    singular: 'Motivo de cancelación de comprobante de venta',
    plural: 'Motivo de cancelaciones de comprobantes de ventas',
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
