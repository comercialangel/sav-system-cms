import type { CollectionConfig } from 'payload'

export const Fuel: CollectionConfig = {
  slug: 'fuel',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'fuel',
    group: 'Unidades vehiculares',
  },
  labels: {
    singular: 'Combustible',
    plural: 'Combustibles',
  },
  fields: [
    {
      name: 'fuel',
      label: 'Combustible',
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
