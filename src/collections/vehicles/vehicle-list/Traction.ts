import type { CollectionConfig } from 'payload'

export const Traction: CollectionConfig = {
  slug: 'traction',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'traction',
    group: 'Unidades vehiculares',
  },
  labels: {
    singular: 'Tracción',
    plural: 'Tracciones',
  },
  fields: [
    {
      name: 'traction',
      label: 'Tracción',
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
