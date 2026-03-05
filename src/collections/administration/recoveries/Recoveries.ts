// src/collections/Recoveries.ts
import type { CollectionConfig } from 'payload'

export const Recoveries: CollectionConfig = {
  slug: 'recoveries',
  labels: { singular: 'Recuperación', plural: 'Recuperaciones' },
  admin: {
    group: 'Post-Venta y Legales',
  },
  fields: [
    // 1. Vinculación al Pasado
    {
      name: 'originalSale',
      type: 'relationship',
      relationTo: 'finalsale', // Tu colección de ventas históricas
      required: true,
      hasMany: false,
    },
    // 2. Estado del Proceso Legal
    {
      name: 'status',
      type: 'select',
      options: [
        // --- Fase 1: Búsqueda ---
        { label: 'Orden de Captura Emitida', value: 'seizure_order' },

        // --- Fase 2: Captura ---
        { label: 'Vehículo en Patio (En Custodia)', value: 'in_custody' },

        // --- Fase 3: Desición (Via A - El cliente paga) ---
        { label: 'Liberación Autorizada (Esperando Pago)', value: 'release_authorized' },
        { label: 'Devuelto al Cliente (Cerrado)', value: 'returned_to_customer' },

        // --- Fase 4: Decisión (Via B - El cliente pierde el vehículo) ---
        { label: 'Adjudicado a la Empresa (Cerrado)', value: 'adjudicated' },
      ],
      defaultValue: 'seizure_order',
      admin: { position: 'sidebar' },
    },

    // 3. Documentos de captura
    {
      name: 'seizureDetails',
      type: 'group',
      label: 'Detalles de Orden de Captura',
      fields: [
        {
          name: 'judicialOrder',
          type: 'upload',
          relationTo: 'mediajudicialorder', // O 'mediasale' dependiendo de tu colección de archivos
          label: 'Orden Judicial / Resolución',
        },
        {
          name: 'issueDate',
          type: 'date',
          label: 'Fecha de Emisión de la Orden',
        },
        {
          name: 'entity',
          type: 'text',
          label: 'Entidad que emite (Juzgado, PNP, etc.)',
        },
      ],
    },

    // 3.5 Detalles de Custodia Física
    {
      name: 'custodyDetails',
      type: 'group',
      label: 'Detalles de Retención Física',
      admin: {
        // Se muestra solo si el auto ya fue capturado o está en un paso posterior
        condition: (data) =>
          ['in_custody', 'release_authorized', 'returned_to_customer', 'adjudicated'].includes(
            data.status,
          ),
      },
      fields: [
        {
          name: 'warehouse',
          type: 'relationship',
          relationTo: 'warehouse',
          label: 'Almacén / Cochera de Retención',
          required: true,
          admin: {
            description:
              'Lugar físico donde se encuentra guardado el vehículo mientras se resuelve el caso.',
          },
        },
        {
          name: 'entryDate',
          type: 'date',
          label: 'Fecha y Hora de Ingreso',
          required: true,
        },
        {
          name: 'custodyNotes',
          type: 'textarea',
          label: 'Notas de Ingreso',
          admin: {
            description: 'Ej: Llegó en grúa, con llanta baja, falta radio, etc.',
          },
        },
      ],
    },

    // 4. Detalles de Devolución (Solo si se devuelve al cliente)
    // Se debe registrar la evidencia de que pagó y el acta de entrega
    {
      name: 'redemptionDetails',
      type: 'group',
      admin: {
        condition: (data) => data.status === 'returned_to_customer',
      },
      fields: [
        {
          name: 'paymentProof',
          type: 'text',
          label: 'Referencia de Pago/Liquidación',
          required: true,
        },
        {
          name: 'releaseDate',
          type: 'date',
          label: 'Fecha de Entrega al Cliente',
          required: true,
        },
        {
          name: 'releaseDocument', // El acta firmada donde recibe el auto conforme
          type: 'upload',
          relationTo: 'mediareleasedocument',
          label: 'Acta de Entrega Firmada',
        },
      ],
    },

    // 4.1 Costos del Proceso (Se registra para tener un histórico de cuánto nos cuesta cada recuperación, aunque el cliente no pague todo o nada)
    {
      name: 'recoveryCosts',
      type: 'array',
      admin: {
        description: 'El cliente debe reembolsar los gastos operativos de la recuperación.',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          options: ['Abogado', 'Traslado', 'Almacén/Cochera', 'Reparaciones Mínimas'],
        },
        { name: 'amount', type: 'number' },
        { name: 'date', type: 'date' },
      ],
    },

    // 5. Valorización de Reingreso (Tasación)
    {
      name: 'appraisalValue',
      type: 'number',
      label: 'Valor de Tasación Actual',
      admin: {
        description: 'Cuánto vale el auto en el estado en que se recuperó.',
      },
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data, req, originalDoc, operation }) => {
        //CANDADO MAESTRO: Validar que no haya deuda antes de devolver el auto
        if (
          operation === 'update' &&
          data.status === 'returned_to_customer' &&
          originalDoc?.status !== 'returned_to_customer'
        ) {
          const { payload } = req

          // 1. Obtener la venta original
          const saleId =
            typeof data.originalSale === 'object' ? data.originalSale?.id : data.originalSale
          if (!saleId) return data

          const sale = await payload.findByID({
            collection: 'finalsale',
            id: saleId,
            req,
          })

          const planId = typeof sale.creditPlan === 'object' ? sale.creditPlan?.id : sale.creditPlan

          if (planId) {
            const plan = await payload.findByID({
              collection: 'creditplan',
              id: planId,
              req,
            })

            // 2. Validación estricta: Solo se devuelve si el crédito está sano
            const blockedStates = ['moroso', 'en_recuperacion']
            if (blockedStates.includes(plan.status || '')) {
              throw new Error(
                `Operación denegada: El cliente aún tiene deudas (Estado del crédito: ${plan.status}). El cliente debe pasar por caja a cancelar sus cuotas atrasadas antes de poder registrar la devolución del vehículo.`,
              )
            }
          }
        }
        return data
      },
    ],

    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        // SINCRONIZADOR DE ESTADOS: Congelar / Descongelar el crédito
        if (operation === 'update' && doc.status !== previousDoc?.status) {
          const { payload } = req

          const saleId =
            typeof doc.originalSale === 'object' ? doc.originalSale?.id : doc.originalSale
          if (!saleId) return doc

          const sale = await payload.findByID({
            collection: 'finalsale',
            id: saleId,
            req,
          })

          const planId = typeof sale.creditPlan === 'object' ? sale.creditPlan?.id : sale.creditPlan
          if (!planId) return doc

          //Escenario A: El auto entra al patio FÍSICAMENTE (Congelar Deuda)
          if (doc.status === 'in_custody' && previousDoc?.status !== 'in_custody') {
            await payload.update({
              collection: 'creditplan',
              id: planId,
              data: { status: 'en_recuperacion' },
              req,
            })
          }
          //Escenario B: Abogado autoriza el pago (Descongelar Deuda para la Caja)
          else if (
            doc.status === 'release_authorized' &&
            previousDoc?.status !== 'release_authorized'
          ) {
            await payload.update({
              collection: 'creditplan',
              id: planId,
              data: { status: 'moroso' },
              req,
            })
          }
        }
        return doc
      },
    ],
  },
}
