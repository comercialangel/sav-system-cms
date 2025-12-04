import type { CollectionConfig } from 'payload'

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
      async ({ req: { user }, data, originalDoc }) => {
        if (user) {
          if (!originalDoc.createdBy) {
            data.createdBy = user.id
          }
          data.updatedBy = user.id
        }
        return data
      },
    ],
    afterChange: [
      async ({ operation, doc, req }) => {
        const { payload } = req

        try {
          if (operation === 'create' || operation === 'update') {
            // 1. Obtener la cancelación asociada
            const cancellation = await payload.findByID({
              collection: 'purchasecancellation',
              id: doc.purchasecancellation,
              depth: 0,
            })

            if (!cancellation) {
              throw new Error('Cancelación no encontrada')
            }

            // 2. Obtener la compra relacionada
            const purchaseId =
              payload.db.defaultIDType === 'number'
                ? Number(cancellation.purchase)
                : String(cancellation.purchase)

            const purchase = await payload.findByID({
              collection: 'purchase',
              id: purchaseId,
              depth: 0,
            })

            if (operation === 'create') {
              // Lógica para creación
              const newTotalRefunded =
                (Number(cancellation.totalRefunded) || 0) + Number(doc.refundamount)

              // Actualizar cancelación
              await payload.update({
                collection: 'purchasecancellation',
                id: cancellation.id,
                data: {
                  totalRefunded: newTotalRefunded,
                  purchaserefund: [...(cancellation.purchaserefund || []), doc.id],
                },
              })

              // Determinar nuevo estado
              let newStatus: typeof purchase.statuspayment
              if (newTotalRefunded >= Number(purchase.amountpaid || 0)) {
                newStatus = 'retornado'
              } else if (newTotalRefunded > 0) {
                newStatus = 'retorno parcial'
              } else {
                newStatus = 'por retornar'
              }

              // Actualizar compra
              await payload.update({
                collection: 'purchase',
                id: purchaseId,
                data: {
                  statuspayment: newStatus,
                },
              })
            } else if (operation === 'update') {
              // Lógica para actualización - RECALCULAR TODO DESDE CERO
              const allRefunds = await payload.find({
                collection: 'purchaserefund',
                where: {
                  purchasecancellation: { equals: doc.purchasecancellation },
                },
                depth: 0,
              })

              const totalRefunded = allRefunds.docs.reduce((acc, refund) => {
                return acc + (Number(refund.refundamount) || 0)
              }, 0)

              // Actualizar cancelación
              await payload.update({
                collection: 'purchasecancellation',
                id: cancellation.id,
                data: {
                  totalRefunded,
                },
              })

              // Determinar nuevo estado
              let newStatus: typeof purchase.statuspayment
              if (totalRefunded >= Number(purchase.amountpaid || 0)) {
                newStatus = 'retornado'
              } else if (totalRefunded > 0) {
                newStatus = 'retorno parcial'
              } else {
                newStatus = 'por retornar'
              }

              // Actualizar compra
              await payload.update({
                collection: 'purchase',
                id: purchaseId,
                data: {
                  statuspayment: newStatus,
                },
              })
            }
          }
        } catch (error) {
          console.error('Error en afterChange:', error)
          throw error
        }
      },
    ],

    afterDelete: [
      async ({ doc, req }) => {
        const { payload } = req

        try {
          // 1. Obtener cancelación asociada
          const cancellationId =
            typeof doc.purchasecancellation === 'object'
              ? doc.purchasecancellation.id
              : doc.purchasecancellation

          const cancellation = await payload.findByID({
            collection: 'purchasecancellation',
            id: cancellationId,
            depth: 0,
          })

          if (!cancellation) {
            throw new Error('Cancelación no encontrada')
          }

          // 2. Recalcular total devuelto (excluyendo el eliminado)
          const allRefunds = await payload.find({
            collection: 'purchaserefund',
            where: {
              purchasecancellation: { equals: cancellationId },
            },
            depth: 0,
          })

          const totalRefunded = allRefunds.docs.reduce((acc, refund) => {
            return acc + (Number(refund.refundamount) || 0)
          }, 0)

          // 3. Actualizar cancelación
          await payload.update({
            collection: 'purchasecancellation',
            id: cancellationId,
            data: {
              totalRefunded,
              purchaserefund: allRefunds.docs.map((refund) => refund.id),
            },
          })

          // 4. Obtener compra relacionada
          const purchaseId =
            payload.db.defaultIDType === 'number'
              ? Number(cancellation.purchase)
              : String(cancellation.purchase)

          const purchase = await payload.findByID({
            collection: 'purchase',
            id: purchaseId,
            depth: 0,
          })

          // 5. Determinar nuevo estado
          let newStatus: typeof purchase.statuspayment
          if (totalRefunded >= Number(purchase.amountpaid || 0)) {
            newStatus = 'retornado'
          } else if (totalRefunded > 0) {
            newStatus = 'retorno parcial'
          } else {
            newStatus = 'por retornar'
          }

          // 6. Actualizar compra
          await payload.update({
            collection: 'purchase',
            id: purchaseId,
            data: {
              statuspayment: newStatus,
            },
          })
        } catch (error) {
          console.error('Error en afterDelete:', error)
          throw error
        }
      },
    ],
  },
}
