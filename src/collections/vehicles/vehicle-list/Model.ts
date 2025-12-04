import type { CollectionConfig } from 'payload'

export const Model: CollectionConfig = {
  slug: 'model',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'model',
    group: 'Unidades vehiculares',
  },
  labels: {
    singular: 'Modelo',
    plural: 'Modelos',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'brand',
          label: 'Marca',
          type: 'relationship',
          relationTo: 'brand',
          required: true,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: true,
          },
        },
        {
          name: 'model',
          label: 'Modelo',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            width: '50%',
          },
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
  ],
}
