import type { CollectionConfig } from 'payload'

export const TypeProcedureSunarp: CollectionConfig = {
  slug: 'typeproceduresunarp',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'typeprocedure',
    group: 'Trámites vehiculares',
  },
  labels: {
    singular: 'Tipo de trámite de SUNARP',
    plural: 'Tipos de trámites de SUNARP',
  },
  fields: [
    {
      name: 'typeprocedure',
      label: 'Tipo de trámite',
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
