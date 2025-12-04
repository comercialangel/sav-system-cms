import type { CollectionConfig } from 'payload'

export const TypeGPS: CollectionConfig = {
  slug: 'typegps',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'typegps',
    group: "Adquisiciones de GPS y SIM's",
  },
  labels: {
    singular: 'Tipo de GPS',
    plural: 'Tipos de GPS',
  },
  fields: [
    {
      name: 'typegps',
      label: 'Tipo de GPS',
      type: 'text',
      required: true,
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
