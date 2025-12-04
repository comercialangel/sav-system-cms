import type { CollectionConfig } from 'payload'

export const Color: CollectionConfig = {
  slug: 'color',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'color',
    group: 'Unidades vehiculares',
  },
  labels: {
    singular: 'Color',
    plural: 'Colores',
  },
  fields: [
    {
      name: 'color',
      label: 'Color',
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
