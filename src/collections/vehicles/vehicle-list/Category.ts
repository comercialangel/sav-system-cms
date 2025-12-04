import type { CollectionConfig } from 'payload'

export const Category: CollectionConfig = {
  slug: 'category',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'category',
    group: 'Unidades vehiculares',
  },
  labels: {
    singular: 'Categoría',
    plural: 'Categorías',
  },
  fields: [
    {
      name: 'category',
      label: 'Categoría',
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
