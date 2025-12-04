import type { CollectionConfig } from 'payload'

export const CarBody: CollectionConfig = {
  slug: 'carbody',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'carbody',
    group: 'Unidades vehiculares',
  },
  labels: {
    singular: 'Carrocería',
    plural: 'Carrocerías',
  },
  fields: [
    {
      name: 'carbody',
      label: 'Carrocería',
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
