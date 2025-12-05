import type { CollectionConfig } from 'payload'
export const PurchaseInvoice: CollectionConfig = {
  slug: 'purchaseinvoice',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Adquisiciones vehiculares',
  },
  labels: {
    singular: 'Comprobante de compra',
    plural: 'Comprobantes de compras',
  },

  fields: [
    {
      name: 'purchase',
      label: 'Compra asociada',
      type: 'relationship',
      relationTo: 'purchase',
      required: true,
      index: true,
      maxDepth: 0,
    },
    {
      name: 'noreceipt',
      label: 'Sin comprobante de compra',
      type: 'checkbox',
      required: false,
      defaultValue: false,
      admin: {
        description:
          'Al elegir esta opción, solo se registrarán los datos de identificación del vehículo.La información del comprobante de compra no será guardada, pues este no es aplicable.',
      },
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
            width: '100%',
            condition: (data) => !data?.noreceipt, // Solo mostrar si no es "Sin comprobante"
          },
        },
        {
          name: 'receiptnumber',
          label: 'Número de comprobante',
          type: 'text',
          required: false,
          admin: {
            width: '50%',
            condition: (data) => !data?.noreceipt, // Solo mostrar si no es "Sin comprobante"
          },
        },
        {
          name: 'receiptdate',
          label: 'Fecha de comprobante',
          type: 'date',
          required: false,
          timezone: true,
          admin: {
            width: '50%',
            condition: (data) => !data?.noreceipt, // Solo mostrar si no es "Sin comprobante"
            date: {
              displayFormat: 'd MMM yyy',
            },
          },
        },
      ],
    },
    {
      name: 'vehicle',
      label: 'Vehículo',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'vin',
              label: 'Número de serie (VIN)',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
              },
            },

            {
              name: 'motor',
              label: 'Número de motor',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'invoicefiles',
      label: 'Adjuntar factura, boleta u otros documentos',
      type: 'array',
      labels: {
        singular: 'Documento',
        plural: 'Documentos',
      },
      required: false,
      admin: {
        condition: (data) => !data?.noreceipt, // Solo mostrar si no es "Sin comprobante"
      },
      fields: [
        {
          name: 'mediainvoice',
          label: 'Documento',
          type: 'upload',
          relationTo: 'mediapurchaseinvoice',
          required: false,
        },
      ],
    },
    {
      name: 'observations',
      label: 'Observaciones',
      type: 'textarea',
      required: false,
    },
    {
      type: 'relationship',
      name: 'createdBy',
      label: 'Creado por',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
        allowEdit: false,
      },
    },
    {
      type: 'relationship',
      name: 'updatedBy',
      label: 'Actualizado por',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
        allowEdit: false,
      },
    },
  ],

  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create' || operation === 'update') {
          const { payload } = req

          const { purchase, noreceipt } = doc

          if (purchase) {
            await payload.update({
              collection: 'purchase',
              id: purchase,
              data: {
                // invoice: doc.id, // Asignamos la invoice a la Compra
                statusreceipt: noreceipt ? 'no aplicable' : 'recibido',
              },
            })
          }
        }
      },
    ],
  },
}
