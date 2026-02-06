import type { CollectionConfig } from 'payload'

export const Rol: CollectionConfig = {
  slug: 'role',
  access: {
    // Solo los administradores pueden gestionar los roles.
    // read: ({ req }) => req.user?.roles.includes('admin'),
    // create: ({ req }) => req.user?.roles.includes('admin'),
    // update: ({ req }) => req.user?.roles.includes('admin'),
    // delete: ({ req }) => req.user?.roles.includes('admin'),
  },
  admin: {
    useAsTitle: 'name',
    group: 'Usuarios del sistema SAV',
  },
  labels: {
    singular: 'Rol',
    plural: 'Roles',
  },
  fields: [
    {
      name: 'name',
      label: 'Nombre del rol',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'permissions',
      label: 'Permisos de Operación',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'modulesystem',
          label: 'Módulos permitidos',
          type: 'relationship',
          relationTo: 'modulesystem',
          required: false,
          hasMany: true,
          admin: {
            allowCreate: false,
          },
        },
        {
          name: 'operation',
          label: 'Operación',
          type: 'text',
          required: true,
        },
        {
          name: 'canAccess',
          label: 'Puede acceder',
          type: 'checkbox',
          defaultValue: true,
          required: true,
        },
      ],
      admin: {
        description: 'Define qué operaciones puede realizar este rol en cada módulo.',
      },
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
