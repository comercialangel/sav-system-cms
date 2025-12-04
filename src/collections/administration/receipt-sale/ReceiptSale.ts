import type { CollectionConfig } from 'payload'

export const ReceiptSale: CollectionConfig = {
  slug: 'receiptsale',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Ventas vehiculares',
  },
  labels: {
    singular: 'Comprobante de venta',
    plural: 'Comprobantes de venta',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'finalsale',
          label: 'Venta vehicular final',
          type: 'relationship',
          relationTo: 'finalsale',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },
        {
          name: 'internalsales',
          label: 'Venta vehicular interna',
          type: 'relationship',
          relationTo: 'internal-sales',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },

        {
          name: 'issuedate',
          label: 'Fecha de emisión',
          type: 'date',
          required: false,
          timezone: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'typecurrency',
          label: 'Tipo de moneda',
          type: 'relationship',
          relationTo: 'typecurrency',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },
        {
          name: 'exchangerate',
          label: 'Tipo de cambio',
          type: 'number',
          defaultValue: 1,
          required: false,
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
          name: 'typereceipt',
          label: 'Tipo de comprobante',
          type: 'relationship',
          relationTo: 'typereceipt',
          required: false,
          hasMany: false,
          admin: {
            width: '33%',
            allowCreate: false,
          },
        },
        {
          name: 'receiptnumber',
          label: 'Número de comprobante',
          type: 'text',
          required: false,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'receiptvalue',
          label: 'Valor de comprobante',
          type: 'text',
          required: false,
          admin: {
            width: '34%',
          },
        },
      ],
    },
    {
      name: 'mediareceipt',
      label: 'Comprobante de venta',
      type: 'upload',
      relationTo: 'mediareceipt',
      required: false,
    },
    {
      name: 'observations',
      label: 'Observaciones',
      type: 'textarea',
      required: false,
    },
    {
      name: 'cancellation',
      label: 'Anulación de comprobante',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'cancellationdate',
              label: 'Fecha de cancelación',
              type: 'date',
              required: false,
              admin: {
                width: '33%',
              },
            },
            {
              name: 'motivecancellationreceiptsale',
              label: 'Motivo de cancelación',
              type: 'relationship',
              relationTo: 'motivecancellationreceiptsale',
              required: false,
              hasMany: false,
              admin: {
                width: '67%',
                allowCreate: true,
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'typereceiptcancellation',
              label: 'Tipo de comprobante',
              type: 'relationship',
              relationTo: 'typereceipt',
              required: false,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: false,
              },
            },
            {
              name: 'receiptnumbercancellation',
              label: 'Número de comprobante',
              type: 'text',
              required: false,
              admin: {
                width: '33%',
              },
            },
          ],
        },
        {
          name: 'mediareceiptcancellation',
          label: 'Comprobante de anulación',
          type: 'upload',
          relationTo: 'mediareceipt',
          required: false,
        },
        {
          name: 'observationscancellation',
          label: 'Observaciones de cancelación',
          type: 'textarea',
          required: false,
        },
      ],
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
          label: 'Pendiente',
          value: 'pendiente',
        },
        {
          label: 'Generado',
          value: 'generado',
        },
        {
          label: 'No aplicable',
          value: 'no aplicable',
        },
        {
          label: 'Anulado',
          value: 'anulado',
        },
      ],
      defaultValue: 'pendiente',
    },
  ],
}
