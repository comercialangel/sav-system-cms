import type { CollectionConfig } from 'payload'

export const CardSIM: CollectionConfig = {
  slug: 'cardsim',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'numbersim',
    group: "Adquisiciones de GPS y SIM's",
  },
  labels: {
    singular: 'Tarjeta SIM',
    plural: "Tarjetas SIM's",
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'dateacquisition',
          label: 'Fecha de adquisición',
          type: 'date',
          required: true,
          timezone: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'ownersim',
          label: 'Titular de tarjeta',
          type: 'relationship',
          relationTo: 'ownersim',
          required: true,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: true,
          },
        },
        {
          name: 'typeoperator',
          label: 'Tipo de operador',
          type: 'relationship',
          relationTo: 'typeoperator',
          required: true,
          hasMany: false,
          admin: {
            width: '33%',
            allowCreate: true,
          },
        },
        {
          name: 'codesim',
          label: 'Código de tarjeta',
          type: 'text',
          required: false,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'numbersim',
          label: 'Número de tarjeta',
          type: 'text',
          required: false,
          admin: {
            width: '34%',
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
          name: 'exchangerate',
          label: 'Tipo de cambio',
          type: 'number',
          required: false,
          defaultValue: 1,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'pricepurchase',
          label: 'Precio de compra',
          type: 'number',
          defaultValue: 0,
          required: true,
          admin: {
            width: '34%',
          },
        },
      ],
    },
    {
      name: 'totalExpenseUSD',
      label: 'Total USD',
      type: 'number',
      defaultValue: 0,
      required: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'totalExpensePEN',
      label: 'Total PEN',
      type: 'number',
      defaultValue: 0,
      required: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'observations',
      label: 'Observaciones',
      type: 'textarea',
      required: false,
    },
    {
      name: 'cancellation',
      label: 'Cancelación de tarjeta SIM',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'cancellationdate',
              label: 'Fecha de cancelación',
              type: 'date',
              required: false,
              admin: {
                width: '33%',
              },
            },
            {
              name: 'motivecancellationgps',
              label: 'Motivo de cancelación',
              type: 'relationship',
              relationTo: 'motivecancellationdevice',
              required: false,
              hasMany: false,
              admin: {
                width: '67%',
                allowCreate: true,
              },
            },
          ],
        },
      ],
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
          label: 'Asignado',
          value: 'asignado',
        },
        {
          label: 'En uso',
          value: 'en uso',
        },
        {
          label: 'Uso finalizado',
          value: 'uso finalizado',
        },
        {
          label: 'Averiado',
          value: 'averiado',
        },
      ],
      defaultValue: 'disponible',
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
      async ({ req: { user, payload }, data, operation }) => {
        // 1. Manejo de createdBy y updatedBy
        if (user) {
          if (operation === 'create' && !data.createdBy) {
            data.createdBy = user.id
          }
          data.updatedBy = user.id
        }

        // 2. Validar typecurrency en creación
        if (operation === 'create' && !data.typecurrency) {
          throw new Error('El campo typecurrency es requerido para crear una tarjeta SIM')
        }

        // 3. Cálculo de totalExpenseUSD y totalExpensePEN
        if (
          (operation === 'create' || operation === 'update') &&
          data.typecurrency &&
          data.pricepurchase !== undefined
        ) {
          try {
            const typeCurrency = await payload.findByID({
              collection: 'typecurrency',
              id: data.typecurrency,
            })

            const codeCurrency = typeCurrency?.codecurrency
            const pricePurchase = Number(data.pricepurchase) || 0
            const exchangeRate = Number(data.exchangerate) || 1

            let totalUSD = 0
            let totalPEN = 0

            if (codeCurrency === 'USD') {
              totalUSD = pricePurchase
              totalPEN = pricePurchase * exchangeRate
            } else if (codeCurrency === 'PEN') {
              totalPEN = pricePurchase
              totalUSD = pricePurchase / exchangeRate
            } else {
              console.warn(`Moneda no soportada en CardSIM: ${codeCurrency}`)
            }

            data.totalExpenseUSD = Number(totalUSD.toFixed(2))
            data.totalExpensePEN = Number(totalPEN.toFixed(2))
          } catch (error) {
            console.error('Error al obtener typecurrency en CardSIM:', error)
            data.totalExpenseUSD = data.totalExpenseUSD || 0
            data.totalExpensePEN = data.totalExpensePEN || 0
          }
        } else {
          data.totalExpenseUSD = data.totalExpenseUSD || 0
          data.totalExpensePEN = data.totalExpensePEN || 0
        }

        return data
      },
    ],
  },
}
