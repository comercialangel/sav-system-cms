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
        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }

        if (operation === 'create' && data.purchase) {
          try {
            // A. Normalizar ID
            const purchaseId = typeof data.purchase === 'object' ? data.purchase.id : data.purchase

            // B. BUSCAR LA COMPRA CON PROFUNDIDAD (La Optimización)
            const purchase = (await req.payload.findByID({
              collection: 'purchase',
              id: purchaseId,
              depth: 1, // <--- CRÍTICO: Esto puebla el campo 'invoice' (el join)
              req,
            })) as unknown as Purchase

            // C. Detección de Invoice DIRECTA (Sin segunda consulta)
            // Payload v3 devuelve los joins como { docs: [...] } cuando están poblados
            let hasInvoice = false

            if (purchase.invoice && typeof purchase.invoice === 'object') {
              // Verificamos si 'docs' existe y tiene elementos
              if ('docs' in purchase.invoice && Array.isArray(purchase.invoice.docs)) {
                hasInvoice = purchase.invoice.docs.length > 0
              }
            }

            console.log(`[OPTIMIZADO] Leyendo join invoice... Tiene Docs? ${hasInvoice}`)

            // D. Calcular estado
            if (data.statuscreditnote !== 'registrada') {
              data.statuscreditnote = hasInvoice ? 'pendiente' : 'no aplicable'
            }

            // E. Guardar en contexto
            req.context = {
              ...req.context,
              purchaseInfo: purchase,
              hasInvoice: hasInvoice,
            }
          } catch (e) {
            console.error('Error crítico en beforeChange:', e)
            throw e
          }
        }
        return data
      },
    ],

    // beforeChange: [
    //   async ({ req, data, operation }) => {
    //     // ... (Auditoría igual) ...

    //     if (operation === 'create' && data.purchase) {
    //       try {
    //         // A. Normalizar ID
    //         const purchaseId = typeof data.purchase === 'object' ? data.purchase.id : data.purchase

    //         // B. Buscar la compra
    //         const purchase = (await req.payload.findByID({
    //           collection: 'purchase',
    //           id: purchaseId,
    //           req,
    //         })) as unknown as Purchase

    //         // C. Detección de Invoice (A PRUEBA DE BALAS)
    //         // Usamos 'any' temporalmente para manejar la flexibilidad de tu respuesta
    //         const invoiceCheck = (await req.payload.find({
    //           collection: 'purchaseinvoice',
    //           where: { purchase: { equals: purchaseId } },
    //           limit: 1,
    //           depth: 0,
    //           req,
    //         })) as any

    //         // LÓGICA HÍBRIDA:
    //         // 1. Caso Estándar: Viene un array en 'docs'
    //         // 2. Tu Caso: Viene el objeto directo con un 'id'
    //         let hasInvoice = false

    //         if (invoiceCheck.docs && Array.isArray(invoiceCheck.docs)) {
    //           hasInvoice = invoiceCheck.docs.length > 0
    //         } else if (invoiceCheck.id) {
    //           hasInvoice = true
    //         }

    //         console.log(`[DEBUG] Invoice encontrado? ${hasInvoice}`)

    //         // D. Calcular estado
    //         if (typeof data.statuscreditnote === 'undefined') {
    //           data.statuscreditnote = hasInvoice ? 'pendiente' : 'no aplicable'
    //         }

    //         // E. Contexto
    //         req.context = {
    //           ...req.context,
    //           purchaseInfo: purchase,
    //           hasInvoice: hasInvoice,
    //         }
    //       } catch (e) {
    //         console.error('Error crítico en beforeChange:', e)
    //         throw e
    //       }
    //     }
    //     return data
    //   },
    // ],
    afterChange: [
      async ({ doc, req, context, operation }) => {
        if (context.skipHook) return

        if (operation === 'create') {
          const purchase = req.context?.purchaseInfo as Purchase
          if (!purchase) return

          // Seguridad: Si ya se pagó y retornó, no tocar.
          // En tu JSON amountpaid es 0, así que esto no bloqueará.
          if (
            purchase.statuspayment === 'retornado' ||
            purchase.statuspayment === 'retorno parcial'
          ) {
            return
          }

          // === LÓGICA DE ESTADO DEL COMPROBANTE ===
          // Tu caso actual: statusreceipt es "pendiente".

          let newReceiptStatus: Purchase['statusreceipt'] = 'cancelado' // Valor por defecto

          // Solo si YA fue 'recibido', lo pasamos a 'anulado'
          if (purchase.statusreceipt === 'recibido') {
            newReceiptStatus = 'anulado'
          }

          // Actualizamos la compra
          console.log(`[CANCELACIÓN] Actualizando Compra ${doc.purchase}...`)

          await req.payload.update({
            collection: 'purchase',
            id: doc.purchase,
            data: {
              status: 'anulado',
              statuspayment: 'por retornar',
              statusreception: 'cancelado',
              statusreceipt: newReceiptStatus,
            },
            context: { skipHook: true },
            req,
          })
        }
      },
    ],
  },
}
