import type { CollectionConfig } from 'payload'
import { headersWithCors } from 'payload'

export const PurchaseTransportation: CollectionConfig = {
  slug: 'purchasetransportation',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Adquisiciones vehiculares',
  },
  labels: {
    singular: 'Traslado de compra',
    plural: 'Traslados de compras',
  },
  fields: [
    {
      name: 'purchase',
      label: 'Compra asociada',
      type: 'relationship',
      relationTo: 'purchase',
      required: true,
      index: true,
      maxDepth: 0,
      admin: {
        allowCreate: false,
        allowEdit: false,
      },
    },
    {
      name: 'optionsplate',
      label: 'Placa a utilizar',
      type: 'radio',
      options: [
        // required
        {
          label: 'Interna',
          value: 'interna',
        },
        {
          label: 'Externa',
          value: 'externa',
        },
        {
          label: 'Sin placa',
          value: 'sin placa',
        },
      ],
      defaultValue: 'interna', // The first value in options.
      admin: {
        layout: 'horizontal',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'internalplates',
          label: 'Placa de exhibición',
          type: 'relationship',
          relationTo: 'internalplates',
          required: false,
          hasMany: false,
          index: true,
          maxDepth: 2,
          admin: {
            width: '50%',
            allowCreate: false,
            condition: (data) => data?.optionsplate === 'interna',
          },
        },
        {
          name: 'externalplates',
          label: 'Placa external',
          type: 'relationship',
          relationTo: 'externalplates',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: true,
            condition: (data) => data?.optionsplate === 'externa',
          },
        },
        {
          name: 'driver',
          label: 'Conductor',
          type: 'relationship',
          relationTo: 'driver',
          required: false,
          hasMany: false,
          index: true,
          admin: {
            width: '100%',
            allowCreate: false,
          },
        },
        {
          name: 'departuredate',
          label: 'Fecha de salida',
          type: 'date',
          required: false,
          timezone: true,
          admin: {
            width: '50%',
            date: {
              displayFormat: 'd MMM yyy',
            },
          },
        },
        {
          name: 'placeorigin',
          label: 'Lugar de salida (Proveedor)',
          type: 'relationship',
          relationTo: 'supplieraddress',
          required: false,
          hasMany: false,
          index: true,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },
        {
          name: 'establishment',
          label: 'Establecimiento destino',
          type: 'relationship',
          relationTo: 'establishment',
          required: false,
          hasMany: false,
          admin: {
            width: '100%',
            allowCreate: false,
          },
        },
      ],
    },
    {
      name: 'transportationfiles',
      label: 'Archivos de traslado',
      type: 'array',
      required: false,
      labels: {
        singular: 'Archivo adjunto',
        plural: 'Archivos adjuntos',
      },
      fields: [
        {
          name: 'mediatransportation',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediapurchasetransportation',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'exchangerate',
          label: 'Tipo de cambio (PEN a USD)',
          type: 'number',
          required: false,
          defaultValue: 0,
          min: 0,
          admin: {
            width: '30%',
            description: 'Tipo de cambio para convertir gastos de PEN a USD.',
          },
        },
      ],
    },
    {
      name: 'expenselist',
      label: 'Lista de gastos',
      type: 'array',
      labels: {
        singular: 'Gasto',
        plural: 'Gastos',
      },
      required: false,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'conceptexpense',
              label: 'Concepto de gasto',
              type: 'relationship',
              relationTo: 'expense',
              required: true,
              hasMany: false,
              admin: {
                width: '100%',
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
                width: '50%',
                allowCreate: false,
              },
            },
            {
              name: 'expensevalue',
              label: 'Valor de gasto',
              type: 'number',
              required: true,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'observationsexpense',
          label: 'Observaciones',
          type: 'textarea',
          required: false,
        },
        {
          name: 'mediaexpense',
          label: 'Archivo de gasto',
          type: 'upload',
          relationTo: 'mediapurchasetransportation',
          required: false,
        },
      ],
    },

    {
      name: 'totalExpensesPEN',
      label: 'Total gastos (PEN)',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Suma total de gastos de traslado, redondeada a 2 decimales.',
      },
      // hooks: {
      //   beforeValidate: [
      //     async ({ data }) => {
      //       let total = 0
      //       if (data?.expenselist) {
      //         for (const expense of data?.expenselist) {
      //           const value = parseFloat(expense.expensevalue) || 0
      //           total += value
      //         }
      //       }
      //       return total
      //     },
      //   ],
      // },
    },

    {
      name: 'totalExpensesUSD',
      label: 'Total gastos (USD)',
      type: 'number',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description:
          'Suma total de gastos convertidos a dólares americanos (USD), usando el campo exchangerate',
      },
      // hooks: {
      //   beforeValidate: [
      //     ({ data }) => {
      //       if (!data?.totalExpensesPEN || !data.exchangerate || data.exchangerate <= 0) return 0
      //       return parseFloat((data.totalExpensesPEN / data.exchangerate).toFixed(2))
      //     },
      //   ],
      // },
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
      options: [
        { label: 'En Tránsito', value: 'en transito' },
        { label: 'Completado', value: 'completado' },
        { label: 'Cancelado', value: 'cancelado' },
      ],
      defaultValue: 'en transito',
      admin: {
        position: 'sidebar',
        readOnly: false, // Se actualiza automáticamente
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
      async ({ data }) => {
        // Calcular totalExpensesPEN
        let totalPEN = 0
        if (data?.expenselist) {
          for (const expense of data?.expenselist) {
            let value = Number(parseFloat(expense.expensevalue).toFixed(2)) || 0
            if (expense.typecurrency === 'USD' && data.exchangerate > 0) {
              value = value * data.exchangerate
            }
            totalPEN += value
          }
        }
        data.totalExpensesPEN = Number(totalPEN.toFixed(2))

        // Calcular totalExpensesUSD
        data.totalExpensesUSD =
          !totalPEN || !data.exchangerate || data.exchangerate <= 0
            ? 0
            : Number((totalPEN / data.exchangerate).toFixed(2))
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req, operation }) => {
        const { payload } = req

        // Evitar procesamiento si el estado cambió a 'completado'
        if (operation === 'update' && doc?.status === 'completado') {
          return
        }

        try {
          // Operación de creación
          if (operation === 'create') {
            // 1. Actualizar la compra relacionada
            if (doc.purchase) {
              const purchaseId = typeof doc.purchase === 'object' ? doc.purchase.id : doc.purchase
              await payload.update({
                collection: 'purchase',
                id: purchaseId,
                data: {
                  statusreception: 'en transito',
                },
              })
              console.log(`Compra ${purchaseId} actualizada a "en transito"`)
            }

            // 2. Actualizar estado de placas según la opción seleccionada
            if (doc.optionsplate === 'interna' && doc.internalplates) {
              const plateIdInternal =
                typeof doc.internalplates === 'object' ? doc.internalplates.id : doc.internalplates
              await payload.update({
                collection: 'internalplates',
                id: plateIdInternal,
                data: { status: 'asignada' },
              })
              console.log(`Placa interna ${plateIdInternal} actualizada a "asignada"`)
            } else if (doc.optionsplate === 'externa' && doc.externalplates) {
              const plateIdExternal =
                typeof doc.externalplates === 'object' ? doc.externalplates.id : doc.externalplates
              await payload.update({
                collection: 'externalplates',
                id: plateIdExternal,
                data: { status: 'asignada' },
              })
              console.log(`Placa externa ${plateIdExternal} actualizada a "asignada"`)
            }
          }
        } catch (error) {
          console.error('Error en operacion de creacion:', error)
          throw new Error(
            `Error completo en operacion de creacion. Ver logs para detalles.: ${error}`,
          )
        }

        try {
          // Operación de actualización
          if (operation === 'update' && previousDoc) {
            // Caso 1: Cambio a 'sin placa'
            if (doc.optionsplate === 'sin placa') {
              if (previousDoc.optionsplate === 'interna' && previousDoc.internalplates) {
                const prevPlateIdInternal =
                  typeof previousDoc.internalplates === 'object'
                    ? previousDoc.internalplates.id
                    : previousDoc.internalplates
                await payload.update({
                  collection: 'internalplates',
                  id: prevPlateIdInternal,
                  data: { status: 'liberada' },
                })
                console.log(`Placa interna ${prevPlateIdInternal} liberada`)
              } else if (previousDoc.optionsplate === 'externa' && previousDoc.externalplates) {
                const prevPlateIdExternal =
                  typeof previousDoc.externalplates === 'object'
                    ? previousDoc.externalplates.id
                    : previousDoc.externalplates
                await payload.update({
                  collection: 'externalplates',
                  id: prevPlateIdExternal,
                  data: { status: 'liberada' },
                })
                console.log(`Placa externa ${prevPlateIdExternal} liberada`)
              }
            }
            // Caso 2: Cambio entre tipos de placas (interna ↔ externa)
            else if (doc.optionsplate !== previousDoc.optionsplate) {
              // Liberar placa anterior
              if (previousDoc.optionsplate === 'interna' && previousDoc.internalplates) {
                const prevPlateIdInternal =
                  typeof previousDoc.internalplates === 'object'
                    ? previousDoc.internalplates.id
                    : previousDoc.internalplates
                await payload.update({
                  collection: 'internalplates',
                  id: prevPlateIdInternal,
                  data: { status: 'liberada' },
                })
                console.log(`Placa interna ${prevPlateIdInternal} liberada por cambio de tipo`)
              } else if (previousDoc.optionsplate === 'externa' && previousDoc.externalplates) {
                const prevPlateIdExternal =
                  typeof previousDoc.externalplates === 'object'
                    ? previousDoc.externalplates.id
                    : previousDoc.externalplates
                await payload.update({
                  collection: 'externalplates',
                  id: prevPlateIdExternal,
                  data: { status: 'liberada' },
                })
                console.log(`Placa externa ${prevPlateIdExternal} liberada por cambio de tipo`)
              }

              // Asignar nueva placa
              if (doc.optionsplate === 'interna' && doc.internalplates) {
                const plateIdInternal =
                  typeof doc.internalplates === 'object'
                    ? doc.internalplates.id
                    : doc.internalplates
                await payload.update({
                  collection: 'internalplates',
                  id: plateIdInternal,
                  data: { status: 'asignada' },
                })
                console.log(`Nueva placa interna ${plateIdInternal} asignada`)
              } else if (doc.optionsplate === 'externa' && doc.externalplates) {
                const plateIdExternal =
                  typeof doc.externalplates === 'object'
                    ? doc.externalplates.id
                    : doc.externalplates
                await payload.update({
                  collection: 'externalplates',
                  id: plateIdExternal,
                  data: { status: 'asignada' },
                })
                console.log(`Nueva placa externa ${plateIdExternal} asignada`)
              }
            }
            // Caso 3: Cambio de placa del mismo tipo
            else if (doc.optionsplate === previousDoc.optionsplate) {
              if (
                doc.optionsplate === 'interna' &&
                doc.internalplates &&
                previousDoc.internalplates
              ) {
                const plateIdInternal =
                  typeof doc.internalplates === 'object'
                    ? doc.internalplates.id
                    : doc.internalplates
                const prevPlateIdInternal =
                  typeof previousDoc.internalplates === 'object'
                    ? previousDoc.internalplates.id
                    : previousDoc.internalplates
                if (plateIdInternal !== prevPlateIdInternal) {
                  // Liberar placa anterior
                  await payload.update({
                    collection: 'internalplates',
                    id: prevPlateIdInternal,
                    data: { status: 'liberada' },
                  })
                  console.log(`Placa interna anterior ${prevPlateIdInternal} liberada`)

                  // Asignar nueva placa
                  await payload.update({
                    collection: 'internalplates',
                    id: plateIdInternal,
                    data: { status: 'asignada' },
                  })
                  console.log(`Nueva placa interna ${plateIdInternal} asignada`)
                }
              } else if (
                doc.optionsplate === 'externa' &&
                doc.externalplates &&
                previousDoc.externalplates
              ) {
                const plateIdExternal =
                  typeof doc.externalplates === 'object'
                    ? doc.externalplates.id
                    : doc.externalplates
                const prevPlateIdExternal =
                  typeof previousDoc.externalplates === 'object'
                    ? previousDoc.externalplates.id
                    : previousDoc.externalplates
                if (plateIdExternal !== prevPlateIdExternal) {
                  // Liberar placa anterior
                  await payload.update({
                    collection: 'externalplates',
                    id: prevPlateIdExternal,
                    data: { status: 'liberada' },
                  })
                  console.log(`Placa externa anterior ${prevPlateIdExternal} liberada`)

                  // Asignar nueva placa
                  await payload.update({
                    collection: 'externalplates',
                    id: plateIdExternal,
                    data: { status: 'asignada' },
                  })
                  console.log(`Nueva placa externa ${plateIdExternal} asignada`)
                }
              }
            }
          }
        } catch (error) {
          console.error('Error en operacion de actualizacion:', error)
          throw new Error(
            `Error completo en operacion de actualizacion. Ver logs para detalles.: ${error}`,
          )
        }
      },
    ],
  },

  // Agregar endpoints personalizados

  endpoints: [
    // Endpoint para eliminar un archivo de transporte
    // y eliminar un archivo específico de un traslado de compra
    {
      path: '/:id/remove-file/:fileArrayId',
      method: 'delete',
      handler: async (req) => {
        try {
          //1. Acceso correcto a los parámetros de ruta
          const id = req.routeParams?.id as string
          const fileArrayId = req.routeParams?.fileArrayId as string

          if (!id || !fileArrayId) {
            return Response.json(
              { error: 'Se requieren los parámetros id y fileArrayId' },
              {
                status: 400,
                headers: headersWithCors({
                  headers: new Headers(),
                  req,
                }),
              },
            )
          }

          // 2. Obtener el documento actual
          const currentDoc = await req.payload.findByID({
            collection: 'purchasetransportation',
            id,
            depth: 1,
            req,
          })

          if (!currentDoc) {
            return Response.json(
              { error: 'Compra no encontrada' },
              {
                status: 404,
                headers: headersWithCors({
                  headers: new Headers(),
                  req,
                }),
              },
            )
          }

          // 3. Validación del archivo
          const fileToDelete = currentDoc.transportationfiles?.find(
            (file) => file.id === fileArrayId,
          )

          if (!fileToDelete?.mediatransportation) {
            return Response.json(
              { error: 'Archivo no encontrado en este traslado' },
              {
                status: 404,
                headers: headersWithCors({
                  headers: new Headers(),
                  req,
                }),
              },
            )
          }

          // 4. Eliminación segura del archivo físico
          const mediaId =
            typeof fileToDelete.mediatransportation === 'string'
              ? fileToDelete.mediatransportation
              : fileToDelete.mediatransportation.id

          await req.payload.delete({
            collection: 'mediapurchasetransportation',
            id: mediaId,
            req,
          })

          // 5. Actualización eficiente del documento
          const updatedDoc = await req.payload.update({
            collection: 'purchasetransportation',
            id,
            data: {
              transportationfiles: currentDoc.transportationfiles?.filter(
                (file) => file.id !== fileArrayId,
              ),
            },
            req,
          })

          // 6. Respuesta informativa
          return Response.json(
            {
              success: true,
              message: 'Archivo eliminado exitosamente',
              purchase: updatedDoc,
            },
            {
              headers: headersWithCors({
                headers: new Headers(),
                req,
              }),
            },
          )
        } catch (error) {
          return Response.json(
            { error: 'Error eliminando archivo', details: error },
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

    // Endpoint para eliminar un gasto específico de un traslado de compra
    // y eliminar el archivo asociado al gasto si existe
    {
      path: '/:id/remove-expense/:expenseId',
      method: 'delete',
      handler: async (req) => {
        try {
          // 1. Obtener parámetros de la ruta
          const id = req.routeParams?.id as string
          const expenseId = req.routeParams?.expenseId as string

          if (!id || !expenseId) {
            return Response.json(
              { error: 'Se requieren los parámetros id y expenseId' },
              {
                status: 400,
                headers: headersWithCors({
                  headers: new Headers(),
                  req,
                }),
              },
            )
          }

          // 2. Obtener el documento actual
          const currentDoc = await req.payload.findByID({
            collection: 'purchasetransportation',
            id,
            depth: 1,
            req,
          })

          if (!currentDoc) {
            return Response.json(
              { error: 'Traslado no encontrado' },
              {
                status: 404,
                headers: headersWithCors({
                  headers: new Headers(),
                  req,
                }),
              },
            )
          }

          // 3. Validar que el gasto existe
          const expenseToDelete = currentDoc.expenselist?.find(
            (expense) => expense.id === expenseId,
          )

          if (!expenseToDelete) {
            return Response.json(
              { error: 'Gasto no encontrado en este traslado' },
              {
                status: 404,
                headers: headersWithCors({
                  headers: new Headers(),
                  req,
                }),
              },
            )
          }

          // 4. Eliminar archivo asociado si existe
          if (expenseToDelete.mediaexpense) {
            const mediaId =
              typeof expenseToDelete.mediaexpense === 'string'
                ? expenseToDelete.mediaexpense
                : expenseToDelete.mediaexpense.id

            await req.payload.delete({
              collection: 'mediapurchasetransportation',
              id: mediaId,
              req,
            })
          }

          // 5. Actualizar el documento eliminando el gasto
          const updatedDoc = await req.payload.update({
            collection: 'purchasetransportation',
            id,
            data: {
              expenselist: currentDoc.expenselist?.filter((expense) => expense.id !== expenseId),
            },
            req,
          })

          // 6. Respuesta exitosa
          return Response.json(
            {
              success: true,
              message: 'Gasto eliminado exitosamente',
              transportation: updatedDoc,
            },
            {
              headers: headersWithCors({
                headers: new Headers(),
                req,
              }),
            },
          )
        } catch (error) {
          return Response.json(
            { error: 'Error eliminando gasto', details: error },
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
