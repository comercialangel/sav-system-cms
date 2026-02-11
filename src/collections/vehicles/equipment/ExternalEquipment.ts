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
    {
      type: 'relationship',
      name: 'createdBy',
      label: 'Creado por',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
        allowEdit: false,
      },
    },
    {
      type: 'relationship',
      name: 'updatedBy',
      label: 'Actualizado por',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
        allowEdit: false,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        if (req.user) {
          if (operation === 'create') {
            data.createdBy = req.user.id
          }
          data.updatedBy = req.user.id
        }
        return data
      },
    ],
  },
}
