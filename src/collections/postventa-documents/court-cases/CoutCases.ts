import type { CollectionConfig } from 'payload'

export const CourtCases: CollectionConfig = {
  slug: 'courtcases',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Casos judiciales de vehículos',
  },
  labels: {
    singular: 'Caso judicial',
    plural: 'Casos judiciales',
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
          name: 'datecase',
          label: 'Fecha de caso',
          type: 'date',
          required: true,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'mattercase',
          label: 'Asunto de caso',
          type: 'text',
          required: true,
          admin: {
            width: '67%',
          },
        },
      ],
    },
    {
      name: 'description',
      label: 'Descripción del caso',
      type: 'textarea',
      required: true,
    },
    {
      name: 'courtcasesfiles',
      label: 'Archivos',
      type: 'array',
      required: false,
      labels: {
        singular: 'Archivo',
        plural: 'Archivos',
      },
      fields: [
        {
          name: 'mediacourtcases',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediacourtcases',
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
