import type { CollectionConfig } from 'payload'

export const VoucherTransferSale: CollectionConfig = {
  slug: 'vouchertransfersale',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'fullname',
    group: 'Transferencias de unidades vehiculares',
  },
  labels: {
    singular: 'Voucher para transferencia',
    plural: 'Vouchers para transferencias',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'voucherdate',
          label: 'Fecha de voucher',
          type: 'date',
          required: true,
          timezone: true,
          admin: {
            width: '50%',
            date: {
              displayFormat: 'd MMM yyy',
            },
          },
        },
        {
          name: 'company',
          label: 'Voucher de',
          type: 'relationship',
          relationTo: 'company',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
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
            width: '33%',
            allowCreate: false,
          },
        },
        {
          name: 'voucherAmount',
          label: 'Valor de voucher',
          type: 'number',
          required: true,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'operationNumber',
          label: 'Nro. de operación',
          type: 'number',
          required: true,
          unique: true,
          admin: {
            width: '34%',
          },
        },
      ],
    },
    {
      name: 'typebank',
      label: 'Tipo de banco',
      type: 'relationship',
      relationTo: 'typebank',
      required: true,
      hasMany: false,
      admin: {
        allowCreate: false,
      },
    },
    {
      name: 'mediatransfervoucher',
      label: 'Voucher',
      type: 'upload',
      relationTo: 'mediatransfervoucher',
      required: true,
    },
    {
      name: 'observations',
      label: 'Observaciones',
      type: 'textarea',
      required: false,
    },
    {
      name: 'fullname',
      label: 'Detalle de registro',
      type: 'text',
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            interface AccountData {
              company: string
              typebank: string
              typecurrency: string
              voucherAmount: string
              operationNumber: string
            }
            const typedata = data as AccountData

            if (
              typedata.company &&
              typedata.typebank &&
              typedata.typecurrency &&
              typedata.voucherAmount &&
              typedata.operationNumber
            ) {
              let companyName = ''
              let bankType = ''
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

              // Obtener el tipo de moneda
              const currency = await req.payload.findByID({
                collection: 'typecurrency',
                id: typedata.typecurrency,
              })
              if (currency) {
                currencyType = currency.symbol || '' // Ajusta según el campo real en 'typecurrency'
              }

              // Formatear la información combinada
              return `${companyName} - ${currencyType} ${typedata.voucherAmount}, ${bankType} (${typedata.operationNumber})`
            }
          },
        ],
      },
      admin: {
        hidden: true, // Oculto en el admin panel ya que no se puede editar directamente
      },
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
          label: 'Disponible',
          value: 'disponible',
        },
        {
          label: 'Utilizado',
          value: 'utilizado',
        },
      ],
      defaultValue: 'disponible',
    },
  ],
}
