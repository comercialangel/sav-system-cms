import type { CollectionConfig } from 'payload'

export const TypeBank: CollectionConfig = {
  slug: 'typebank',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'abbreviatedname',
    group: 'Elementos financieros',
  },
  labels: {
    singular: 'Tipo de banco',
    plural: 'Tipos de bancos',
  },
  fields: [
    {
      name: 'bankname',
      label: 'Nombre de banco',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'abbreviatedname',
      label: 'Nombre abreviado de banco',
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
