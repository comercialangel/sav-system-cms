import type { CollectionConfig } from 'payload'

export const InternalPlates: CollectionConfig = {
  slug: 'internalplates',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'platenumber',
    group: 'Adquisición de placas de exhibición',
  },
  labels: {
    singular: 'Placa de exhibición (Interna)',
    plural: 'Placas de exhibición (Internas)',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'platenumber',
          label: 'Número de placas',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            width: '30%',
          },
        },
        {
          name: 'company',
          label: 'Compañía',
          type: 'relationship',
          relationTo: 'company',
          required: true,
          hasMany: false,
          admin: {
            width: '70%',
            allowCreate: false,
          },
        },
      ],
    },
    {
      name: 'acquisitioninformation',
      label: 'Información de adquisición',
      type: 'group',
      admin: {
        description:
          'Para la adquisición de placas de exhibición es necesario realizar pagos de garantía además de los pagos por el uso anual de la placa',
      },
      fields: [
        {
          name: 'dateacquisition',
          label: 'Fecha de adquisición',
          type: 'date',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'typepaymentwarranty',
              label: 'Tipo de pago de la garantía',
              type: 'relationship',
              relationTo: 'typepayment',
              required: true,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: false,
              },
            },
            {
              name: 'typecurrencywarranty',
              label: 'Tipo de moneda de garantía',
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
              name: 'warrantyvalue',
              label: 'Valor de garantía',
              type: 'text',
              required: true,
              admin: {
                width: '34%',
              },
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
          name: 'acquisitionfiles',
          label: 'Archivos de adquisición',
          type: 'array',
          required: true,
          labels: {
            singular: 'Archivo adjunto',
            plural: 'Archivos adjuntos',
          },
          fields: [
            {
              name: 'mediaacquisition',
              label: 'Archivo',
              type: 'upload',
              relationTo: 'mediainternalplates',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'perioduse',
      label: 'Periodos de actividad',
      type: 'array',
      required: true,
      labels: {
        singular: 'Periodo de uso',
        plural: 'Periodos de uso',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'statususe',
              label: 'Estado de uso',
              type: 'select',
              admin: {
                width: '34%',
              },
              required: true,
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
            {
              name: 'startinitial',
              label: 'Fecha de inicio',
              type: 'date',
              required: true,
              admin: {
                width: '33%',
              },
            },
            {
              name: 'endinitial',
              label: 'Fecha de finalización',
              type: 'date',
              required: false,
              admin: {
                width: '33%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'typepaymentperiod',
              label: 'Tipo de pago',
              type: 'relationship',
              relationTo: 'typepayment',
              required: true,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: false,
              },
            },
            {
              name: 'typecurrencyperiodo',
              label: 'Tipo de moneda de garantía',
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
              name: 'periodvalue',
              label: 'Valor de garantía',
              type: 'text',
              required: true,
              admin: {
                width: '34%',
              },
            },
          ],
        },
        {
          name: 'observationsperiod',
          label: 'Observaciones',
          type: 'textarea',
          required: false,
        },
        {
          name: 'mediaperiodpayment',
          label: 'Archivo de pago de periodo de uso',
          type: 'upload',
          relationTo: 'mediainternalplates',
          required: true,
        },
        {
          name: 'listcostaditional',
          label: 'Lista de costos adicionales',
          type: 'array',
          labels: {
            singular: 'Costo adicional',
            plural: 'Costos adicionales',
          },
          required: false,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'costdate',
                  label: 'Fecha de costo',
                  type: 'date',
                  required: true,
                  admin: {
                    width: '30%',
                  },
                },
                {
                  name: 'costconcept',
                  label: 'Concepto de costo',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '70%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'typecurrencycost',
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
                  name: 'exchangerate',
                  label: 'Tipo de cambio',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'costvalue',
                  label: 'Valor de costo',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '34%',
                  },
                },
              ],
            },
            {
              name: 'mediacost',
              label: 'Archivo de costo',
              type: 'upload',
              relationTo: 'mediainternalplates',
              required: true,
            },
            {
              name: 'observationscost',
              label: 'Observaciones',
              type: 'textarea',
              required: false,
            },
          ],
        },
      ],
    },
    {
      name: 'cancellation',
      label: 'Cancelación de uso de placa',
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
                width: '30%',
              },
            },
            {
              name: 'motivecancellation',
              label: 'Motivo de cancelación',
              type: 'relationship',
              relationTo: 'motivecancellationinternalplates',
              required: false,
              hasMany: false,
              admin: {
                width: '70%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'returndate',
              label: 'Fecha de devolución',
              type: 'date',
              required: false,
              admin: {
                width: '30%',
              },
            },
            {
              name: 'typepaymentreturn',
              label: 'Tipo de pago de devolución',
              type: 'relationship',
              relationTo: 'typepayment',
              required: false,
              hasMany: false,
              admin: {
                width: '30%',
                allowCreate: false,
              },
            },
          ],
        },
        {
          name: 'mediareturn',
          label: 'Archivo de devolución de garantía',
          type: 'upload',
          relationTo: 'mediainternalplates',
          required: false,
        },
        {
          name: 'observationsreturn',
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
          label: 'Liberada',
          value: 'liberada',
        },
        {
          label: 'Asignada',
          value: 'asignada',
        },
      ],
      defaultValue: 'liberada',
    },
  ],
}
