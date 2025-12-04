import type { CollectionConfig } from 'payload'

export const ProcedureAAP: CollectionConfig = {
  slug: 'procedureaap',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'typeprocedureaap',
    group: 'Trámites vehiculares',
  },
  labels: {
    singular: 'Trámite de AAP',
    plural: 'Trámites de AAP',
  },
  fields: [
    {
      name: 'vehicle',
      label: 'Unidad vehicular',
      type: 'relationship',
      relationTo: 'vehicle',
      required: true,
      hasMany: false,
      admin: {
        allowCreate: false,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'typeprocedureaap',
          label: 'Tipo de trámite',
          type: 'relationship',
          relationTo: 'typeprocedureaap',
          required: true,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },
        {
          name: 'procedureconcept',
          label: 'Concepto de trámite',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'pregistryofficeprocedure',
          label: 'Oficina de entrega',
          type: 'relationship',
          relationTo: 'registryofficeprocedure',
          required: true,
          hasMany: false,
          admin: {
            width: '33%',
            allowCreate: false,
          },
        },
        {
          name: 'paymentcode',
          label: 'Código de pago',
          type: 'text',
          required: false,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'startdate',
          label: 'Fecha de inicio',
          type: 'date',
          required: false,
          admin: {
            width: '34%',
          },
        },
      ],
    },
    {
      name: 'expenselist',
      label: 'Lista de costos',
      type: 'array',
      required: false,
      labels: {
        singular: 'Costo',
        plural: 'Costos',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'expensedate',
              label: 'Fecha',
              type: 'date',
              required: true,
              timezone: true,
              admin: {
                width: '50%',
                date: {
                  displayFormat: 'd MMM yyy',
                },
              },
            },
            {
              name: 'conceptexpense',
              label: 'Concepto',
              type: 'relationship',
              relationTo: 'expenseproceduresunarp',
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
              name: 'typecurrency',
              label: 'Tipo de moneda',
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
              name: 'expensevalue',
              label: 'Valor',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'mediaexpenseproceduresunarp',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediaexpenseproceduresunarp',
          required: false,
        },
        {
          name: 'observations',
          label: 'Observaciones',
          type: 'textarea',
          required: false,
        },
      ],
    },
    {
      name: 'proceduredatafiles',
      label: 'Archivos de trámite',
      type: 'array',
      required: false,
      labels: {
        singular: 'Archivo',
        plural: 'Archivos',
      },
      fields: [
        {
          name: 'mediaprocedure',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediaprocedureaap',
          required: true,
        },
        {
          name: 'registrationprocessor',
          label: 'Recepcionado por',
          type: 'relationship',
          relationTo: 'registrationprocessor',
          required: false,
          hasMany: false,
          admin: {
            width: '100%',
            allowCreate: true,
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
      name: 'procedurefinish',
      label: 'Finalización de trámite',
      type: 'group',
      admin: {
        description: 'Esta sección será completada unicamente si el trámite haya finalizado',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'enddate',
              label: 'Fecha de finalización',
              type: 'date',
              required: false,
              admin: {
                width: '33%',
              },
            },
          ],
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
      name: 'processstatus',
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
          label: 'Inscripto',
          value: 'inscripto',
        },
        {
          label: 'Tachado',
          value: 'tachado',
        },
      ],
      defaultValue: 'en proceso',
    },
  ],
}
