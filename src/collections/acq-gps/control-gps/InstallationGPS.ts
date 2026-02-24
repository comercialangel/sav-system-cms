import type { CollectionConfig } from 'payload'
import { headersWithCors } from 'payload'

export const InstallationGps: CollectionConfig = {
  slug: 'installationgps',
  access: {
    read: () => true,
    create: () => true,
  },
  admin: {
    group: "Adquisiciones de GPS y SIM's",
  },
  labels: {
    singular: 'Instalación GPS',
    plural: 'Instalaciones GPS',
  },
  fields: [
    {
      name: 'assignmentgps',
      type: 'relationship',
      label: 'Asignación de GPS asociada',
      relationTo: 'assignmentgps',
      required: false,
      hasMany: false,
      admin: {
        readOnly: false,
        allowEdit: false,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'installationdate',
          label: 'Fecha de instalación',
          type: 'date',
          required: false,
          timezone: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'installergps',
          label: 'Instalador encargado',
          type: 'relationship',
          relationTo: 'installergps',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: true,
          },
        },
        {
          name: 'warehouse',
          label: 'Almacén de instalación',
          type: 'relationship',
          relationTo: 'warehouse',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },
        {
          name: 'otherplaceinstallation',
          label: 'Otro lugar de instalación',
          type: 'relationship',
          relationTo: 'otherplaceinstallation',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: true,
          },
        },
        {
          name: 'typepayment',
          label: 'Tipo de pago',
          type: 'relationship',
          relationTo: 'typepayment',
          required: false,
          hasMany: false,
          admin: {
            width: '34%',
            allowCreate: false,
          },
        },
        {
          name: 'typecurrencypayment',
          label: 'Tipo de moneda',
          type: 'relationship',
          relationTo: 'typecurrency',
          required: false,
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
          defaultValue: 0,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'paymentvalue',
          label: 'Valor de pago',
          type: 'number',
          required: false,
          admin: {
            width: '34%',
          },
        },
      ],
    },
    {
      name: 'mediainstallation',
      label: 'Voucher de pago (opcional)',
      type: 'upload',
      relationTo: 'mediainstallation',
      required: false,
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

        // 2. Validar typecurrencypayment en creación (opcional)
        if (operation === 'create' && !data.typecurrencypayment) {
          throw new Error(
            'El campo typecurrencypayment es requerido para crear una instalación GPS',
          )
        }

        // 3. Cálculo de totalExpenseUSD y totalExpensePEN
        if (
          (operation === 'create' || operation === 'update') &&
          data.typecurrencypayment &&
          data.paymentvalue !== undefined
        ) {
          try {
            const typeCurrency = await payload.findByID({
              collection: 'typecurrency',
              id: data.typecurrencypayment,
            })

            const codeCurrency = typeCurrency?.codecurrency
            const paymentValue = Number(data.paymentvalue) || 0
            const exchangeRate = Number(data.exchangerate) || 1

            let totalUSD = 0
            let totalPEN = 0

            if (codeCurrency === 'USD') {
              totalUSD = paymentValue
              totalPEN = paymentValue * exchangeRate
            } else if (codeCurrency === 'PEN') {
              totalPEN = paymentValue
              totalUSD = paymentValue / exchangeRate
            } else {
              console.warn(`Moneda no soportada en InstallationGps: ${codeCurrency}`)
            }

            data.totalExpenseUSD = Number(totalUSD.toFixed(2))
            data.totalExpensePEN = Number(totalPEN.toFixed(2))
          } catch (error) {
            console.error('Error al obtener typecurrency en InstallationGps:', error)
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

    afterChange: [
      async ({ doc, req }) => {
        const { payload } = req

        try {
          // Solo procesar si hay una asignación asociada
          if (doc.assignmentgps) {
            const assignmentId =
              typeof doc.assignmentgps === 'object' ? doc.assignmentgps.id : doc.assignmentgps

            // Obtener la asignación completa con relaciones
            const assignment = await payload.findByID({
              collection: 'assignmentgps',
              id: assignmentId,
              depth: 2,
            })

            // 1. Actualizar la asignación GPS
            await payload.update({
              collection: 'assignmentgps',
              id: assignmentId,
              data: {
                statusinstallation: 'instalado',
              },
              overrideAccess: false,
            })

            // 2. Actualizar estado del dispositivo GPS
            if (assignment.devicecode) {
              const deviceId =
                typeof assignment.devicecode === 'object'
                  ? assignment.devicecode.id
                  : assignment.devicecode

              await payload.update({
                collection: 'devicegps',
                id: deviceId,
                data: { status: 'en uso' },
                overrideAccess: false,
              })
              console.log('Dispositivo GPS actualizado a "en uso"')
            }

            // 3. Actualizar estado de la tarjeta SIM
            if (assignment.numbersim) {
              const simId =
                typeof assignment.numbersim === 'object'
                  ? assignment.numbersim.id
                  : assignment.numbersim

              await payload.update({
                collection: 'cardsim',
                id: simId,
                data: { status: 'en uso' },
                overrideAccess: false,
              })
              console.log('Tarjeta SIM actualizada a "en uso"')
            }

            console.log('Asignación GPS actualizada a "instalado"')
          }
        } catch (error) {
          console.error('Error en hook de instalación GPS:', {
            error: error,
            stack: error,
            docId: doc.id,
          })
          throw new Error('No se pudo completar las actualizaciones de estado')
        }
      },
    ],
  },

  endpoints: [
    {
      path: '/total-cost-gps/:vehicleId',
      method: 'get',
      handler: async (req) => {
        const { payload, routeParams } = req
        const vehicleId = routeParams?.vehicleId as string

        try {
          // Validar que se proporcionó un vehicleId
          if (!vehicleId) {
            return Response.json({ error: 'El ID del vehículo es requerido' }, { status: 400 })
          }

          // Consultar el vehículo para verificar si existe
          const vehicle = await payload.findByID({
            collection: 'vehicle',
            id: vehicleId,
            depth: 0,
          })

          if (!vehicle) {
            return Response.json({ error: 'Vehículo no encontrado' }, { status: 404 })
          }

          // Consultar todas las asignaciones GPS para el vehículo con statusinstallation: 'instalado' y statusassignment: 'vigente'
          const assignments = await payload.find({
            collection: 'assignmentgps',
            where: {
              and: [
                { vehicle: { equals: vehicleId } },
                { statusinstallation: { equals: 'instalado' } },
                { statusassignment: { equals: 'vigente' } },
              ],
            },
            depth: 2, // Suficiente para obtener installationgps, devicecode y numbersim
          })
          let totalUSD = 0
          let totalPEN = 0

          // Procesar cada asignación
          for (const assignment of assignments.docs) {
            // Obtener el costo de instalación desde installationgps

            // if (assignment.installationgps && typeof assignment.installationgps === 'object') {
            //   totalUSD += Number(assignment.installationgps.totalExpenseUSD || 0)
            //   totalPEN += Number(assignment.installationgps.totalExpensePEN || 0)
            // }
            // Obtener el costo de instalación desde installationgps

            // Verificamos si installationgps tiene la propiedad 'docs' (es un join paginado)
            if (
              assignment.installationgps &&
              typeof assignment.installationgps === 'object' &&
              'docs' in assignment.installationgps
            ) {
              // Accedemos al primer documento de instalación de esa asignación
              const instalacion = assignment.installationgps.docs?.[0]

              if (instalacion && typeof instalacion === 'object') {
                totalUSD += Number(instalacion.totalExpenseUSD || 0)
                totalPEN += Number(instalacion.totalExpensePEN || 0)
              }
            }

            // Obtener el costo del dispositivo GPS desde devicegps
            if (assignment.devicecode && typeof assignment.devicecode === 'object') {
              totalUSD += Number(assignment.devicecode.totalExpenseUSD || 0)
              totalPEN += Number(assignment.devicecode.totalExpensePEN || 0)

              // Verificar si el devicecode es de tipo Sinotrack
              const deviceType =
                typeof assignment.devicecode.typegps === 'object'
                  ? assignment.devicecode.typegps.typegps
                  : assignment.devicecode.typegps

              if (
                deviceType === 'Sinotrack' &&
                assignment.numbersim &&
                typeof assignment.numbersim === 'object'
              ) {
                // Sumar el costo de la tarjeta SIM desde cardsim
                totalUSD += Number(assignment.numbersim.totalExpenseUSD || 0)
                totalPEN += Number(assignment.numbersim.totalExpensePEN || 0)
              }
            }
          }

          // Redondear los totales a 2 decimales
          totalUSD = Number(totalUSD.toFixed(2))
          totalPEN = Number(totalPEN.toFixed(2))

          // Devolver la respuesta
          return Response.json(
            {
              gpsTotalCost: {
                totalUSD,
                totalPEN,
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
          console.error('Error en el endpoint /total-cost-gps:', error)
          return Response.json(
            { error: 'Error al calcular los costos totales de GPS' },
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
