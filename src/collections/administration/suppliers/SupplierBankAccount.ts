import type { CollectionConfig } from 'payload'

export const SupplierBankAccount: CollectionConfig = {
  slug: 'supplierbankaccount',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'fullaccountbank',
    group: 'Proveedores vehiculares',
  },
  labels: {
    singular: 'Cuenta bancaria de proveedor',
    plural: 'Cuentas bancarias de proveedores',
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
      name: 'fullaccountbank',
      label: 'Cuenta bancaria',
      type: 'text',
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            interface AccountData {
              supplier: string
              typebank: string
              typeaccount: string
              typecurrency: string
              accountnumber: string
            }
            const typedata = data as AccountData

            if (
              typedata.supplier &&
              typedata.typebank &&
              typedata.typeaccount &&
              typedata.typecurrency &&
              typedata.accountnumber
            ) {
              let supplierName = ''
              let bankType = ''
              let accountType = ''
              let currencyType = ''

              // Obtener el nombre de la compañía
              const supplier = await req.payload.findByID({
                collection: 'supplier',
                id: typedata.supplier,
              })
              if (supplier) {
                supplierName = supplier.namesupplier || '' // Supongamos que 'name' es el campo en 'company'
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
              return `${supplierName} - ${bankType}, ${accountType}: (${typedata.accountnumber}), ${currencyType}`
            }
          },
        ],
      },
      admin: {
        hidden: true, // Oculto en el admin panel ya que no se puede editar directamente
      },
    },
    {
      name: 'abbreviationaccountbank',
      label: 'Abreviación de cuenta bancaria',
      type: 'text',
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            interface AccountData {
              typebank: string
              typecurrency: string
              accountnumber: string
            }
            const typedata = data as AccountData

            if (typedata.typebank && typedata.typecurrency && typedata.accountnumber) {
              let bankType = ''
              let currencyType = ''

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
                currencyType = currency.typecurrency || '' // Ajusta según el campo real en 'typecurrency'
              }

              // Formatear la información combinada
              return `${bankType} (${typedata.accountnumber}), ${currencyType}`
            }
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
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        const { payload } = req

        // Solo manejar la operación de creación
        if (operation === 'create') {
          // Obtener el ID del proveedor asociado a la dirección
          const supplierId = typeof doc.supplier === 'object' ? doc.supplier.id : doc.supplier

          if (supplierId) {
            // Obtener el proveedor actual
            const supplier = await payload.findByID({
              collection: 'supplier',
              id: supplierId,
            })

            if (supplier) {
              // Obtener el array actual de direcciones (o inicializarlo si está vacío)
              const currentSupplierBankAccount = supplier.supplieraccount ?? []

              // Agregar el ID de la nueva dirección al array
              const updatedSupplierBankAccount = [...currentSupplierBankAccount, doc.id]

              // Actualizar el campo `addresses` en la colección `supplier`
              await payload.update({
                collection: 'supplier',
                id: supplierId,
                data: {
                  supplieraccount: updatedSupplierBankAccount,
                },
              })

              console.log(`Cuenta bancaria agregada al proveedor ${supplierId}.`)
            }
          }
        }
      },
    ],

    afterDelete: [
      async ({ doc, req }) => {
        const { payload } = req

        // Obtener el ID del proveedor asociado a la dirección
        const supplierId =
          typeof doc.supplier === 'object'
            ? doc.supplier.id // Si es un objeto, extraer el ID
            : doc.supplier // Si ya es un ID, usarlo directamente

        if (supplierId) {
          // Obtener el proveedor actual
          const supplier = await payload.findByID({
            collection: 'supplier',
            id: supplierId,
          })

          if (supplier) {
            // Obtener el array actual de direcciones (o inicializarlo si está vacío)
            const currentSupplierBankAccount = supplier.supplieraccount ?? []

            // Filtrar el array de direcciones para eliminar el ID de la dirección eliminada
            const updatedSupplierBankAccount = currentSupplierBankAccount.filter(
              (accountId) => accountId !== doc.id,
            )

            // Actualizar el campo `addresses` en la colección `supplier`
            await payload.update({
              collection: 'supplier',
              id: supplierId,
              data: {
                supplieraccount: updatedSupplierBankAccount,
              },
            })

            console.log(`Cuenta bancaria eliminada del proveedor ${supplierId}.`)
          }
        }
      },
    ],
  },
}
