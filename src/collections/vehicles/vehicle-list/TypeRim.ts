import type { CollectionConfig } from 'payload'

export const TypeRim: CollectionConfig = {
  slug: 'typerim',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'typerim',
    group: 'Unidades vehiculares',
  },
  labels: {
    singular: 'Tipo de aro',
    plural: 'Tipos de aro',
  },
  fields: [
    {
      name: 'typerim',
      label: 'Tipo de aro',
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
