import type { CollectionConfig } from 'payload'

export const TypeOperator: CollectionConfig = {
  slug: 'typeoperator',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'typeoperator',
    group: "Adquisiciones de GPS y SIM's",
  },
  labels: {
    singular: 'Tipo de operador',
    plural: 'Tipos de operadores',
  },
  fields: [
    {
      name: 'typeoperator',
      label: 'Tipo de operador',
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
