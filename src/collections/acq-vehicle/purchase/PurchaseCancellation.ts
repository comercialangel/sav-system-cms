import { Purchase } from '@/payload-types'
import type { CollectionConfig } from 'payload'

export const PurchaseCancellation: CollectionConfig = {
  slug: 'purchasecancellation',
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
    singular: 'Cancelación de compra',
    plural: 'Cancelaciones de compras',
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
      hasMany: false,
      admin: {
        allowCreate: false,
        allowEdit: false,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'cancellationdate',
          label: 'Fecha de cancelación',
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
          name: 'motivecancellationpurchase',
          label: 'Motivo de cancelación',
          type: 'relationship',
          relationTo: 'motivecancellationpurchase',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: true,
          },
        },
      ],
    },
    {
      name: 'purchasecancellationfiles',
      label: 'Archivos',
      type: 'array',
      labels: {
        singular: 'Archivo',
        plural: 'Archivos',
      },
      required: false,
      fields: [
        {
          name: 'mediapurchasecancellation',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediapurchasecancellation',
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
      name: 'totalRefunded',
      label: 'Total devuelto',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Suma total de los reembolsos asociados a esta cancelación.',
        readOnly: false, // Para evitar ediciones manuales
        // hidden: true,
      },
    },
    {
      name: 'purchaserefund',
      label: 'Devoluciones de dinero',
      type: 'relationship',
      relationTo: 'purchaserefund',
      hasMany: true,
      index: true,
      //maxDepth: 3,
      admin: {
        description: 'Devoluciones asociadas a esta cancelación.',
        //readOnly: false, // Añade esto para hacer el campo de solo lectura en la interfaz de administración
        // hidden: true,
      },
    },
    {
      name: 'statuscreditnote',
      label: 'Estado de nota de crédito',
      type: 'select',
      required: true,
      admin: {
        position: 'sidebar',
      },
      options: [
        {
          label: 'Pendiente',
          value: 'pendiente',
        },
        {
          label: 'No aplicable',
          value: 'no aplicable',
        },
        {
          label: 'Registrada',
          value: 'registrada',
        },
      ],
      defaultValue: 'no aplicable',
    },
    {
      type: 'relationship',
      name: 'createdBy',
      label: 'Creado por',
      relationTo: 'users',
      maxDepth: 0,
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
      maxDepth: 0,
      admin: {
        readOnly: true,
        position: 'sidebar',
        allowEdit: false,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        const { user, payload } = req

        // 1. Auditoría (Create/Update)
        if (user) {
          if (operation === 'create') {
            data.createdBy = user.id
          }
          data.updatedBy = user.id
        }

        // 2. Lógica de Inicialización (SOLO CREATE)
        // Solo calculamos el estado inicial cuando nace el registro.
        if (operation === 'create' && data.purchase) {
          try {
            const purchase = await payload.findByID({
              collection: 'purchase',
              id: data.purchase,
              req,
            })

            // Si es create, calculamos el estado inicial automático
            const creditNoteStatus = purchase.invoice ? 'pendiente' : 'no aplicable'
            data.statuscreditnote = creditNoteStatus

            // Guardamos en contexto para usarlo en afterChange sin buscar de nuevo
            req.context = { ...req.context, purchaseInfo: purchase }
          } catch (e) {
            console.log('Error obteniendo compra en beforeChange', e)
          }
        }

        return data
      },
    ],

    afterChange: [
      async ({ doc, req, context, operation }) => {
        if (context.skipHook) return

        // 3. Sincronización con Compra (SOLO CREATE)
        // Esto evita que al editar la cancelación (Paso 3) se reseteen los estados de la compra.
        if (operation === 'create') {
          let purchase = req.context?.purchaseInfo as Purchase

          // Fallback por si no vino del contexto
          if (!purchase && doc.purchase) {
            try {
              purchase = await req.payload.findByID({
                collection: 'purchase',
                id: doc.purchase,
                req,
              })
            } catch (e) {
              console.error(e)
            }
          }

          if (purchase) {
            const receiptStatus = purchase.invoice ? 'anulado' : 'cancelado'

            // Inicializamos la compra como "por retornar".
            // Como esto solo pasa en CREATE, nunca sobrescribirá un "retornado" futuro.
            await req.payload.update({
              collection: 'purchase',
              id: doc.purchase,
              data: {
                status: 'anulado',
                statuspayment: 'por retornar',
                statusreception: 'cancelado',
                statusreceipt: receiptStatus,
                cancellation: doc.id,
              },
              context: { skipHook: true },
              req,
            })
          }
        }
      },
    ],
  },
  // hooks: {
  //   beforeChange: [
  //     async ({ req, data, operation }) => {
  //       const { user, payload } = req
  //       if (user) {
  //         if (operation === 'create') {
  //           data.createdBy = user.id
  //         }
  //         data.updatedBy = user.id
  //       }
  //       if (operation === 'create' && data.purchase) {
  //         const isManualStatusUpdate = typeof data.statuscreditnote !== 'undefined'

  //         if (!isManualStatusUpdate || operation === 'create') {
  //           try {
  //             const purchase = await payload.findByID({
  //               collection: 'purchase',
  //               id: data.purchase,
  //               req,
  //             })

  //             // Solo calculamos si NO viene un dato manual
  //             if (!isManualStatusUpdate) {
  //               const creditNoteStatus = purchase.invoice ? 'pendiente' : 'no aplicable'
  //               data.statuscreditnote = creditNoteStatus
  //             }

  //             // Guardamos en contexto para afterChange
  //             req.context = { ...req.context, purchaseInfo: purchase }
  //           } catch (e) {
  //             console.log('Error obteniendo compra en beforeChange', e)
  //           }
  //         }
  //       }
  //       return data
  //     },
  //   ],

  //   afterChange: [
  //     async ({ doc, req, context }) => {
  //       if (context.skipHook) return

  //       if (doc.statuscreditnote === 'registrada') {
  //         return
  //       }

  //       // Recuperamos la info que guardamos en beforeChange o la buscamos de nuevo
  //       let purchase = req.context?.purchaseInfo as Purchase

  //       if (!purchase && doc.purchase) {
  //         purchase = await req.payload.findByID({
  //           collection: 'purchase',
  //           id: doc.purchase,
  //           req,
  //         })
  //       }

  //       if (purchase) {
  //         if (
  //           purchase.statuspayment === 'retornado' ||
  //           purchase.statuspayment === 'retorno parcial'
  //         ) {
  //           return
  //         }

  //         const receiptStatus = purchase.invoice ? 'anulado' : 'cancelado'

  //         // Solo actualizamos la OTRA colección
  //         await req.payload.update({
  //           collection: 'purchase',
  //           id: doc.purchase,
  //           data: {
  //             status: 'anulado',
  //             statuspayment: 'por retornar',
  //             statusreception: 'cancelado',
  //             statusreceipt: receiptStatus,
  //             cancellation: doc.id,
  //           },
  //           context: { skipHook: true },
  //           req, // Siempre pasar req
  //         })
  //       }
  //     },
  //   ],
  // },
}
