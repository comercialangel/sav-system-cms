import type { CollectionConfig, PayloadRequest } from 'payload'

export const PurchaseRefund: CollectionConfig = {
  slug: 'purchaserefund',
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
    singular: 'Retorno de dinero de compra',
    plural: 'Retornos de dinero de compras',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'purchasecancellation',
          label: 'Cancelación de compra',
          type: 'relationship',
          relationTo: 'purchasecancellation',
          required: true,
          hasMany: false,
          index: true,
          maxDepth: 0,
          admin: {
            width: '50%',
            allowCreate: false,
            allowEdit: false,
          },
        },
        {
          name: 'refunddate',
          label: 'Fecha de devolución',
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
          name: 'refundamount',
          label: 'Monto devuelto',
          type: 'number',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'typepayment',
          label: 'Método de devolución',
          type: 'relationship',
          relationTo: 'typepayment',
          required: true,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
            allowEdit: false,
          },
        },
      ],
    },
    {
      name: 'purchaserefundfiles',
      label: 'Archivos de devolución',
      type: 'array',
      labels: {
        singular: 'Archivo',
        plural: 'Archivos',
      },
      required: false,
      fields: [
        {
          name: 'mediapurchaserefund',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediapurchaserefund',
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
      async ({ req: { user }, data, operation }) => {
        if (user) {
          if (operation === 'create') data.createdBy = user.id
          data.updatedBy = user.id
        }
        return data
      },
    ],

    // UNIFICAMOS LÓGICA: CREATE Y UPDATE
    afterChange: [
      async ({ doc, req, operation }) => {
        // Solo recalcular si cambió el monto o la cancelación asociada
        if (operation === 'create' || operation === 'update') {
          await recalculateRefunds({
            req,
            cancellationId: doc.purchasecancellation,
            // En update/create, el documento YA está en la base de datos con el nuevo valor
          })
        }
      },
    ],

    // LÓGICA DE DELETE
    afterDelete: [
      async ({ doc, req }) => {
        // Manejo seguro del ID
        const cancellationId =
          typeof doc.purchasecancellation === 'object'
            ? doc.purchasecancellation.id
            : doc.purchasecancellation

        await recalculateRefunds({
          req,
          cancellationId,
          // En afterDelete, el documento YA NO está en la base de datos,
          // así que la suma de lo que queda será correcta.
        })
      },
    ],
  },
}

// Esta función hace todo el trabajo para Create, Update y Delete
async function recalculateRefunds({
  req,
  cancellationId,
}: {
  req: PayloadRequest
  cancellationId?: string | number
}) {
  const { payload } = req

  if (!cancellationId) return

  try {
    // 1. Obtener la Cancelación
    const cancellation = await payload.findByID({
      collection: 'purchasecancellation',
      id: cancellationId,
      depth: 0,
      req,
    })

    if (!cancellation) return

    // 2. Obtener TODOS los reembolsos vivos de esta cancelación
    const allRefunds = await payload.find({
      collection: 'purchaserefund',
      where: {
        purchasecancellation: { equals: cancellationId },
      },
      limit: 0, // Traer todos
      req,
    })

    // 3. Calcular Total Real (Sumando desde cero)
    const totalRefunded = allRefunds.docs.reduce((acc, refund) => {
      return acc + (Number(refund.refundamount) || 0)
    }, 0)

    // 4. Actualizar la Cancelación (Total Devuelto)
    await payload.update({
      collection: 'purchasecancellation',
      id: cancellationId,
      data: {
        totalRefunded,
      },
      req,
    })

    // 5. Obtener la Compra para comparar
    const purchaseId =
      typeof cancellation.purchase === 'object' ? cancellation.purchase.id : cancellation.purchase

    const purchase = await payload.findByID({
      collection: 'purchase',
      id: purchaseId,
      depth: 0,
      req,
    })

    if (!purchase) return

    // 6. Determinar el Estado de Pago
    const amountPaid = Number(purchase.amountpaid || 0)
    let newStatus = purchase.statuspayment

    // Tolerancia de 0.01 para evitar errores de redondeo
    if (totalRefunded >= amountPaid) {
      newStatus = 'retornado'
    } else if (totalRefunded > 0) {
      newStatus = 'retorno parcial'
    } else {
      newStatus = 'por retornar'
    }

    // 7. Actualizar la Compra (Solo si el estado cambió)
    if (newStatus !== purchase.statuspayment) {
      console.log(`[REFUND] Actualizando compra a: ${newStatus} (Total Devuelto: ${totalRefunded})`)

      await payload.update({
        collection: 'purchase',
        id: purchaseId,
        data: {
          statuspayment: newStatus,
        },
        req,
      })
    }
  } catch (error) {
    console.error('Error recalculando reembolsos:', error)
  }
}
