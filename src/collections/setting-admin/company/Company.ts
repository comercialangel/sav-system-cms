import type { CollectionConfig } from 'payload'

export const Company: CollectionConfig = {
  slug: 'company',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'namedocument',
    group: 'Configuraciones de administración',
  },
  labels: {
    singular: 'Empresa',
    plural: 'Empresas',
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
      name: 'companyname',
      label: 'Nombre de compañía',
      type: 'text',
      required: true,
      unique: false,
    },
    {
      name: 'tradename',
      label: 'Denomicación comercial',
      type: 'text',
      required: true,
      unique: false,
    },
    {
      name: 'namedocument',
      label: 'Nombre y documento',
      type: 'text',
      hooks: {
        beforeChange: [
          ({ data }) => {
            interface FullNameData {
              companyname: string
              identificationnumber: string
            }
            const typedData = data as FullNameData
            return `${typedData.companyname} - ${typedData.identificationnumber}`
          },
        ],
      },
      admin: {
        hidden: true,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'idcode',
          label: 'Código de identificación',
          type: 'text',
          required: true,
          unique: false,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'registryentry',
          label: 'Partida registral',
          type: 'text',
          required: false,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'mediacompany',
      required: false,
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
