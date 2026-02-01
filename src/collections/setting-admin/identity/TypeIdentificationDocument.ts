import type { Access, CollectionConfig } from 'payload'

const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

export const TypeIdentificationDocument: CollectionConfig = {
  slug: 'typeidentificationdocument',
  access: {
    read: () => true,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  admin: {
    useAsTitle: 'abbreviatedname',
    group: 'Formas de identificación',
  },
  labels: {
    singular: 'Tipo de documento de identificación',
    plural: 'Tipos de documentos de identificación',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'codedocument',
          label: 'Código de documento',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'abbreviatedname',
          label: 'Nombre abreviado de documento',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'name',
      label: 'Nombre de documento',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      type: 'select',
      name: 'status',
      label: 'Estado',
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
}
