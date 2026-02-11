import type { CollectionConfig } from 'payload'

export const ExpenseProcedureTitleTransfer: CollectionConfig = {
  slug: 'expenseproceduretitletransfer',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'expense',
    group: 'Trámites vehiculares',
  },
  labels: {
    singular: 'Concepto de costo de trámite de transferencia de titularidad vehicular',
    plural: 'Conceptos de costos de trámite de transferencia de titularidad vehicular',
  },
  fields: [
    {
      name: 'expense',
      label: 'Concepto',
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
