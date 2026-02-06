import type { Access, CollectionConfig } from 'payload'

const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

export const SupplierAddress: CollectionConfig = {
  slug: 'supplieraddress',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: isAuthenticated,
  },
  admin: {
    useAsTitle: 'address',
    group: 'Proveedores vehiculares',
  },
  labels: {
    singular: 'Sede de proveedor',
    plural: 'Sedes de proveedores',
  },
  fields: [
    {
      name: 'supplier',
      label: 'Proveedor',
      type: 'relationship',
      relationTo: 'supplier',
      required: true,
      hasMany: false,
      admin: {
        allowCreate: false,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'sede',
          label: 'Nombre de sede',
          type: 'text',
          required: true,
          admin: {
            width: '30%',
          },
        },
        {
          name: 'address',
          label: 'Dirección de sede',
          type: 'text',
          required: true,
          admin: {
            width: '70%',
          },
        },
      ],
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
