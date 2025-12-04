import type { CollectionConfig } from 'payload'

export const TypeCollaborator: CollectionConfig = {
  slug: 'typecollaborator',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'typecollaborator',
    group: 'Recursos Humanos',
  },
  labels: {
    singular: 'Tipo de colaborador',
    plural: 'Tipos de colaboradores',
  },
  fields: [
    {
      name: 'typecollaborator',
      label: 'Tipo de colaborador',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
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
