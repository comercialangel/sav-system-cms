import type { CollectionConfig } from 'payload'

export const TypeProcedureAAP: CollectionConfig = {
  slug: 'typeprocedureaap',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'typeprocedure',
    group: 'Trámites vehiculares',
  },
  labels: {
    singular: 'Tipo de trámite de AAP',
    plural: 'Tipos de trámites de AAP',
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
