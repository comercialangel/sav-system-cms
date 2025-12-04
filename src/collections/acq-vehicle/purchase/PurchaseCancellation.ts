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
        // readOnly: false, // Añade esto para hacer el campo de solo lectura en la interfaz de administración
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
        if (user) {
          if (operation === 'create') {
            data.createdBy = user.id
          }
          data.updatedBy = user.id
        }
        if ((operation === 'create' || operation === 'update') && data.purchase) {
          const isManualStatusUpdate = typeof data.statuscreditnote !== 'undefined'

          if (!isManualStatusUpdate || operation === 'create') {
            try {
              const purchase = await payload.findByID({
                collection: 'purchase',
                id: data.purchase,
                req,
              })

              // Solo calculamos si NO viene un dato manual
              if (!isManualStatusUpdate) {
                const creditNoteStatus = purchase.invoice ? 'pendiente' : 'no aplicable'
                data.statuscreditnote = creditNoteStatus
              }

              // Guardamos en contexto para afterChange
              req.context = { ...req.context, purchaseInfo: purchase }
            } catch (e) {
              console.log('Error obteniendo compra en beforeChange', e)
            }
          }
          // const purchase = await payload.findByID({
          //   collection: 'purchase',
          //   id: data.purchase,
          //   req,
          // })

          // //modificamos 'data' directamente
          // const creditNoteStatus = purchase.invoice ? 'pendiente' : 'no aplicable'
          // data.statuscreditnote = creditNoteStatus

          // //guardamos la información de la compra en el request para usarla en afterchange
          // req.context = { ...req.context, purchaseInfo: purchase }

          // try {
          // } catch (e) {
          //   console.log('Error actualizando cancelación', e)
          // }
        }
        return data
      },
    ],

    afterChange: [
      async ({ doc, req, context }) => {
        if (context.skipHook) return

        if (doc.statuscreditnote === 'registrada') {
          return
        }

        // Recuperamos la info que guardamos en beforeChange o la buscamos de nuevo
        let purchase = req.context?.purchaseInfo as Purchase

        if (!purchase && doc.purchase) {
          purchase = await req.payload.findByID({
            collection: 'purchase',
            id: doc.purchase,
            req,
          })
        }

        if (purchase) {
          if (
            purchase.statuspayment === 'retornado' ||
            purchase.statuspayment === 'retorno parcial'
          ) {
            return
          }

          const receiptStatus = purchase.invoice ? 'anulado' : 'cancelado'

          // Solo actualizamos la OTRA colección
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
            req, // Siempre pasar req
          })
        }
      },
    ],

    // afterChange: [
    //   async ({ doc, operation, req, context }) => {
    //     // Evitar bucle si ya estamos en una ejecución de hook
    //     if (context.skipHook) return

    //     if (doc.statuscreditnote === 'registrada') {
    //       return
    //     }

    //     const { payload } = req

    //     if ((operation === 'create' || operation === 'update') && doc.purchase) {
    //       try {
    //         // 1. Obtener compra actual
    //         const currentPurchase = await payload.findByID({
    //           collection: 'purchase',
    //           id: doc.purchase,
    //           depth: 0,
    //         })

    //         console.log('Datos compra:', {
    //           // Debug 2
    //           invoice: currentPurchase.invoice,
    //           status: currentPurchase.status,
    //         })

    //         // 2. Determinar estados
    //         const receiptStatus = currentPurchase.invoice ? 'anulado' : 'cancelado'
    //         const creditNoteStatus = currentPurchase.invoice ? 'pendiente' : 'no aplicable'

    //         // 3. Actualizar Purchase (compra principal)
    //         await payload.update({
    //           collection: 'purchase',
    //           id: doc.purchase,
    //           data: {
    //             status: 'anulado',
    //             statuspayment: 'por retornar',
    //             statusreception: 'cancelado',
    //             statusreceipt: receiptStatus,
    //             cancellation: doc.id,
    //           },
    //           context: { skipHook: true }, // Evita hooks en Purchase
    //         })

    //         console.log('Compra anulada correctamente') // Debug 4

    //         // 4. Actualizar PurchaseCancellation (esta misma colección)
    //         await payload.update({
    //           collection: 'purchasecancellation',
    //           id: doc.id,
    //           data: {
    //             statuscreditnote: creditNoteStatus,
    //           },
    //           context: { skipHook: true }, // ¡IMPORTANTE! Evita bucle
    //           depth: 0,
    //         })

    //         console.log('Proceso completado:', {
    //           // Debug final
    //           compra: doc.purchase,
    //           cancelacion: doc.id,
    //           statuscreditnote: creditNoteStatus,
    //         })
    //         return doc
    //       } catch (error) {
    //         console.error('Error crítico:', {
    //           message: error,
    //           stack: error,
    //           operation,
    //           docId: doc.id,
    //         })
    //         throw error // Propaga el error para manejo superior
    //       }
    //     }
    //   },
    // ],
  },
}
