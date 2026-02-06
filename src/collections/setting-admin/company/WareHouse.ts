import type { CollectionConfig } from 'payload'

export const WareHouse: CollectionConfig = {
  slug: 'warehouse',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'warehousename',
    group: 'Configuraciones de administración',
  },
  labels: {
    singular: 'Almacén',
    plural: 'Almacenes',
  },
  fields: [
    {
      name: 'establishment',
      label: 'Establecimiento',
      type: 'relationship',
      relationTo: 'establishment',
      required: true,
      hasMany: false,
      admin: {
        allowCreate: false,
      },
    },
    {
      name: 'warehousename',
      label: 'Nombre del almacén',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'address',
      label: 'Dirección',
      type: 'text',
      required: true,
    },
    {
      name: 'observations',
      label: 'Observaciones',
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
