import type { CollectionConfig } from 'payload'

export const PurchasePayment: CollectionConfig = {
  slug: 'purchasepayment',
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
    singular: 'Pago de compra',
    plural: 'Pago de compras',
  },
  fields: [
    {
      name: 'purchase',
      label: 'Compra asociada',
      type: 'relationship',
      relationTo: 'purchase',
      index: true,
      required: true,
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
          name: 'paymentdate',
          label: 'Fecha de pago',
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
          name: 'typepayment',
          label: 'Tipo de pago',
          type: 'relationship',
          relationTo: 'typepayment',
          required: true,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
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
          name: 'monetaryvalue',
          label: 'Valor monetario',
          type: 'number',
          min: 0,
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'supplierbankaccount',
          label: 'Cuenta bancaria de proveedor',
          type: 'relationship',
          relationTo: 'supplierbankaccount',
          required: false,
          hasMany: false,
          admin: {
            width: '66%',
            allowCreate: true,
          },
        },
        {
          name: 'operationnumber',
          label: 'Número de operación',
          type: 'text',
          required: false,
          admin: {
            width: '34%',
          },
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
      name: 'mediapayment',
      label: 'Archivo',
      type: 'upload',
      relationTo: 'mediapurchasepayment',
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

  // hooks: {
  //   afterChange: [
  //     async ({ operation, doc, req }) => {
  //       const { payload } = req
  //       const { purchase, monetaryvalue } = doc

  //       if (operation === 'create' || operation === 'update') {
  //         const purchaseAssociated = await payload.findByID({
  //           collection: 'purchase',
  //           id: purchase,
  //           depth: 0,
  //         })

  //         let amountpaid

  //         if (operation === 'create') {
  //           amountpaid = (Number(purchaseAssociated.amountpaid) || 0) + Number(monetaryvalue)

  //           await payload.update({
  //             collection: 'purchase',
  //             id: purchase,
  //             data: {
  //               amountpaid,
  //               statuspayment:
  //                 amountpaid >= Number(purchaseAssociated.pricepurchase)
  //                   ? 'completado'
  //                   : amountpaid > 0
  //                     ? 'parcial'
  //                     : 'pendiente',
  //               payment: [...(purchaseAssociated.payment || []), doc.id],
  //             },
  //           })
  //         } else {
  //           // MODIFICACIÓN CLAVE: Siempre recalcular para updates
  //           const payments = await payload.find({
  //             collection: 'purchasepayment',
  //             where: { purchase: { equals: purchase } },
  //             limit: 100,
  //           })
  //           amountpaid = payments.docs.reduce((total, p) => total + Number(p.monetaryvalue), 0)

  //           await payload.update({
  //             collection: 'purchase',
  //             id: purchase,
  //             data: {
  //               amountpaid,
  //               statuspayment:
  //                 amountpaid >= Number(purchaseAssociated.pricepurchase)
  //                   ? 'completado'
  //                   : amountpaid > 0
  //                     ? 'parcial'
  //                     : 'pendiente',
  //             },
  //           })
  //         }
  //       }
  //     },
  //   ],

  //   afterDelete: [
  //     async ({ doc, req }) => {
  //       const { payload } = req
  //       const purchaseId = typeof doc.purchase === 'object' ? doc.purchase.id : doc.purchase

  //       try {
  //         const purchaseAssociated = await payload.findByID({
  //           collection: 'purchase',
  //           id: purchaseId,
  //           depth: 0,
  //         })

  //         if (!purchaseAssociated) throw new Error('Compra no encontrada')

  //         const payments = await payload.find({
  //           collection: 'purchasepayment',
  //           where: { purchase: { equals: purchaseId } },
  //           limit: 100,
  //         })

  //         const amountpaid = payments.docs.reduce((sum, p) => sum + Number(p.monetaryvalue), 0)

  //         // MODIFICACIÓN CLAVE: cambiar a 'pendiente' si amountpaid = 0
  //         const statuspayment =
  //           amountpaid === 0
  //             ? 'pendiente'
  //             : amountpaid >= Number(purchaseAssociated.pricepurchase)
  //               ? 'completado'
  //               : 'parcial'

  //         await payload.update({
  //           collection: 'purchase',
  //           id: purchaseId,
  //           data: {
  //             amountpaid,
  //             statuspayment,
  //             payment: payments.docs.map((p) => p.id),
  //           },
  //         })
  //       } catch (error) {
  //         console.error('Error en afterDelete:', error)
  //       }
  //     },
  //   ],

  //   beforeChange: [
  //     async ({ req: { user }, data, originalDoc }) => {
  //       if (user) {
  //         if (!originalDoc.createdBy) {
  //           data.createdBy = user.id
  //         }
  //         data.updatedBy = user.id
  //       }
  //       return data
  //     },
  //   ],
  // },

  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        const { user } = req
        if (user) {
          if (operation === 'create') {
            data.createdBy = user.id
          }
          data.updatedBy = user.id
        }
        return data
      },
    ],

    // Unificamos lógica: Tanto al crear como actualizar, recalculamos el total
    afterChange: [
      async ({ operation, doc, req }) => {
        // Solo nos interesa si cambia el valor o la compra asociada
        if (operation === 'create' || operation === 'update') {
          const { payload } = req
          const purchaseId = doc.purchase

          try {
            // 1. Obtener la compra para saber el precio total
            const purchaseAssociated = await payload.findByID({
              collection: 'purchase',
              id: purchaseId,
              depth: 0,
              req,
            })

            if (!purchaseAssociated) return

            // 2. RECALCULAR SIEMPRE: Buscamos TODOS los pagos de esta compra
            // Esto corrige automáticamente cualquier desfase previo.
            const allPayments = await payload.find({
              collection: 'purchasepayment',
              where: {
                purchase: { equals: purchaseId },
              },
              limit: 10, // Límite seguro
              req,
            })

            // Sumamos
            const totalPaid = allPayments.docs.reduce((sum, payment) => {
              return sum + (Number(payment.monetaryvalue) || 0)
            }, 0)

            // 3. Determinar Estado
            const pricePurchase = Number(purchaseAssociated.pricepurchase || 0)

            // let newStatus: 'pendiente' | 'parcial' | 'completado' = 'pendiente'
            let newStatus: typeof purchaseAssociated.statuspayment = 'pendiente'

            // Usamos una pequeña tolerancia para errores de redondeo decimal (floating point)
            if (totalPaid >= pricePurchase) {
              newStatus = 'completado'
            } else if (totalPaid > 0) {
              newStatus = 'parcial'
            }

            // 4. Actualizar la Compra (Solo montos y estado, SIN array de pagos)
            await payload.update({
              collection: 'purchase',
              id: purchaseId,
              data: {
                amountpaid: totalPaid,
                statuspayment: newStatus,
                // payment: ... <-- YA NO TOCAMOS ESTO, el 'join' lo hace solo
              },
              req,
            })
          } catch (error) {
            console.error('Error calculando pagos en afterChange:', error)
          }
        }
      },
    ],

    afterDelete: [
      async ({ doc, req }) => {
        const { payload } = req
        // Manejo seguro del ID (por si viene poblado o no)
        const purchaseId = typeof doc.purchase === 'object' ? doc.purchase.id : doc.purchase

        try {
          // 1. Obtener datos básicos de la compra
          const purchaseAssociated = await payload.findByID({
            collection: 'purchase',
            id: purchaseId,
            depth: 0,
            req,
          })

          if (!purchaseAssociated) return

          // 2. Recalcular restantes (El eliminado ya no saldrá en esta búsqueda)
          const remainingPayments = await payload.find({
            collection: 'purchasepayment',
            where: {
              purchase: { equals: purchaseId },
            },
            limit: 500,
            req,
          })

          const totalPaid = remainingPayments.docs.reduce(
            (sum, p) => sum + (Number(p.monetaryvalue) || 0),
            0,
          )
          const pricePurchase = Number(purchaseAssociated.pricepurchase || 0)

          // 3. Determinar estado
          let newStatus: 'pendiente' | 'parcial' | 'completado' = 'pendiente'

          if (totalPaid >= pricePurchase - 0.01 && totalPaid > 0) {
            newStatus = 'completado'
          } else if (totalPaid > 0) {
            newStatus = 'parcial'
          }

          // 4. Actualizar Compra
          await payload.update({
            collection: 'purchase',
            id: purchaseId,
            data: {
              amountpaid: totalPaid,
              statuspayment: newStatus,
            },
            req,
          })
        } catch (error) {
          console.error('Error recalculando en afterDelete:', error)
        }
      },
    ],
  },
}
