import type { CollectionConfig } from 'payload'

export const TypeSino: CollectionConfig = {
  slug: 'typesino',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'typesino',
    group: "Adquisiciones de GPS y SIM's",
  },
  labels: {
    singular: 'Modelo de Sinotrack',
    plural: 'Modelos de Sinotrack',
  },
  fields: [
    {
      name: 'typesino',
      label: 'Tipo de sino',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      label: 'Imagen referencial',
      type: 'upload',
      relationTo: 'mediatypesino',
      required: false,
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
