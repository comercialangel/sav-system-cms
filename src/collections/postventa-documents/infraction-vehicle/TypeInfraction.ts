import type { CollectionConfig } from 'payload'

export const TypeInfraction: CollectionConfig = {
  slug: 'typeinfraction',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'typeinfraction',
    group: 'Impuestos e infracciones de tránsito vehiculares',
  },
  labels: {
    singular: 'Tipo de infracción vehicular',
    plural: 'Tipos de infracciones vehiculares',
  },
  fields: [
    {
      name: 'typeinfraction',
      label: 'Tipo de infracción',
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
