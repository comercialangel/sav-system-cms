import type { CollectionConfig } from 'payload'

export const Province: CollectionConfig = {
  slug: 'provincia',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'provincia',
    group: 'Ubicaciones',
  },
  labels: {
    singular: 'Provincia',
    plural: 'Provincias',
  },
  fields: [
    {
      name: 'departamento',
      label: 'Departamento',
      type: 'relationship',
      relationTo: 'departamento',
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
          name: 'codigoprovincia',
          label: 'Código de provincia',
          type: 'text',
          required: true,
          admin: {
            width: '30%',
          },
        },
        {
          name: 'provincia',
          label: 'Nombre de provincia',
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
