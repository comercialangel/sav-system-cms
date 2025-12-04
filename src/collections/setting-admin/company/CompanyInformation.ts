import type { CollectionConfig } from 'payload'

export const CompanyInformation: CollectionConfig = {
  slug: 'companyinformation',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'company',
    group: 'Configuraciones de administración',
  },
  labels: {
    singular: 'Información de compañía',
    plural: 'Información de compañías',
  },
  fields: [
    {
      name: 'company',
      label: 'Empresa',
      type: 'relationship',
      relationTo: 'company',
      required: true,
      hasMany: false,
      admin: {
        allowCreate: false,
      },
    },
    {
      name: 'essaludpayment',
      label: 'Pagos de Essalud',
      labels: {
        singular: 'Pago',
        plural: 'Pagos',
      },
      type: 'array',
      required: false,
      fields: [],
    },
    {
      name: 'imrpayment',
      label: 'Pagos de Essalud',
      labels: {
        singular: 'Pago',
        plural: 'Pagos',
      },
      type: 'array',
      required: false,
      fields: [],
    },
    {
      name: 'incometaxpayment',
      label: 'Pagos de Essalud',
      labels: {
        singular: 'Pago',
        plural: 'Pagos',
      },
      type: 'array',
      required: false,
      fields: [],
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
