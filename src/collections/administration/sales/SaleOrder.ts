import type { CollectionConfig } from 'payload'

export const SaleOrder: CollectionConfig = {
  slug: 'saleorder',
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
    singular: 'Pedido vehicular',
    plural: 'Pedidos vehiculares',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'dateorder',
          label: 'Fecha de pedido',
          type: 'date',
          required: true,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'collaborator',
          label: 'Colaborador',
          type: 'relationship',
          relationTo: 'collaborator',
          required: true,
          hasMany: false,
          admin: {
            width: '67%',
            allowCreate: false,
          },
        },
      ],
    },
    {
      name: 'buyers',
      label: 'Comprador(es)',
      type: 'array',
      labels: {
        singular: 'Comprador',
        plural: 'Compradores',
      },
      required: true,
      fields: [
        {
          name: 'buyer',
          label: 'Comprador',
          type: 'relationship',
          relationTo: 'buyer',
          required: true,
          hasMany: false,
          admin: {
            allowCreate: true,
          },
        },
      ],
    },
    {
      name: 'vehicle',
      label: 'Unidad vehicular',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'brand',
              label: 'Marca',
              type: 'relationship',
              relationTo: 'brand',
              required: true,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: false,
              },
            },
            {
              name: 'model',
              label: 'Modelo',
              type: 'relationship',
              relationTo: 'model',
              required: true,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: false,
              },
            },
            {
              name: 'version',
              label: 'Versión',
              type: 'relationship',
              relationTo: 'version',
              required: true,
              hasMany: false,
              admin: {
                width: '34%',
                allowCreate: false,
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'color',
              label: 'Color',
              type: 'relationship',
              relationTo: 'color',
              required: true,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: false,
              },
            },
            {
              name: 'yeardmodel',
              label: 'Año de modelo',
              type: 'text',
              required: true,
              admin: {
                width: '33%',
              },
            },
            {
              name: 'fuel',
              label: 'Combustible',
              type: 'relationship',
              relationTo: 'fuel',
              required: true,
              hasMany: false,
              admin: {
                width: '34%',
                allowCreate: false,
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'typecurrency',
              label: 'Tipo de moneda',
              type: 'relationship',
              relationTo: 'typecurrency',
              required: true,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: false,
              },
            },
            {
              name: 'pricesale',
              label: 'Precio de venta',
              type: 'text',
              required: true,
              admin: {
                width: '33%',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'condition',
      label: 'Condición de pedido',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'typesale',
              label: 'Tipo de venta',
              type: 'select',
              required: false,
              admin: {
                width: '33%',
              },
              options: [
                {
                  label: 'Contado',
                  value: 'contado',
                },
                {
                  label: 'Crédito',
                  value: 'crédito',
                },
              ],
            },
            {
              name: 'typecurrency',
              label: 'Tipo de moneda',
              type: 'relationship',
              relationTo: 'typecurrency',
              required: true,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: false,
              },
            },
            {
              name: 'exchargerate',
              label: 'Tipo de cambio',
              type: 'text',
              required: false,
              admin: {
                width: '34%',
              },
            },
          ],
        },
        {
          name: 'credit',
          label: 'Crédito',
          type: 'group',
          admin: {
            description:
              'Esta sección debe ser llenado exclusivamente para pedidos con ventas al crédito',
          },
          fields: [
            {
              name: 'nodownpayment',
              label: 'Crédito sin inicial',
              type: 'checkbox',
              required: false,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'typecurrencydownpayment',
                  label: 'Tipo de moneda de inicial pactada',
                  type: 'relationship',
                  relationTo: 'typecurrency',
                  required: true,
                  hasMany: false,
                  admin: {
                    width: '50%',
                    allowCreate: false,
                  },
                },
                {
                  name: 'downpaymentvalue',
                  label: 'Valor de inicial pactada',
                  type: 'text',
                  required: true,
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
                  name: 'periodpayment',
                  label: 'Periodo de pago',
                  type: 'relationship',
                  relationTo: 'periodpayment',
                  required: false,
                  hasMany: false,
                  admin: {
                    width: '33%',
                    allowCreate: true,
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'interest',
                  label: 'Interés',
                  type: 'text',
                  required: false,
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'quotanumber',
                  label: 'Nro. de cuota',
                  type: 'text',
                  required: false,
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'quotavalue',
                  label: 'Valor de cuota',
                  type: 'text',
                  required: false,
                  admin: {
                    width: '34%',
                  },
                },
              ],
            },
            {
              name: 'observationcredit',
              label: 'Observaciones de crédito',
              type: 'textarea',
              required: false,
            },
          ],
        },
        {
          name: 'observationcodition',
          label: 'Observaciones de condición de pedido',
          type: 'textarea',
          required: false,
        },
      ],
    },
    {
      name: 'penalty',
      label: 'Penalidad por desestimiento',
      type: 'group',
      admin: {
        description:
          'En esta cláusula se establece la penalización aplicable en caso de resolución unilateral del contrato por parte del comprador',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'typecurrencypenalty',
              label: 'Tipo de moneda de penalidad',
              type: 'relationship',
              relationTo: 'typecurrency',
              required: true,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: false,
              },
            },
            {
              name: 'valuepenalty',
              label: 'Valor de penalidad',
              type: 'text',
              required: false,
              admin: {
                width: '34%',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'listcost',
      label: 'Lista de pagos',
      type: 'array',
      labels: {
        singular: 'Pago',
        plural: 'Pagos',
      },
      required: false,
      admin: {
        description: 'Pagos realizados para pedido de la unidad vehicular',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'saledate',
              label: 'Fecha de pago',
              type: 'date',
              required: true,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'typepayment',
              label: 'Tipo de pago',
              type: 'relationship',
              relationTo: 'typepayment',
              required: true,
              hasMany: false,
              admin: {
                width: '50%',
                allowCreate: false,
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'typecurrencyreceived',
              label: 'Tipo de moneda de venta',
              type: 'relationship',
              relationTo: 'typecurrency',
              required: true,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: false,
              },
            },
            {
              name: 'exchargeratereceived',
              label: 'Tipo de cambio',
              type: 'date',
              required: true,
              admin: {
                width: '33%',
              },
            },
            {
              name: 'valuereceived',
              label: 'Valor recibido',
              type: 'text',
              required: true,
              admin: {
                width: '34%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'accountcompany',
              label: 'Tipo de moneda de venta',
              type: 'relationship',
              relationTo: 'accountcompany',
              required: true,
              hasMany: false,
              admin: {
                width: '67%',
                allowCreate: false,
              },
            },
            {
              name: 'operationnumber',
              label: 'Número de operación',
              type: 'text',
              required: true,
              admin: {
                width: '33%',
              },
            },
          ],
        },
        {
          name: 'mediacost',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediasale',
          required: false,
        },
        {
          name: 'observationscost',
          label: 'Obseravciones',
          type: 'textarea',
          required: false,
        },
      ],
    },
    {
      name: 'orderfiles',
      label: 'Archvios de pedido',
      type: 'array',
      required: false,
      labels: {
        singular: 'Archivo',
        plural: 'Archivos',
      },
      fields: [
        {
          name: 'mediaorder',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediaordersale',
          required: true,
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
      name: 'cancellation',
      label: 'Anulación de pedido',
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
              name: 'motivecancellationsale',
              label: 'Motivo de cancelación',
              type: 'relationship',
              relationTo: 'motivecancellationsale',
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
          name: 'penaltycollection',
          label: 'Cobro de penalidad',
          type: 'group',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'typecurrencypenaltycollection',
                  label: 'Tipo de moneda',
                  type: 'relationship',
                  relationTo: 'typecurrency',
                  required: true,
                  hasMany: false,
                  admin: {
                    width: '33%',
                    allowCreate: false,
                  },
                },
                {
                  name: 'exchargeratepenaltycollection',
                  label: 'Tipo de cambio',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'valuepenaltycollection',
                  label: 'Valor de penalidad',
                  type: 'date',
                  required: true,
                  admin: {
                    width: '34%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'typepaymentpenaltycollection',
                  label: 'Tipo de devolución',
                  type: 'relationship',
                  relationTo: 'typepayment',
                  required: true,
                  hasMany: false,
                  admin: {
                    width: '33%',
                    allowCreate: false,
                  },
                },
              ],
            },
            {
              name: 'mediareturn',
              label: 'Documento de conformidad de devolución',
              type: 'upload',
              relationTo: 'mediaordersale',
              required: false,
            },
            {
              name: 'mediareturnpenalty',
              label: 'Voucher de devolución',
              type: 'upload',
              relationTo: 'mediaordersale',
              required: false,
            },
            {
              name: 'observationspenaltycollection',
              label: 'Observaciones de cobro de penalidad',
              type: 'textarea',
              required: false,
            },
          ],
        },
        {
          name: 'observationscancellation',
          label: 'Observaciones',
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
          label: 'En proceso',
          value: 'en proceso',
        },
        {
          label: 'Venta realizada',
          value: 'venta realizada',
        },
        {
          label: 'Anulado',
          value: 'anulado',
        },
      ],
      defaultValue: 'en proceso',
    },
  ],
}
