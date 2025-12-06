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
        // 1. Auditoría
        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }

        // 2. LÓGICA DE NEGOCIO INTERNA (Eficiencia Máxima)
        // Calculamos el estado ANTES de que el documento toque el disco.
        if (operation === 'create' && data.purchase) {
          try {
            // Leemos la compra UNA sola vez
            const purchase = await req.payload.findByID({
              collection: 'purchase',
              id: data.purchase,
              req, // Importante para compartir transacción
            })

            // A. Cálculo de Lógica Interna
            // Si el frontend no mandó nada específico, calculamos nosotros.
            if (typeof data.statuscreditnote === 'undefined') {
              data.statuscreditnote = purchase.invoice ? 'pendiente' : 'no aplicable'
            }

            // B. Optimización de rendimiento
            // Guardamos la compra en el contexto para que afterChange no tenga que leerla de nuevo.
            req.context = {
              ...req.context,
              purchaseInfo: purchase,
            }
          } catch (e) {
            console.error('Error crítico en beforeChange:', e)
            throw e // En producción, si falla la lectura crítica, mejor fallar la operación completa
          }
        }

        return data
      },
    ],

    afterChange: [
      async ({ doc, req, context, operation }) => {
        if (context.skipHook) return

        // 3. EFECTOS EXTERNOS (Side Effects)
        // Solo tocamos la colección externa. NO nos auto-actualizamos.
        if (operation === 'create') {
          // Recuperamos del contexto (Memoria RAM) en lugar de Base de Datos (Disco/Red)
          const purchase = req.context?.purchaseInfo as Purchase

          // Si por algo raro no está en contexto, abortamos (o hacemos fallback)
          if (!purchase) return

          // Guardia de seguridad
          if (
            purchase.statuspayment === 'retornado' ||
            purchase.statuspayment === 'retorno parcial'
          ) {
            return
          }

          const receiptStatus = purchase.invoice ? 'anulado' : 'cancelado'

          // ÚNICA operación de escritura adicional
          await req.payload.update({
            collection: 'purchase',
            id: doc.purchase,
            data: {
              status: 'anulado',
              statuspayment: 'por retornar',
              statusreception: 'cancelado',
              statusreceipt: receiptStatus,
            },
            context: { skipHook: true },
            req,
          })
        }
      },
    ],
  },
  // hooks: {
  //   afterChange: [
  //     async ({ doc, operation, req, context }) => {
  //       // 1. Evitar bucles infinitos
  //       if (context.skipHook) return

  //       // 2. Lógica SOLO para creación (Inicialización)
  //       // Si es un update (ej: cambias a 'registrada'), esto se ignora.
  //       if (operation === 'create' && doc.purchase) {
  //         const { payload } = req

  //         try {
  //           // A. Obtener la compra actual (con req para mantener transacción)
  //           const currentPurchase = await payload.findByID({
  //             collection: 'purchase',
  //             id: doc.purchase,
  //             req,
  //           })

  //           if (!currentPurchase) return

  //           // B. TU GUARDIA DE ROBUSTEZ 🛡️
  //           // Si por alguna razón la compra ya fue procesada/retornada, no tocamos nada.
  //           if (
  //             currentPurchase.statuspayment === 'retornado' ||
  //             currentPurchase.statuspayment === 'retorno parcial'
  //           ) {
  //             console.log(
  //               '[HOOK] Cancelación creada, pero la compra ya estaba retornada. Omitiendo cambios.',
  //             )
  //             return
  //           }

  //           // C. Calcular estados
  //           const receiptStatus = currentPurchase.invoice ? 'anulado' : 'cancelado'
  //           const creditNoteStatus = currentPurchase.invoice ? 'pendiente' : 'no aplicable'

  //           console.log(`[HOOK] Inicializando Cancelación ${doc.id} | Nota: ${creditNoteStatus}`)

  //           // D. Actualizar Purchase (compra principal)
  //           await payload.update({
  //             collection: 'purchase',
  //             id: doc.purchase,
  //             data: {
  //               status: 'anulado',
  //               statuspayment: 'por retornar',
  //               statusreception: 'cancelado',
  //               statusreceipt: receiptStatus,
  //             },
  //             context: { skipHook: true },
  //             req,
  //           })

  //           // E. Auto-actualizar PurchaseCancellation (para guardar el statuscreditnote calculado)
  //           await payload.update({
  //             collection: 'purchasecancellation',
  //             id: doc.id,
  //             data: {
  //               statuscreditnote: creditNoteStatus,
  //             },
  //             context: { skipHook: true },
  //             depth: 0,
  //             req,
  //           })
  //         } catch (error) {
  //           console.error('Error inicializando cancelación:', error)
  //         }
  //       }
  //     },
  //   ],
  // },
}
