import type { CollectionConfig } from 'payload'

export const BasicEquipment: CollectionConfig = {
  slug: 'basicequipment',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'basicequipment',
    group: 'Unidades vehiculares',
  },
  labels: {
    singular: 'Equipamiento vehicular básico',
    plural: 'Equipamiento vehicular básico',
  },
  fields: [
    {
      name: 'basicequipment',
      label: 'Equipamiento básico',
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
