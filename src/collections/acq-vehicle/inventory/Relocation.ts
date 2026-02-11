import type { CollectionConfig } from 'payload'
import { headersWithCors } from 'payload'

export const Relocation: CollectionConfig = {
  slug: 'relocation',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Control de inventario vehicular',
  },
  labels: {
    singular: 'Traslado vehicular entre establecimientos',
    plural: 'Traslados vehiculares entre establecimientos',
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
      name: 'optionsplate',
      label: 'Placa a utilizar',
      type: 'radio',
      options: [
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
      defaultValue: 'interna',
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
          admin: {
            width: '50%',
            allowCreate: false,
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
            allowCreate: false,
          },
        },
        {
          name: 'driver',
          label: 'Conductor',
          type: 'relationship',
          relationTo: 'driver',
          required: true,
          hasMany: false,
          admin: {
            width: '100%',
            allowCreate: false,
          },
        },
        {
          name: 'exitdate',
          label: 'Fecha de salida',
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
          name: 'establishment', //establecimiento de destino
          label: 'Establecimiento destino',
          type: 'relationship',
          relationTo: 'establishment',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },
      ],
    },
    {
      name: 'relocationfiles',
      label: 'Archivos de traslado',
      type: 'array',
      required: false,
      labels: {
        singular: 'Archivo adjunto',
        plural: 'Archivos adjuntos',
      },
      fields: [
        {
          name: 'mediarelocation',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediarelocation',
          required: true,
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
      type: 'row',
      fields: [
        {
          name: 'exchangerate',
          label: 'Tipo de cambio',
          type: 'number',
          required: false,
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
          label: 'Archivo de costo',
          type: 'upload',
          relationTo: 'mediarelocation',
          required: false,
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
          label: 'En tránsito',
          value: 'en tránsito',
        },
        {
          label: 'Recepcionada',
          value: 'recepcionada',
        },
        {
          label: 'Anulado',
          value: 'anulado',
        },
      ],
      defaultValue: 'en tránsito',
    },
    {
      name: 'motivecancellation',
      label: 'Motivo de cancelación',
      type: 'textarea',
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'warehouseorigin',
      label: 'Almacén de origen',
      type: 'relationship',
      relationTo: 'warehouse',
      hasMany: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
        allowEdit: false,
      },
    },
    {
      name: 'receptionrelocation',
      label: 'Recepción de traslado',
      type: 'join',
      collection: 'receptionrelocation',
      on: 'relocation',
      hasMany: false,
      maxDepth: 2,
    },
    {
      type: 'relationship',
      name: 'createdBy',
      label: 'Creado por',
      relationTo: 'users',
      admin: {
        readOnly: false,
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
        readOnly: false,
        position: 'sidebar',
        allowEdit: false,
      },
    },
  ],
  hooks: {
    // ============================================================
    // 1. BEFORE CHANGE: Validaciones y Preparación de Datos
    // ============================================================
    beforeChange: [
      async ({ req, data, operation }) => {
        const { payload } = req

        if (req.user) {
          if (operation === 'create') {
            data.createdBy = req.user.id
          }
          data.updatedBy = req.user.id
        }

        if (operation === 'create') {
          try {
            // A. Obtener el Almacén "En tránsito" (Lo necesitamos para el inventario después)
            const transitWarehouse = await payload.find({
              collection: 'warehouse',
              where: { warehousename: { equals: 'En tránsito' } },
              limit: 1,
              req,
            })

            if (!transitWarehouse.docs.length) {
              throw new Error('Configuración faltante: No existe el almacén "En tránsito".')
            }
            const transitWarehouseId = transitWarehouse.docs[0].id

            // B. Buscar el Inventario del Vehículo
            // Necesitamos esto para saber de DÓNDE sale (warehouseorigin) y de qué EMPRESA es.
            if (data.vehicle) {
              const inventoryRes = await payload.find({
                collection: 'inventory',
                where: { vehicle: { equals: data.vehicle } },
                limit: 1,
                depth: 0, // Depth 0 para obtener IDs directos
                req,
              })

              if (inventoryRes.docs.length > 0) {
                const inv = inventoryRes.docs[0]

                // Extraemos IDs de forma segura
                const companyId =
                  typeof inv.dealership === 'object' ? inv.dealership?.id : inv.dealership
                const originId = typeof inv.location === 'object' ? inv.location?.id : inv.location

                // 1. ASIGNACIÓN DIRECTA (Evita el update en afterChange)
                // Si no se especificó origen manualmente, lo tomamos del inventario
                if (!data.warehouseorigin) {
                  data.warehouseorigin = originId
                }

                // 2. Pasar datos al contexto para afterChange (Evita volver a consultar)
                req.context = {
                  ...req.context,
                  relocationData: {
                    inventoryId: inv.id,
                    transitWarehouseId: transitWarehouseId,
                    companyId: companyId,
                    originId: originId, // Para el movimiento
                  },
                }
              } else {
                console.warn(
                  `[RELOCATION] Advertencia: Vehículo ${data.vehicle} no encontrado en inventario.`,
                )
              }
            }
          } catch (error) {
            console.error('Error en beforeChange de Relocation:', error)
            throw error // Lanzar para que el frontend vea el error real
          }
        }
        return data
      },
    ],

    // ============================================================
    // 2. AFTER CHANGE: Efectos Secundarios (Placas, Inventario, Movimientos)
    // ============================================================
    afterChange: [
      async ({ doc, req, operation, previousDoc }) => {
        const { payload } = req
        // const contextData = req.context?.relocationData
        // const contextData = (req.context as unknown as RelocationContext).relocationData
        const contextData = (
          req.context as unknown as {
            relocationData?: {
              inventoryId: string
              transitWarehouseId: string
              companyId: string
              originId: string
            }
          }
        ).relocationData
        // BLOQUE 1: CREACIÓN (Logística de Salida)
        try {
          // --- LÓGICA DE CREACIÓN ---
          if (operation === 'create') {
            // 1. Actualizar Placas (Esto está bien aquí)
            if (doc.optionsplate === 'interna' && doc.internalplates) {
              const id =
                typeof doc.internalplates === 'object' ? doc.internalplates.id : doc.internalplates
              await payload.update({
                collection: 'internalplates',
                id,
                data: { status: 'asignada' },
                req,
              })
            } else if (doc.optionsplate === 'externa' && doc.externalplates) {
              const id =
                typeof doc.externalplates === 'object' ? doc.externalplates.id : doc.externalplates
              await payload.update({
                collection: 'externalplates',
                id,
                data: { status: 'asignada' },
                req,
              })
            }

            // 2. Actualizar Inventario y Crear Movimiento (Usando datos del Contexto)
            if (contextData && contextData.inventoryId) {
              // A. Mover inventario a "En tránsito"
              await payload.update({
                collection: 'inventory',
                id: contextData.inventoryId,
                data: {
                  status: 'En Tránsito',
                  location: contextData.transitWarehouseId,
                },
                req,
              })
              console.log(`[RELOCATION] Inventario ${contextData.inventoryId} movido a tránsito.`)

              // B. Crear Movimiento de Salida
              // Validamos que tengamos los datos mínimos
              if (contextData.companyId && contextData.originId) {
                await payload.create({
                  collection: 'movements',
                  data: {
                    vehicle: typeof doc.vehicle === 'object' ? doc.vehicle.id : doc.vehicle,
                    company: contextData.companyId,
                    movementdate: doc.exitdate, // Usamos la fecha del traslado
                    typemovement: 'salida',
                    motivemovement: 'Traslado vehicular a otro establecimiento',
                    warehouse: contextData.originId, // Sale del origen real
                    status: 'efectuado',
                    relocationId: doc.id,
                  },
                  req,
                })
                console.log('[RELOCATION] Movimiento de salida creado.')
              } else {
                console.error(
                  '[RELOCATION ERROR] No se pudo crear movimiento: Falta Company o Warehouse en el inventario origen.',
                )
              }
            }
          }
        } catch (error) {
          console.error(`Error crítico al crear traslado:`, error)
        }

        // BLOQUE 2: ACTUALIZACIÓN (Lógica de Anulación/Cambios)

        try {
          // Operación de actualización
          if (operation === 'update' && previousDoc) {
            // Caso 1: Cambio de estado a "anulado"
            if (previousDoc.status === 'en tránsito' && doc.status === 'anulado') {
              // Liberar la placa según el optionsplate anterior
              if (previousDoc.optionsplate === 'interna' && previousDoc.internalplates) {
                const plateIdInternal =
                  typeof previousDoc.internalplates === 'object'
                    ? previousDoc.internalplates.id
                    : previousDoc.internalplates
                await payload.update({
                  collection: 'internalplates',
                  id: plateIdInternal,
                  data: { status: 'liberada' },
                })
                console.log(`Placa interna ${plateIdInternal} liberada por anulacion`)
              } else if (previousDoc.optionsplate === 'externa' && previousDoc.externalplates) {
                const plateIdExternal =
                  typeof previousDoc.externalplates === 'object'
                    ? previousDoc.externalplates.id
                    : previousDoc.externalplates
                await payload.update({
                  collection: 'externalplates',
                  id: plateIdExternal,
                  data: { status: 'liberada' },
                })
                console.log(`Placa externa ${plateIdExternal} liberada por anulacion`)
              }

              // Actualizar inventario
              if (doc.vehicle) {
                const inventoryRes = await payload.find({
                  collection: 'inventory',
                  where: { vehicle: { equals: doc.vehicle } },
                  limit: 1,
                })

                if (inventoryRes?.docs?.length > 0) {
                  await payload.update({
                    collection: 'inventory',
                    id: inventoryRes.docs[0].id,
                    data: {
                      status: 'En Stock',
                      operation: 'Compra',
                      location: doc.warehouseorigin,
                    },
                  })
                  console.log('Traslado anulado: Inventario actualizado')
                } else {
                  console.warn(`No se encontro inventario para vehiculo ${doc.vehicle}`)
                }
              }

              // Actualizar movimientos
              await payload.update({
                collection: 'movements',
                where: { relocationId: { equals: doc.id } },
                data: { status: 'cancelado' },
              })
              console.log('Traslado anulado: Movimiento actualizado a "cancelado"')
            }
            // Caso 2: Actualización en estado "en transito"
            else if (previousDoc.status === 'en tránsito' && doc.status === 'en tránsito') {
              // Cambio entre tipos de placas (interna ↔ externa)
              if (doc.optionsplate !== previousDoc.optionsplate) {
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
              // Cambio de placa del mismo tipo
              else if (doc.optionsplate === previousDoc.optionsplate) {
                // Placas internas
                const currentInternalPlateId = doc.internalplates
                  ? typeof doc.internalplates === 'object'
                    ? doc.internalplates.id
                    : doc.internalplates
                  : null
                const prevInternalPlateId = previousDoc.internalplates
                  ? typeof previousDoc.internalplates === 'object'
                    ? previousDoc.internalplates.id
                    : previousDoc.internalplates
                  : null

                if (
                  doc.optionsplate === 'interna' &&
                  currentInternalPlateId &&
                  currentInternalPlateId !== prevInternalPlateId
                ) {
                  if (prevInternalPlateId) {
                    await payload.update({
                      collection: 'internalplates',
                      id: prevInternalPlateId,
                      data: { status: 'liberada' },
                    })
                    console.log(`Placa interna anterior ${prevInternalPlateId} liberada`)
                  }
                  await payload.update({
                    collection: 'internalplates',
                    id: currentInternalPlateId,
                    data: { status: 'asignada' },
                  })
                  console.log(`Nueva placa interna ${currentInternalPlateId} asignada`)
                }

                // Placas externas
                const currentExternalPlateId = doc.externalplates
                  ? typeof doc.externalplates === 'object'
                    ? doc.externalplates.id
                    : doc.externalplates
                  : null
                const prevExternalPlateId = previousDoc.externalplates
                  ? typeof previousDoc.externalplates === 'object'
                    ? previousDoc.externalplates.id
                    : previousDoc.externalplates
                  : null

                if (
                  doc.optionsplate === 'externa' &&
                  currentExternalPlateId &&
                  currentExternalPlateId !== prevExternalPlateId
                ) {
                  if (prevExternalPlateId) {
                    await payload.update({
                      collection: 'externalplates',
                      id: prevExternalPlateId,
                      data: { status: 'liberada' },
                    })
                    console.log(`Placa externa anterior ${prevExternalPlateId} liberada`)
                  }
                  await payload.update({
                    collection: 'externalplates',
                    id: currentExternalPlateId,
                    data: { status: 'asignada' },
                  })
                  console.log(`Nueva placa externa ${currentExternalPlateId} asignada`)
                }
              }
            }
          }
        } catch (error) {
          console.error(`Error en operacion de actualizacion: ${error}`)
          throw new Error('Error completo en operacion de actualizacion. Ver logs para detalles.')
        }
      },
    ],
  },

  // hooks: {
  //   afterChange: [
  //     async ({ doc, previousDoc, req, operation, context }) => {
  //       if (context?.skipAfterChange) {
  //         return // No ejecutar el hook si skipAfterChange está activo
  //       }

  //       const { payload } = req
  //       try {
  //         // Operación de creación
  //         if (operation === 'create') {
  //           try {
  //             // 1. Obtener el almacén "En tránsito"
  //             const transitWarehouse = await payload.find({
  //               collection: 'warehouse',
  //               where: { warehousename: { equals: 'En tránsito' } },
  //               limit: 1,
  //             })

  //             if (!transitWarehouse.docs.length) {
  //               throw new Error('No se encontró el almacén "En tránsito"')
  //             }

  //             const transitWarehouseId = transitWarehouse.docs[0].id

  //             // 2. Asignar placa según optionsplate
  //             if (doc.optionsplate === 'interna' && doc.internalplates) {
  //               const plateIdInternal =
  //                 typeof doc.internalplates === 'object'
  //                   ? doc.internalplates.id
  //                   : doc.internalplates
  //               await payload.update({
  //                 collection: 'internalplates',
  //                 id: plateIdInternal,
  //                 data: { status: 'asignada' },
  //               })
  //               console.log(`Placa interna ${plateIdInternal} asignada`)
  //             } else if (doc.optionsplate === 'externa' && doc.externalplates) {
  //               const plateIdExternal =
  //                 typeof doc.externalplates === 'object'
  //                   ? doc.externalplates.id
  //                   : doc.externalplates
  //               await payload.update({
  //                 collection: 'externalplates',
  //                 id: plateIdExternal,
  //                 data: { status: 'asignada' },
  //               })
  //               console.log(`Placa externa ${plateIdExternal} asignada`)
  //             }

  //             // 3. Actualizar inventario y obtener datos
  //             let companyId = null
  //             let warehouseOriginId = null

  //             if (doc.vehicle) {
  //               const inventoryRes = await payload.find({
  //                 collection: 'inventory',
  //                 where: { vehicle: { equals: doc.vehicle } },
  //                 limit: 1,
  //                 depth: 1,
  //               })

  //               if (inventoryRes.docs.length > 0) {
  //                 const inventoryRecord = inventoryRes.docs[0]

  //                 // Actualizar estado del inventario
  //                 await payload.update({
  //                   collection: 'inventory',
  //                   id: inventoryRecord.id,
  //                   data: {
  //                     status: 'En Tránsito',
  //                     location: transitWarehouseId, // Actualizar ubicación del almacén a "En tránsito"
  //                   },
  //                 })

  //                 // Obtener company del registro de inventario
  //                 companyId =
  //                   typeof inventoryRecord.dealership === 'object'
  //                     ? inventoryRecord.dealership.id
  //                     : inventoryRecord.dealership

  //                 // Obtener ubicación actual (warehouse origin) del inventario
  //                 warehouseOriginId =
  //                   typeof inventoryRecord.location === 'object'
  //                     ? inventoryRecord.location?.id
  //                     : inventoryRecord.location

  //                 console.log(`Inventario actualizado para vehículo ${doc.vehicle}`)
  //               } else {
  //                 console.warn(`No se encontró registro de inventario para vehículo ${doc.vehicle}`)
  //               }
  //             }

  //             // 3. Actualizar el traslado con warehouseorigin
  //             await payload.update({
  //               collection: 'relocation',
  //               id: doc.id,
  //               data: {
  //                 warehouseorigin: warehouseOriginId || undefined, // Asignamos el origen desde el inventario si no es null
  //               },
  //               context: {
  //                 skipAfterChange: true, // Evitar que esta actualización dispare el hook nuevamente
  //               },
  //             })

  //             // 4. Creación de movimiento de salida
  //             await payload.create({
  //               collection: 'movements',
  //               data: {
  //                 vehicle: doc.vehicle,
  //                 company: companyId,
  //                 movementdate: doc.exitdate,
  //                 typemovement: 'salida',
  //                 motivemovement: 'Traslado vehicular a otro establecimiento',
  //                 warehouse: warehouseOriginId, // Usamos el mismo origen que el traslado
  //                 status: 'activo',
  //                 relocationId: doc.id,
  //               },
  //             })
  //             console.log('Registro de movimiento creado correctamente')
  //           } catch (error) {
  //             console.error(`Error en proceso de traslado: ${error}`)
  //             throw new Error('Error completo en operación de traslado. Ver logs para detalles.')
  //           }
  //           return
  //         }
  //       } catch (error) {
  //         console.error(`Error en operacion de creacion: ${error}`)
  //         throw new Error('Error completo en operacion de creacion. Ver logs para detalles.')
  //       }

  //       try {
  //         // Operación de actualización
  //         if (operation === 'update' && previousDoc) {
  //           // Caso 1: Cambio de estado a "anulado"
  //           if (previousDoc.status === 'en transito' && doc.status === 'anulado') {
  //             // Liberar la placa según el optionsplate anterior
  //             if (previousDoc.optionsplate === 'interna' && previousDoc.internalplates) {
  //               const plateIdInternal =
  //                 typeof previousDoc.internalplates === 'object'
  //                   ? previousDoc.internalplates.id
  //                   : previousDoc.internalplates
  //               await payload.update({
  //                 collection: 'internalplates',
  //                 id: plateIdInternal,
  //                 data: { status: 'liberada' },
  //               })
  //               console.log(`Placa interna ${plateIdInternal} liberada por anulacion`)
  //             } else if (previousDoc.optionsplate === 'externa' && previousDoc.externalplates) {
  //               const plateIdExternal =
  //                 typeof previousDoc.externalplates === 'object'
  //                   ? previousDoc.externalplates.id
  //                   : previousDoc.externalplates
  //               await payload.update({
  //                 collection: 'externalplates',
  //                 id: plateIdExternal,
  //                 data: { status: 'liberada' },
  //               })
  //               console.log(`Placa externa ${plateIdExternal} liberada por anulacion`)
  //             }

  //             // Actualizar inventario
  //             if (doc.vehicle) {
  //               const inventoryRes = await payload.find({
  //                 collection: 'inventory',
  //                 where: { vehicle: { equals: doc.vehicle } },
  //                 limit: 1,
  //               })

  //               if (inventoryRes?.docs?.length > 0) {
  //                 await payload.update({
  //                   collection: 'inventory',
  //                   id: inventoryRes.docs[0].id,
  //                   data: {
  //                     status: 'En Stock',
  //                     operation: 'Compra',
  //                     location: doc.warehouseorigin,
  //                   },
  //                 })
  //                 console.log('Traslado anulado: Inventario actualizado')
  //               } else {
  //                 console.warn(`No se encontro inventario para vehiculo ${doc.vehicle}`)
  //               }
  //             }

  //             // Actualizar movimientos
  //             await payload.update({
  //               collection: 'movements',
  //               where: { relocationId: { equals: doc.id } },
  //               data: { status: 'cancelado' },
  //             })
  //             console.log('Traslado anulado: Movimiento actualizado a "cancelado"')
  //           }
  //           // Caso 2: Actualización en estado "en transito"
  //           else if (previousDoc.status === 'en transito' && doc.status === 'en transito') {
  //             // Cambio entre tipos de placas (interna ↔ externa)
  //             if (doc.optionsplate !== previousDoc.optionsplate) {
  //               // Liberar placa anterior
  //               if (previousDoc.optionsplate === 'interna' && previousDoc.internalplates) {
  //                 const prevPlateIdInternal =
  //                   typeof previousDoc.internalplates === 'object'
  //                     ? previousDoc.internalplates.id
  //                     : previousDoc.internalplates
  //                 await payload.update({
  //                   collection: 'internalplates',
  //                   id: prevPlateIdInternal,
  //                   data: { status: 'liberada' },
  //                 })
  //                 console.log(`Placa interna ${prevPlateIdInternal} liberada por cambio de tipo`)
  //               } else if (previousDoc.optionsplate === 'externa' && previousDoc.externalplates) {
  //                 const prevPlateIdExternal =
  //                   typeof previousDoc.externalplates === 'object'
  //                     ? previousDoc.externalplates.id
  //                     : previousDoc.externalplates
  //                 await payload.update({
  //                   collection: 'externalplates',
  //                   id: prevPlateIdExternal,
  //                   data: { status: 'liberada' },
  //                 })
  //                 console.log(`Placa externa ${prevPlateIdExternal} liberada por cambio de tipo`)
  //               }

  //               // Asignar nueva placa
  //               if (doc.optionsplate === 'interna' && doc.internalplates) {
  //                 const plateIdInternal =
  //                   typeof doc.internalplates === 'object'
  //                     ? doc.internalplates.id
  //                     : doc.internalplates
  //                 await payload.update({
  //                   collection: 'internalplates',
  //                   id: plateIdInternal,
  //                   data: { status: 'asignada' },
  //                 })
  //                 console.log(`Nueva placa interna ${plateIdInternal} asignada`)
  //               } else if (doc.optionsplate === 'externa' && doc.externalplates) {
  //                 const plateIdExternal =
  //                   typeof doc.externalplates === 'object'
  //                     ? doc.externalplates.id
  //                     : doc.externalplates
  //                 await payload.update({
  //                   collection: 'externalplates',
  //                   id: plateIdExternal,
  //                   data: { status: 'asignada' },
  //                 })
  //                 console.log(`Nueva placa externa ${plateIdExternal} asignada`)
  //               }
  //             }
  //             // Cambio de placa del mismo tipo
  //             else if (doc.optionsplate === previousDoc.optionsplate) {
  //               // Placas internas
  //               const currentInternalPlateId = doc.internalplates
  //                 ? typeof doc.internalplates === 'object'
  //                   ? doc.internalplates.id
  //                   : doc.internalplates
  //                 : null
  //               const prevInternalPlateId = previousDoc.internalplates
  //                 ? typeof previousDoc.internalplates === 'object'
  //                   ? previousDoc.internalplates.id
  //                   : previousDoc.internalplates
  //                 : null

  //               if (
  //                 doc.optionsplate === 'interna' &&
  //                 currentInternalPlateId &&
  //                 currentInternalPlateId !== prevInternalPlateId
  //               ) {
  //                 if (prevInternalPlateId) {
  //                   await payload.update({
  //                     collection: 'internalplates',
  //                     id: prevInternalPlateId,
  //                     data: { status: 'liberada' },
  //                   })
  //                   console.log(`Placa interna anterior ${prevInternalPlateId} liberada`)
  //                 }
  //                 await payload.update({
  //                   collection: 'internalplates',
  //                   id: currentInternalPlateId,
  //                   data: { status: 'asignada' },
  //                 })
  //                 console.log(`Nueva placa interna ${currentInternalPlateId} asignada`)
  //               }

  //               // Placas externas
  //               const currentExternalPlateId = doc.externalplates
  //                 ? typeof doc.externalplates === 'object'
  //                   ? doc.externalplates.id
  //                   : doc.externalplates
  //                 : null
  //               const prevExternalPlateId = previousDoc.externalplates
  //                 ? typeof previousDoc.externalplates === 'object'
  //                   ? previousDoc.externalplates.id
  //                   : previousDoc.externalplates
  //                 : null

  //               if (
  //                 doc.optionsplate === 'externa' &&
  //                 currentExternalPlateId &&
  //                 currentExternalPlateId !== prevExternalPlateId
  //               ) {
  //                 if (prevExternalPlateId) {
  //                   await payload.update({
  //                     collection: 'externalplates',
  //                     id: prevExternalPlateId,
  //                     data: { status: 'liberada' },
  //                   })
  //                   console.log(`Placa externa anterior ${prevExternalPlateId} liberada`)
  //                 }
  //                 await payload.update({
  //                   collection: 'externalplates',
  //                   id: currentExternalPlateId,
  //                   data: { status: 'asignada' },
  //                 })
  //                 console.log(`Nueva placa externa ${currentExternalPlateId} asignada`)
  //               }
  //             }
  //           }
  //         }
  //       } catch (error) {
  //         console.error(`Error en operacion de actualizacion: ${error}`)
  //         throw new Error('Error completo en operacion de actualizacion. Ver logs para detalles.')
  //       }
  //     },
  //   ],
  // },
  endpoints: [
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
            collection: 'relocation',
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
              collection: 'mediarelocation',
              id: mediaId,
              req,
            })
          }

          // 5. Actualizar el documento eliminando el gasto
          const updatedDoc = await req.payload.update({
            collection: 'relocation',
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
