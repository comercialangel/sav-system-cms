import type { CollectionConfig } from 'payload'

export const InternalEquipment: CollectionConfig = {
  slug: 'internalequipment',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'internalequipment',
    group: 'Unidades vehiculares',
  },
  labels: {
    singular: 'Equipamiento vehicular interno',
    plural: 'Equipamiento vehicular interno',
  },
  fields: [
    {
      name: 'internalequipment',
      label: 'Equipamiento interno',
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
