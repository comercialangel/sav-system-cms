import type { CollectionConfig } from 'payload'

export const AccountCompany: CollectionConfig = {
  slug: 'accountcompany',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'fullaccountbank',
    group: 'Configuraciones de administración',
  },
  labels: {
    singular: 'Cuenta bancaría de compañía',
    plural: 'Cuentas bancarías de compañías',
  },
  fields: [
    {
      name: 'company',
      label: 'Compañía',
      type: 'relationship',
      relationTo: 'company',
      required: true,
      hasMany: false,
      admin: {
        allowCreate: true,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'typebank',
          label: 'Tipo de banco',
          type: 'relationship',
          relationTo: 'typebank',
          required: true,
          hasMany: false,
          admin: {
            width: '33%',
            allowCreate: false,
          },
        },
        {
          name: 'typeaccount',
          label: 'Tipo de cuenta',
          type: 'relationship',
          relationTo: 'typeaccount',
          required: true,
          hasMany: false,
          admin: {
            width: '33%',
            allowCreate: false,
          },
        },
        {
          name: 'typecurrency',
          label: 'Tipo de moneda',
          type: 'relationship',
          relationTo: 'typecurrency',
          required: true,
          hasMany: false,
          admin: {
            width: '34%',
            allowCreate: false,
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'accountnumber',
          label: 'Número de cuenta',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'cci',
          label: 'CCI',
          type: 'text',
          required: false,
          admin: {
            width: '50%',
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
    {
      name: 'fullaccountbank',
      label: 'Cuenta bancaria',
      type: 'text',
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            interface AccountData {
              company: string
              typebank: string
              typeaccount: string
              typecurrency: string
              accountnumber: string
            }
            const typedata = data as AccountData

            if (
              typedata.company &&
              typedata.typebank &&
              typedata.typeaccount &&
              typedata.typecurrency &&
              typedata.accountnumber
            ) {
              let companyName = ''
              let bankType = ''
              let accountType = ''
              let currencyType = ''

              // Obtener el nombre de la compañía
              const company = await req.payload.findByID({
                collection: 'company',
                id: typedata.company,
              })
              if (company) {
                companyName = company.idcode || '' // Supongamos que 'name' es el campo en 'company'
              }

              // Obtener el tipo de banco
              const bank = await req.payload.findByID({
                collection: 'typebank',
                id: typedata.typebank,
              })
              if (bank) {
                bankType = bank.abbreviatedname || '' // Ajusta según el campo real en 'typebank'
              }

              // Obtener el tipo de cuenta
              const account = await req.payload.findByID({
                collection: 'typeaccount',
                id: typedata.typeaccount,
              })
              if (account) {
                accountType = account.typeaccount || '' // Ajusta según el campo real en 'typeaccount'
              }

              // Obtener el tipo de moneda
              const currency = await req.payload.findByID({
                collection: 'typecurrency',
                id: typedata.typecurrency,
              })
              if (currency) {
                currencyType = currency.typecurrency || '' // Ajusta según el campo real en 'typecurrency'
              }

              // Formatear la información combinada
              return `${companyName} - ${bankType}, ${accountType}: (${typedata.accountnumber}), ${currencyType}`
            }
          },
        ],
      },
      admin: {
        hidden: true, // Oculto en el admin panel ya que no se puede editar directamente
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
