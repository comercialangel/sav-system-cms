import { headersWithCors, type CollectionConfig } from 'payload'

export const RenewalsGPS: CollectionConfig = {
  slug: 'renewalsgps',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: "Adquisiciones de GPS y SIM's",
  },
  labels: {
    singular: 'Renovación de GPS',
    plural: 'Renovaciones de GPS',
  },
  fields: [
    {
      name: 'periodusegps',
      label: 'Periodo de uso asociado',
      type: 'relationship',
      relationTo: 'periodusegps',
      required: false,
      hasMany: false,
      index: true,
      maxDepth: 0,
      admin: {
        allowCreate: false,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startdate',
          label: 'Fecha de inicio',
          type: 'date',
          required: true,
          timezone: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'enddate',
          label: 'Fecha de finalización',
          type: 'date',
          required: false,
          timezone: true,
          admin: {
            width: '50%',
            readOnly: true,
            description: 'Fecha de finalización calculada automáticamente',
          },
        },
        {
          name: 'typecurrency',
          label: 'Tipo de moneda',
          type: 'relationship',
          relationTo: 'typecurrency',
          required: true,
          hasMany: false,
          maxDepth: 1,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },
        {
          name: 'renewalvalue',
          label: 'Valor',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'collaborator',
      label: 'Colaborador responsable de recarga',
      type: 'relationship',
      relationTo: 'collaborator',
      required: false,
      hasMany: false,
      admin: {
        allowCreate: false,
      },
    },
    {
      name: 'mediarenewal',
      label: 'Archivo',
      type: 'upload',
      relationTo: 'mediarenewal',
      required: false,
    },
    {
      name: 'observations',
      label: 'Observaciones',
      type: 'textarea',
      required: false,
    },

    {
      name: 'statusrenewal',
      label: 'Estado de renovación',
      type: 'select',
      required: true,
      admin: {
        position: 'sidebar',
      },
      options: [
        {
          label: 'Vigente',
          value: 'vigente',
        },

        {
          label: 'Vencido', // * Expired */
          value: 'vencido',
        },
        {
          label: 'Por vencer', // Notificar 2 days before
          value: 'por vencer',
        },
        {
          label: 'Finalizado', // * renovacion finalizado */
          value: 'finalizado',
        },
      ],
      defaultValue: 'vigente',
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
      async ({ data, req, operation }) => {
        if (req.user) {
          if (operation === 'create') {
            data.createdBy = req.user.id
          }
          data.updatedBy = req.user.id
        }

        if (operation === 'create' && data.periodusegps) {
          const { payload } = req

          try {
            // 1. Buscar TODAS las renovaciones anteriores del mismo periodusegps (excepto las ya finalizadas)
            const previousRenewals = await payload.find({
              collection: 'renewalsgps',
              where: {
                and: [
                  { periodusegps: { equals: data.periodusegps } }, // Mismo GPS
                  { statusrenewal: { not_equals: 'finalizada' } }, // Cualquier estado que no sea "finalizada"
                  { id: { not_equals: data.id } }, // Excluir la nueva renovación (si ya existe ID)
                ],
              },
              limit: 50, // Límite para incluir todo el historial
              sort: '-createdAt', // La más reciente primero
            })

            // 2. Actualizar todas las renovaciones encontradas a "finalizada"
            if (previousRenewals.docs.length > 0) {
              await Promise.all(
                previousRenewals.docs.map(async (doc) => {
                  try {
                    await payload.update({
                      collection: 'renewalsgps',
                      id: doc.id,
                      data: { statusrenewal: 'finalizado' },
                    })
                  } catch (updateError) {
                    console.error(`Error al finalizar renovación ${doc.id}:`, updateError)
                    // Continuar con las demás actualizaciones
                  }
                }),
              )

              console.log(
                `Se finalizaron ${previousRenewals.docs.length} renovaciones anteriores para el periodo ${data.periodusegps}`,
              )
            }
          } catch (error) {
            console.error('Error al buscar o finalizar renovaciones anteriores:', error)
            // No bloquear la creación si falla este proceso
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        const { payload } = req

        try {
          if (operation === 'create' && doc.periodusegps) {
            // 1. Obtener el periodo de uso relacionado
            const periodUse = await payload.findByID({
              collection: 'periodusegps',
              id: typeof doc.periodusegps === 'object' ? doc.periodusegps.id : doc.periodusegps,
              depth: 1,
            })

            // 2. Calcular lastDate basado en el tipo de periodo (select)
            const lastDate = new Date(doc.startdate)

            if (periodUse.periodgps === 'mensual') {
              lastDate.setMonth(lastDate.getMonth() + 1)
            } else if (periodUse.periodgps === 'anual') {
              lastDate.setFullYear(lastDate.getFullYear() + 1)
            }

            // 3. Actualizar la renovación con los datos calculados
            await payload.update({
              collection: 'renewalsgps',
              id: doc.id,
              data: {
                enddate: lastDate.toISOString(),
              },
            })

            // 4. Actualizar el periodo de uso con la referencia
            await payload.update({
              collection: 'periodusegps',
              id: periodUse.id,
              data: {
                renewalsgps: [...(periodUse.renewalsgps || []), doc.id],
              },
            })
          }
        } catch (error) {
          console.error('Error en hook de renovación:', error)
          throw new Error('No se pudo completar la configuración de la renovación')
        }
      },
    ],
  },

  endpoints: [
    {
      path: '/check-status',
      method: 'post',
      handler: async (req) => {
        try {
          const now = new Date()
          const warningDate = new Date(now)
          warningDate.setDate(now.getDate() + 2)

          // 1. Actualizar renovaciones "por vencer"
          const renewalsToWarn = await req.payload.find({
            collection: 'renewalsgps',
            where: {
              and: [
                { statusrenewal: { equals: 'vigente' } },
                { enddate: { less_than_equal: warningDate.toISOString() } },
                { enddate: { greater_than: now.toISOString() } },
              ],
            },
            limit: 1000,
            req,
          })

          await Promise.all(
            renewalsToWarn.docs.map(async (doc) => {
              await req.payload.update({
                collection: 'renewalsgps',
                id: doc.id,
                data: { statusrenewal: 'por vencer' },
                req,
              })
            }),
          )

          // 2. Actualizar renovaciones vencidas
          const expiredRenewals = await req.payload.find({
            collection: 'renewalsgps',
            where: {
              and: [
                { statusrenewal: { equals: 'vigente' } },
                { enddate: { less_than: now.toISOString() } },
              ],
            },
            limit: 1000,
            req,
          })

          await Promise.all(
            expiredRenewals.docs.map(async (doc) => {
              await req.payload.update({
                collection: 'renewalsgps',
                id: doc.id,
                data: { statusrenewal: 'vencido' },
                req,
              })
            }),
          )

          return Response.json(
            {
              success: true,
              stats: {
                warned: renewalsToWarn.docs.length,
                expired: expiredRenewals.docs.length,
              },
            },
            {
              headers: headersWithCors({ headers: new Headers(), req }),
            },
          )
        } catch (error) {
          return Response.json(
            { error: 'Error verificando renovaciones', details: error },
            {
              status: 500,
              headers: headersWithCors({ headers: new Headers(), req }),
            },
          )
        }
      },
    },
  ],
}
