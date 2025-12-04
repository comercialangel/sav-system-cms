import type { CollectionConfig } from 'payload'

export const TypeReceipt: CollectionConfig = {
  slug: 'typereceipt',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'typereceipt',
    group: 'Elementos financieros',
  },
  labels: {
    singular: 'Tipo de recibo',
    plural: 'Tipos de recibo',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'codereceipt',
          label: 'Código de recibo',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            width: '30%',
          },
        },
        {
          name: 'typereceipt',
          label: 'Tipo de recibo',
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
