import type { CollectionConfig } from 'payload'

export const Genre: CollectionConfig = {
  slug: 'genre',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'genre',
    group: 'Formas de identificación',
  },
  labels: {
    singular: 'Género',
    plural: 'Géneros',
  },
  fields: [
    {
      name: 'genre',
      label: 'Género',
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
          value: 'active',
        },
        {
          label: 'Inactivo',
          value: 'inactive',
        },
      ],
      defaultValue: 'active',
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
