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
      type: 'join',
      collection: 'purchaserefund',
      on: 'purchasecancellation',
      hasMany: true,
      maxDepth: 2,
      admin: {
        description: 'Devoluciones asociadas a esta cancelación.',
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
        // ... (Tu lógica de auditoría y cálculo de statuscreditnote se mantiene IGUAL) ...
        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }

        if (operation === 'create' && data.purchase) {
          try {
            const purchase = (await req.payload.findByID({
              collection: 'purchase',
              id: data.purchase,
              req,
            })) as unknown as Purchase

            if (typeof data.statuscreditnote === 'undefined') {
              data.statuscreditnote = purchase.invoice ? 'pendiente' : 'no aplicable'
            }

            req.context = {
              ...req.context,
              purchaseInfo: purchase,
            }
          } catch (e) {
            console.error('Error crítico en beforeChange:', e)
            throw e
          }
        }
        return data
      },
    ],

    afterChange: [
      async ({ doc, req, context, operation }) => {
        if (context.skipHook) return

        if (operation === 'create') {
          // Recuperamos del contexto
          const purchase = req.context?.purchaseInfo as Purchase

          if (!purchase) return

          // Guardia de seguridad (si ya se retornó dinero)
          if (
            purchase.statuspayment === 'retornado' ||
            purchase.statuspayment === 'retorno parcial'
          ) {
            return
          }

          // === LÓGICA CORREGIDA ===
          // Antes: const receiptStatus = purchase.invoice ? 'anulado' : 'cancelado'

          // Ahora: Depende del estado ACTUAL del comprobante en la compra
          let newReceiptStatus: typeof purchase.statusreceipt = 'cancelado' // Valor por defecto (para 'pendiente', 'cancelado', etc.)

          // Solo si YA fue 'recibido', lo pasamos a 'anulado'
          if (purchase.statusreceipt === 'recibido') {
            newReceiptStatus = 'anulado'
          }

          // Actualizamos la compra
          await req.payload.update({
            collection: 'purchase',
            id: doc.purchase,
            data: {
              status: 'anulado',
              statuspayment: 'por retornar',
              statusreception: 'cancelado',
              statusreceipt: newReceiptStatus, // <--- Usamos la nueva variable
            },
            context: { skipHook: true },
            req,
          })
        }
      },
    ],
  },

  // hooks: {
  //   beforeChange: [
  //     async ({ req, data, operation }) => {
  //       // 1. Auditoría
  //       if (req.user) {
  //         if (operation === 'create') data.createdBy = req.user.id
  //         data.updatedBy = req.user.id
  //       }

  //       // 2. LÓGICA DE NEGOCIO INTERNA (Eficiencia Máxima)
  //       // Calculamos el estado ANTES de que el documento toque el disco.
  //       if (operation === 'create' && data.purchase) {
  //         try {
  //           // Leemos la compra UNA sola vez
  //           const purchase = await req.payload.findByID({
  //             collection: 'purchase',
  //             id: data.purchase,
  //             req, // Importante para compartir transacción
  //           })

  //           // A. Cálculo de Lógica Interna
  //           // Si el frontend no mandó nada específico, calculamos nosotros.
  //           if (typeof data.statuscreditnote === 'undefined') {
  //             data.statuscreditnote = purchase.invoice ? 'pendiente' : 'no aplicable'
  //           }

  //           // B. Optimización de rendimiento
  //           // Guardamos la compra en el contexto para que afterChange no tenga que leerla de nuevo.
  //           req.context = {
  //             ...req.context,
  //             purchaseInfo: purchase,
  //           }
  //         } catch (e) {
  //           console.error('Error crítico en beforeChange:', e)
  //           throw e // En producción, si falla la lectura crítica, mejor fallar la operación completa
  //         }
  //       }

  //       return data
  //     },
  //   ],

  //   afterChange: [
  //     async ({ doc, req, context, operation }) => {
  //       if (context.skipHook) return

  //       // 3. EFECTOS EXTERNOS (Side Effects)
  //       // Solo tocamos la colección externa. NO nos auto-actualizamos.
  //       if (operation === 'create') {
  //         // Recuperamos del contexto (Memoria RAM) en lugar de Base de Datos (Disco/Red)
  //         const purchase = req.context?.purchaseInfo as Purchase

  //         // Si por algo raro no está en contexto, abortamos (o hacemos fallback)
  //         if (!purchase) return

  //         // Guardia de seguridad
  //         if (
  //           purchase.statuspayment === 'retornado' ||
  //           purchase.statuspayment === 'retorno parcial'
  //         ) {
  //           return
  //         }

  //         const receiptStatus = purchase.invoice ? 'anulado' : 'cancelado'

  //         // ÚNICA operación de escritura adicional
  //         await req.payload.update({
  //           collection: 'purchase',
  //           id: doc.purchase,
  //           data: {
  //             status: 'anulado',
  //             statuspayment: 'por retornar',
  //             statusreception: 'cancelado',
  //             statusreceipt: receiptStatus,
  //           },
  //           context: { skipHook: true },
  //           req,
  //         })
  //       }
  //     },
  //   ],
  // },
}
