import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    description: 'Usuarios con acceso al sistema',
  },

  auth: {
    tokenExpiration: 7200,
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
