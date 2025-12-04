import type { CollectionConfig } from 'payload'

export const InfractionVehicle: CollectionConfig = {
  slug: 'infractionvehicle',
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
    singular: 'Infracción vehicular',
    plural: 'Infracciones vehiculares',
  },
  fields: [
    {
      name: 'finalsale',
      label: 'Venta vehicular',
      type: 'relationship',
      relationTo: 'finalsale',
      required: false,
      hasMany: false,
      admin: {
        allowCreate: false,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'dateinfraction',
          label: 'Fecha de infracción',
          type: 'date',
          required: true,
          timezone: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'sanctioningentity',
          label: 'Entidad sancionadora',
          type: 'relationship',
          relationTo: 'sanctioningentity',
          required: true,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: true,
          },
        },
        {
          name: 'typeinfraction',
          label: 'Tipo de infracción',
          type: 'relationship',
          relationTo: 'typeinfraction',
          required: true,
          hasMany: false,
          admin: {
            width: '33%',
            allowCreate: true,
          },
        },
        {
          name: 'infractionnumber',
          label: 'Número infracción S/',
          type: 'number',
          required: true,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'valueinfraction',
          label: 'Valor de infracción S/',
          type: 'number',
          required: true,
          admin: {
            width: '34%',
          },
        },
      ],
    },
    {
      name: 'infractionfiles',
      label: 'Archivos',
      type: 'array',
      required: false,
      labels: {
        singular: 'Archivo',
        plural: 'Archivos',
      },
      fields: [
        {
          name: 'mediainfraction',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediainfraction',
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
      name: 'seizureMoney',
      label: 'Embargo por cobranza coactiva',
      type: 'group',
      admin: {
        description:
          'En caso de realizarce el embargo por cobranza coactiva, se solicita completar la siguiente información',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'datecoactive',
              label: 'Fecha de embargo',
              type: 'date',
              required: false,
              timezone: true,
              admin: {
                width: '33%',
              },
            },
            {
              name: 'accountcompany',
              label: 'Cuenta que a sufrido el embargo',
              type: 'relationship',
              relationTo: 'accountcompany',
              required: false,
              admin: {
                width: '67%',
                allowCreate: false,
              },
            },
          ],
        },
        {
          name: 'mediaembargo',
          label: 'Archivo de embargo',
          type: 'upload',
          relationTo: 'mediainfraction',
          required: false,
        },
        {
          name: 'observationsSeizure',
          label: 'Observaciones',
          type: 'textarea',
          required: false,
        },
      ],
    },
    {
      name: 'payment',
      label: 'Pago de infracción',
      type: 'group',
      admin: {
        description:
          'La sección deberá ser completada una vez efectuado el pago de la infracción vehicular',
      },
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
                width: '33%',
              },
            },
          ],
        },
        {
          name: 'mediapayment',
          label: 'Voucher de pago',
          type: 'upload',
          relationTo: 'mediainfraction',
          required: false,
        },
        {
          name: 'observationsPayment',
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
          label: 'Pendiente de pago',
          value: 'Pendiente de pago',
        },
        {
          label: 'Expediente coactivo',
          value: 'Expediente coactivo',
        },
        {
          label: 'Embargo de pago',
          value: 'Embargo de pago',
        },
        {
          label: 'Pagado',
          value: 'pagado',
        },
      ],
      defaultValue: 'pendiente de pago',
    },
  ],
}
