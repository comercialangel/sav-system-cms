import type { CollectionConfig } from 'payload'

export const ExternalEquipment: CollectionConfig = {
  slug: 'externalequipment',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'externalequipment',
    group: 'Unidades vehiculares',
  },
  labels: {
    singular: 'Equipamiento vehicular externo',
    plural: 'Equipamiento vehicular externo',
  },
  fields: [
    {
      name: 'externalequipment',
      label: 'Equipamiento externo',
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
