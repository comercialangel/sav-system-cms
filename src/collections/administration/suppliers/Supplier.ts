import type { CollectionConfig } from 'payload'

export const Supplier: CollectionConfig = {
  slug: 'supplier',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
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
          required: true,
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
      ],
    },
    {
      name: 'namesupplier',
      label: 'Nombre completo o Razón social',
      type: 'text',
      required: true,
    },
    {
      name: 'namedocument',
      label: 'Nombre-documento',
      type: 'text',
      hooks: {
        beforeChange: [
          ({ data }) => {
            interface FullNameData {
              namesupplier: string
              identificationnumber: string
            }
            const typedData = data as FullNameData
            return `${typedData.namesupplier} - ${typedData.identificationnumber}`
          },
        ],
      },
      admin: {
        hidden: true,
      },
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
