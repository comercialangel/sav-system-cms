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
    // En PurchaseCancellation.ts
    afterChange: [
      async ({ doc, req, context, operation }) => {
        if (context.skipHook) return
        if (operation === 'update') return // Solo actuamos al crear
        if (doc.statuscreditnote === 'registrada') return

        // Solo lógica de CREATE
        if (operation === 'create' && doc.purchase) {
          try {
            const purchase = await req.payload.findByID({
              collection: 'purchase',
              id: doc.purchase,
              req,
            })

            if (!purchase) return

            // Validación de seguridad (Paso 2)
            if (
              purchase.statuspayment === 'retornado' ||
              purchase.statuspayment === 'retorno parcial'
            ) {
              return
            }

            const receiptStatus = purchase.invoice ? 'anulado' : 'cancelado'

            // ACTUALIZAMOS SOLO ESTADOS
            // YA NO pasamos 'cancellation: doc.id' porque el campo 'join' lo resuelve solo.
            await req.payload.update({
              collection: 'purchase',
              id: doc.purchase,
              data: {
                status: 'anulado',
                statuspayment: 'por retornar', // Inicialización de estado
                statusreception: 'cancelado',
                statusreceipt: receiptStatus,
                // cancellation: doc.id <--- ESTA LÍNEA SE BORRA, YA NO ES NECESARIA
              },
              context: { skipHook: true },
              req,
            })
          } catch (e) {
            console.error('Error en afterChange:', e)
          }
        }
      },
    ],
  },
}
