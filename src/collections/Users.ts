import type { Access, CollectionConfig } from 'payload'

const adminsAndUser: Access = ({ req: { user } }) => {
  if (!user) return false
  return {
    id: {
      equals: user.id,
    },
  }
}

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    update: adminsAndUser,
  },
  admin: {
    useAsTitle: 'email',
    description: 'Usuarios con acceso al sistema',
  },

  auth: {
    tokenExpiration: 7200,
    maxLoginAttempts: 5,
    lockTime: 600 * 1000,
  },

  labels: {
    singular: 'Usuario',
    plural: 'Usuarios',
  },
  fields: [
    {
      name: 'mediauser',
      label: 'Foto de usuario',
      type: 'upload',
      relationTo: 'mediauser',
      required: false,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'collaborator',
          label: 'Colaborador',
          type: 'relationship',
          relationTo: 'collaborator',
          required: false,
          hasMany: false,
          admin: {
            allowCreate: false,
          },
        },
        {
          name: 'rolcollaborator',
          label: 'Rol de colaborador',
          type: 'relationship',
          relationTo: 'role',
          hasMany: true,
          required: true,
          admin: {
            width: '33%',
          },
        },
      ],
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
      async ({ req: { user }, data, originalDoc }) => {
        if (user) {
          if (!originalDoc.createdBy) {
            data.createdBy = user.id
          }
          data.updatedBy = user.id
        }
        return data
      },
    ],
  },
}
