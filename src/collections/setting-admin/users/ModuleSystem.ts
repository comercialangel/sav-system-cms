import type { CollectionConfig } from 'payload'

export const ModuleSystem: CollectionConfig = {
  slug: 'modulesystem',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'modulename',
    group: 'Usuarios del sistema SAV',
  },
  labels: {
    singular: 'Módulo del sistema',
    plural: 'Módulos del sistema',
  },
  fields: [
    {
      name: 'modulename',
      label: 'Nombre de módulo',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      label: 'Nombre legible del módulo en el sistema (slug)',
      type: 'text',
      required: true,
    },
    {
      name: 'operations',
      label: 'Operaciones del Módulo',
      type: 'array',
      fields: [
        {
          name: 'slug',
          label: 'Nombre legible de la operación en el sistema (slug)',
          type: 'text',
          required: true,
          unique: true,
        },
      ],
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
