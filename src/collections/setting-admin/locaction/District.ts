import type { CollectionConfig } from 'payload'

export const District: CollectionConfig = {
  slug: 'distrito',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'distrito',
    group: 'Ubicaciones',
  },
  labels: {
    singular: 'Distrito',
    plural: 'Distritos',
  },
  fields: [
    {
      name: 'provincia',
      label: 'Provincia',
      type: 'relationship',
      relationTo: 'provincia',
      required: true,
      hasMany: false,
      admin: {
        allowCreate: true,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ubigeo',
          label: 'Ubigeo',
          type: 'text',
          required: true,
          admin: {
            width: '30%',
          },
        },
        {
          name: 'distrito',
          label: 'Nombre de distrito',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            width: '70%',
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
