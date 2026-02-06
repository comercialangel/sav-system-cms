import type { CollectionConfig } from 'payload'

export const TypeCurrency: CollectionConfig = {
  slug: 'typecurrency',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'typecurrency',
    group: 'Elementos financieros',
  },
  labels: {
    singular: 'Tipo de moneda',
    plural: 'Tipos de moneda',
  },
  fields: [
    {
      name: 'typecurrency',
      label: 'Tipo de moneda',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'symbol',
          label: 'Símbolo',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'codecurrency',
          label: 'Código de moneda',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
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
