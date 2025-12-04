import type { CollectionConfig } from 'payload'

export const TypeUse: CollectionConfig = {
  slug: 'typeuse',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'typeuse',
    group: 'Unidades vehiculares',
  },
  labels: {
    singular: 'Tipo de uso de placa de rodaje',
    plural: 'Tipos de uso de placas de rodaje',
  },
  fields: [
    {
      name: 'typeuse',
      label: 'Tipo de uso',
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
