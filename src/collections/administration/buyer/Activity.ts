import type { CollectionConfig } from 'payload'

export const Activity: CollectionConfig = {
  slug: 'activity',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'activity',
    group: 'Compradores (Clientes externos)',
  },
  labels: {
    singular: 'Actividad / Ocupación del comprador',
    plural: 'Actividad / Ocupación de los compradores',
  },
  fields: [
    {
      name: 'activity',
      label: 'Actividad/Ocupación',
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
