import type { CollectionConfig } from 'payload'

export const Transmission: CollectionConfig = {
  slug: 'transmission',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'transmission',
    group: 'Unidades vehiculares',
  },
  labels: {
    singular: 'Transmisión',
    plural: 'Transmisiones',
  },
  fields: [
    {
      name: 'transmission',
      label: 'Transmisión',
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
