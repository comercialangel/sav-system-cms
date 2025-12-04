import type { CollectionConfig } from 'payload'

export const VehicleTax: CollectionConfig = {
  slug: 'vehicletax',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Impuestos e infracciones de tránsito vehiculares',
  },
  labels: {
    singular: 'Impuesto vehicular',
    plural: 'Impuestos vehiculares',
  },
  fields: [
    {
      name: 'finalsale',
      label: 'Venta vehicular',
      type: 'relationship',
      relationTo: 'finalsale',
      required: true,
      hasMany: false,
      admin: {
        allowCreate: false,
      },
    },
    {
      type: 'row',
      fields: [
        /* {
          name: 'dateregister',
          label: 'Fecha de inscripción vehicular',
          type: 'date',
          required: false,
          timezone: true,
          admin: {
            width: '33%',
          },
        }, */
        {
          name: 'calculationdate',
          label: 'Fecha de cálculo del impuesto',
          type: 'date',
          required: true,
          timezone: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'calculatedyears',
          label: 'Años de pago',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'calculatedvalue',
          label: 'Valor pagado',
          type: 'number',
          required: false,
          admin: {
            width: '34%',
          },
        },
      ],
    },
    {
      name: 'calculationfiles',
      label: 'Archivos',
      type: 'array',
      required: false,
      labels: {
        singular: 'Archivo',
        plural: 'Archivos',
      },
      fields: [
        {
          name: 'mediataxcalculation',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediavehicletax',
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
      type: 'group',
      label: 'Pago de impuesto',
      name: 'payment',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'datepayment',
              label: 'Fecha de pago',
              type: 'date',
              required: false,
              timezone: true,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'observationsPayment',
          label: 'Observaciones',
          type: 'textarea',
          required: false,
        },
        {
          name: 'taxfiles',
          label: 'Archivos',
          type: 'array',
          required: false,
          labels: {
            singular: 'Archivo',
            plural: 'Archivos',
          },
          fields: [
            {
              name: 'mediavehicletax',
              label: 'Archivo',
              type: 'upload',
              relationTo: 'mediavehicletax',
              required: true,
            },
          ],
        },

        /* {
          name: 'years',
          label: 'Años de pago',
          type: 'text',
          required: false,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'valuereceived',
          label: 'Valor pagado',
          type: 'number',
          required: false,
          admin: {
            width: '34%',
          },
        }, */
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
          label: 'Cálculo pendiente',
          value: 'cálculo pendiente',
        },
        {
          label: 'Pago pendiente',
          value: 'pago pendiente',
        },
        {
          label: 'Pagado',
          value: 'pagado',
        },
      ],
      defaultValue: 'cálculo pendiente',
    },
  ],
}
