import type { CollectionConfig } from 'payload'

export const SanctioningEntity: CollectionConfig = {
  slug: 'sanctioningentity',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'sanctioningentity',
    group: 'Impuestos e infracciones de tránsito vehiculares',
  },
  labels: {
    singular: 'Entidad sancionadora',
    plural: 'Entidades sancionadoras',
  },
  fields: [
    {
      name: 'sanctioningentity',
      label: 'Entidad sancionadora',
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
