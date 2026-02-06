import type { Access, CollectionConfig } from 'payload'

const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

export const Supplier: CollectionConfig = {
  slug: 'supplier',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: isAuthenticated,
  },
  admin: {
    useAsTitle: 'namedocument',
    group: 'Proveedores vehiculares',
  },
  labels: {
    singular: 'Proveedor',
    plural: 'Proveedores',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'typeidentificationdocument',
          label: 'Tipo de documento de identificación',
          type: 'relationship',
          relationTo: 'typeidentificationdocument',
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },
        {
          name: 'identificationnumber',
          label: 'Número de identificación',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'suppliername',
          label: 'Nombre completo o Razón social',
          type: 'text',
          admin: {
            width: '100%',
          },
        },
        {
          name: 'observations',
          label: 'Observaciones',
          type: 'textarea',
          required: false,
        },
        {
          name: 'namedocument',
          label: 'Nombre-documento',
          type: 'text',
          admin: {
            hidden: true,
          },
          hooks: {
            beforeChange: [
              ({ data }) => {
                interface FullNameData {
                  suppliername: string
                  identificationnumber: string
                }
                const typedData = data as FullNameData
                return `${typedData.suppliername} - ${typedData.identificationnumber}`
              },
            ],
          },
        },
      ],
    },
    {
      name: 'suppliercontact',
      label: 'Contactos',
      type: 'join',
      collection: 'suppliercontact',
      on: 'supplier',
    },
    {
      name: 'supplieraddress',
      label: 'Direcciones',
      type: 'join',
      collection: 'supplieraddress',
      on: 'supplier',
      maxDepth: 1,
    },
    {
      name: 'supplieraccount',
      label: 'Cuentas bancarias',
      type: 'join',
      collection: 'supplierbankaccount',
      on: 'supplier',
      maxDepth: 2,
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
