import type { CollectionConfig } from 'payload'

export const Deparment: CollectionConfig = {
  slug: 'departamento',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'departamento',
    group: 'Ubicaciones',
  },
  labels: {
    singular: 'Departamento',
    plural: 'Departamentos',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'codigo',
          label: 'Código',
          type: 'text',
          required: true,
          admin: {
            width: '30%',
          },
        },
        {
          name: 'departamento',
          label: 'Nombre departamento',
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
