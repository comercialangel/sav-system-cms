import type { CollectionConfig } from 'payload'

export const PensionSystem: CollectionConfig = {
  slug: 'pensionsystem',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'abbreviatedpensionsystem',
    group: 'Recursos Humanos',
  },
  labels: {
    singular: 'Sistema de pensión',
    plural: 'Sistemas de pensiones',
  },
  fields: [
    {
      name: 'pensionsystem',
      label: 'Sistema de pensión',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'abbreviatedpensionsystem',
      label: 'Nombre abreviado',
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
        readOnly: false,
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
        readOnly: false,
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
