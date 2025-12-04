import type { CollectionConfig } from 'payload'

export const Brand: CollectionConfig = {
  slug: 'brand',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'brand',
    group: 'Unidades vehiculares',
  },
  labels: {
    singular: 'Marca',
    plural: 'Marcas',
  },
  fields: [
    {
      name: 'brand',
      label: 'Marca',
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
