import type { CollectionConfig } from 'payload'
import { headersWithCors } from 'payload'

export const ExpenseAditionalVehicle: CollectionConfig = {
  slug: 'expenseaditionalvehicle',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Unidades vehiculares',
  },
  labels: {
    singular: 'Gasto adicional de vehículo',
    plural: 'Gastos adicionales de vehículos',
  },
  fields: [
    {
      name: 'vehicle',
      label: 'Unidad vehicular',
      type: 'relationship',
      relationTo: 'vehicle',
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
          name: 'dateexpense',
          label: 'Fecha',
          type: 'date',
          required: true,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'expenseconcept',
          label: 'Concepto de gasto',
          type: 'text',
          required: true,
          admin: {
            width: '67%',
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
          admin: {
            width: '33%',
          },
        },
        {
          name: 'expensevalue',
          label: 'Costo',
          type: 'number',
          required: true,
          admin: {
            width: '34%',
          },
        },
      ],
    },
    {
      name: 'expensefiles',
      label: 'Archivos',
      type: 'array',
      labels: {
        singular: 'Archivo',
        plural: 'Archivos',
      },
      required: false,
      fields: [
        {
          name: 'mediaexpensevehicle',
          label: 'Archivo',
          type: 'upload',
          maxDepth: 4,
          relationTo: 'mediaexpensevehicle',
          required: false,
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
          throw new Error(
            'El campo typecurrency es requerido para crear un gasto adicional de vehículo',
          )
        }

        // 3. Cálculo de totalExpenseUSD y totalExpensePEN
        if (
          (operation === 'create' || operation === 'update') &&
          data.typecurrency &&
          data.expensevalue !== undefined
        ) {
          try {
            const typeCurrency = await payload.findByID({
              collection: 'typecurrency',
              id: data.typecurrency,
            })

            const codeCurrency = typeCurrency?.codecurrency
            const expenseValue = Number(data.expensevalue) || 0
            const exchangeRate = Number(data.exchangerate) || 1

            let totalUSD = 0
            let totalPEN = 0

            if (codeCurrency === 'USD') {
              totalUSD = expenseValue
              totalPEN = expenseValue * exchangeRate
            } else if (codeCurrency === 'PEN') {
              totalPEN = expenseValue
              totalUSD = expenseValue / exchangeRate
            } else {
              console.warn(`Moneda no soportada en ExpenseAditionalVehicle: ${codeCurrency}`)
            }

            data.totalExpenseUSD = Number(totalUSD.toFixed(2))
            data.totalExpensePEN = Number(totalPEN.toFixed(2))
          } catch (error) {
            console.error('Error al obtener typecurrency en ExpenseAditionalVehicle:', error)
            data.totalExpenseUSD = data.totalExpenseUSD || 0
            data.totalExpensePEN = data.totalExpensePEN || 0
          }
        } else {
          // Mantener valores existentes o establecer en 0
          data.totalExpenseUSD = data.totalExpenseUSD || 0
          data.totalExpensePEN = data.totalExpensePEN || 0
        }

        return data
      },
    ],
  },

  endpoints: [
    {
      path: '/total-expense-vehicle/:vehicleId',
      method: 'get',
      handler: async (req) => {
        try {
          const { payload, routeParams } = req
          const vehicleId = routeParams?.vehicleId

          if (!vehicleId) {
            return Response.json({ error: 'El ID del vehículo es requerido' }, { status: 400 })
          }

          // Consultar todos los gastos adicionales asociados al vehículo
          const expenses = await payload.find({
            collection: 'expenseaditionalvehicle',
            where: {
              vehicle: {
                equals: vehicleId,
              },
            },
            limit: 0, // Obtener todos los documentos sin límite
          })

          // Sumar los totales de totalExpenseUSD y totalExpensePEN
          const totals = expenses.docs.reduce(
            (acc, expense) => {
              acc.totalUSD += expense.totalExpenseUSD || 0
              acc.totalPEN += expense.totalExpensePEN || 0
              return acc
            },
            { totalUSD: 0, totalPEN: 0 },
          )

          // Redondear los resultados a 2 decimales
          totals.totalUSD = Number(totals.totalUSD.toFixed(2))
          totals.totalPEN = Number(totals.totalPEN.toFixed(2))

          // Devolver la respuesta con encabezados CORS
          return Response.json(
            {
              vehicleId,
              totalExpenseUSD: totals.totalUSD,
              totalExpensePEN: totals.totalPEN,
              currencyDetails: {
                USD: totals.totalUSD,
                PEN: totals.totalPEN,
              },
            },
            {
              status: 200,
              headers: headersWithCors({
                headers: new Headers(),
                req,
              }),
            },
          )
        } catch (error) {
          console.error('Error en el endpoint total-by-vehicle:', error)
          return Response.json(
            { error: 'Error al calcular los totales' },
            {
              status: 500,
              headers: headersWithCors({
                headers: new Headers(),
                req,
              }),
            },
          )
        }
      },
    },
  ],
}
