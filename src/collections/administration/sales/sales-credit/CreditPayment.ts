// collections/CreditPayment.ts
import type { CollectionConfig } from 'payload'

export const CreditPayment: CollectionConfig = {
  slug: 'creditpayment',
  access: {
    read: () => true,
    create: () => true,
    update: () => false,
    delete: () => false,
  },
  admin: {
    useAsTitle: 'paymentNumber',
    group: 'Créditos',
  },
  labels: { singular: 'Pago de Crédito', plural: 'Pagos de Crédito' },
  fields: [
    // === NÚMERO DE PAGO ===
    {
      name: 'paymentNumber',
      label: 'Número de pago',
      type: 'text',
      required: true,
      unique: true,
      admin: { readOnly: true },
    },

    // === FECHA ===
    {
      name: 'paymentDate',
      label: 'Fecha de pago',
      type: 'date',
      required: true,
    },

    // === CUOTAS ===
    {
      name: 'installments',
      label: 'Cuota(s) a pagar',
      type: 'relationship',
      relationTo: 'creditinstallment',
      hasMany: true,
      required: true,
      minRows: 1,
      admin: {
        description: 'Selecciona una o más cuotas a pagar (pago parcial o múltiple)',
        isSortable: true,
      },
    },

    // === MÉTODOS DE PAGO ===
    {
      name: 'paymentMethods',
      labels: { singular: 'Forma de pago', plural: 'Formas de pago' },
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        { name: 'typePayment', type: 'relationship', relationTo: 'typepayment', required: true },
        { name: 'amount', type: 'number', required: true, min: 0.01, admin: { step: 0.01 } },
        { name: 'typeCurrency', type: 'relationship', relationTo: 'typecurrency', required: true },
        { name: 'account', type: 'relationship', relationTo: 'accountcompany' },
        { name: 'operationNumber', type: 'text' },
        { name: 'voucher', type: 'upload', relationTo: 'mediasale' },
      ],
    },

    // === TOTAL ===
    {
      name: 'totalPaid',
      label: 'Total pagado',
      type: 'number',
      defaultValue: 0,
      required: true,
      admin: { readOnly: true },
    },

    // === RECIBO ===
    {
      name: 'receipt',
      label: 'Recibo asociado',
      type: 'join',
      collection: 'receiptcreditpayment',
      on: 'creditPayment',
      hasMany: false,
    },

    // === ESTADO ===
    {
      name: 'status',
      label: 'Estado de pago',
      type: 'select',
      defaultValue: 'registrado',
      options: ['registrado', 'aplicado', 'revertido'],
      admin: { position: 'sidebar' },
    },

    // === OBSERVACIONES ===
    { name: 'observations', type: 'textarea' },
  ],

  hooks: {
    beforeChange: [
      // === GENERAR paymentNumber (con anti-race) ===
      async ({ data, operation, req: { payload } }) => {
        if (operation === 'create' && !data.paymentNumber) {
          const now = new Date()
          const year = now.getFullYear()
          const prefix = `PAY-${year}-`

          let next = 1
          try {
            const last = await payload.find({
              collection: 'creditpayment',
              where: { paymentNumber: { like: prefix } },
              sort: '-paymentNumber',
              limit: 1,
            })
            if (last.docs.length > 0) {
              const match = last.docs[0].paymentNumber.match(/PAY-\d+-(\d+)/)
              if (match) next = parseInt(match[1]) + 1
            }
          } catch (err) {
            console.error('Error buscando último pago:', err)
          }

          let paymentNumber = `${prefix}${String(next).padStart(4, '0')}`

          // Anti-race: Verifica unique y retry
          let isUnique = false
          let attempts = 0
          while (!isUnique && attempts < 5) {
            const existing = await payload.find({
              collection: 'creditpayment',
              where: { paymentNumber: { equals: paymentNumber } },
              limit: 1,
            })
            if (existing.docs.length === 0) {
              isUnique = true
            } else {
              next++
              paymentNumber = `${prefix}${String(next).padStart(4, '0')}`
              attempts++
            }
          }
          if (!isUnique) {
            paymentNumber = `${prefix}${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000)}`
          }

          data.paymentNumber = paymentNumber
        }
        return data
      },

      // === CALCULAR totalPaid ===
      async ({ data }) => {
        const total =
          data.paymentMethods?.reduce(
            (sum: number, m: { amount: number }) => sum + (m.amount || 0),
            0,
          ) || 0
        data.totalPaid = Math.round(total * 100) / 100
        return data
      },

      // === VALIDAR DEUDA ===
      async ({ data, req: { payload } }) => {
        const ids = Array.isArray(data.installments)
          ? data.installments.map((i: { id: string } | string) =>
              typeof i === 'object' ? i.id : i,
            )
          : []
        if (ids.length === 0) return data

        const { docs: installments } = await payload.find({
          collection: 'creditinstallment',
          where: { id: { in: ids } },
        })

        const totalDebt = installments.reduce((sum, inst) => {
          return sum + (inst.totalDue + (inst.lateFee || 0) - (inst.paidAmount || 0))
        }, 0)

        if (data.totalPaid > totalDebt + 0.01) {
          throw new Error(`Pago excede deuda. Máximo: $${totalDebt.toFixed(2)}`)
        }
        return data
      },
    ],

    afterChange: [
      async ({ doc, operation, req: { payload, context } }) => {
        if (operation !== 'create' || context.skipPaymentApplication) return doc

        const installmentIds = Array.isArray(doc.installments)
          ? doc.installments.map((i: { id: string } | string) => (typeof i === 'object' ? i.id : i))
          : []
        if (installmentIds.length === 0) return doc

        try {
          let remaining = doc.totalPaid
          const appliedDetails: any[] = []

          const { docs: installments } = await payload.find({
            collection: 'creditinstallment',
            where: { id: { in: installmentIds } },
            sort: 'dueDate',
          })

          for (const inst of installments) {
            if (remaining <= 0) break

            const paidSoFar = inst.paidAmount || 0
            const lateFee = inst.lateFee || 0
            const interestDue = inst.interest
            const principalDue = inst.principal

            const toLateFee = Math.min(remaining, lateFee)
            remaining -= toLateFee

            let toInterest = 0
            if (remaining > 0) {
              toInterest = Math.min(remaining, interestDue - paidSoFar)
              remaining -= toInterest
            }

            let toPrincipal = 0
            if (remaining > 0) {
              toPrincipal = Math.min(remaining, principalDue)
              remaining -= toPrincipal
            }

            const totalApplied = toLateFee + toInterest + toPrincipal
            if (totalApplied <= 0) continue

            const newPaid = paidSoFar + totalApplied
            const statusAfter = newPaid >= inst.totalDue + lateFee ? 'pagada' : 'parcial'

            await payload.update({
              collection: 'creditinstallment',
              id: inst.id,
              data: {
                paidAmount: newPaid,
                status: statusAfter,
              },
              context: { skipMoraCalculation: true }, // Evita loops en cuotas
            })

            appliedDetails.push({
              installment: inst.id,
              installmentNumber: inst.installmentNumber,
              amountApplied: totalApplied,
              statusBefore: inst.status,
              statusAfter,
            })
          }

          // === ACTUALIZAR SOLO totalPaid Y remainingBalance EN PLAN (optimizado: sum con aggregate simulado) ===
          const rawPlanId = installments[0]?.creditPlan
          if (!rawPlanId) return doc

          const planId = typeof rawPlanId === 'object' ? rawPlanId.id : rawPlanId

          if (planId) {
            const { docs: allInstallments } = await payload.find({
              collection: 'creditinstallment',
              where: { creditPlan: { equals: planId } },
              pagination: false,
            })

            const totalPaid = allInstallments.reduce((sum, i) => sum + (i.paidAmount || 0), 0)
            const plan = await payload.findByID({
              collection: 'creditplan',
              id: planId,
            })
            const remaining = plan.amountToFinance - totalPaid

            await payload.update({
              collection: 'creditplan',
              id: planId,
              data: {
                totalPaid,
                remainingBalance: Math.max(0, remaining),
              },
            })
          }

          // === CREAR RECIBO ===

          // Normalizamos paymentMethods para asegurar que solo van IDs
          const cleanPaymentMethods = doc.paymentMethods.map((m: any) => ({
            typePayment: typeof m.typePayment === 'object' ? m.typePayment.id : m.typePayment,
            amount: m.amount,
            typeCurrency: typeof m.typeCurrency === 'object' ? m.typeCurrency.id : m.typeCurrency,
            account: m.account ? (typeof m.account === 'object' ? m.account.id : m.account) : null,
            operationNumber: m.operationNumber,
            voucher: m.voucher ? (typeof m.voucher === 'object' ? m.voucher.id : m.voucher) : null,
          }))
          await payload.create({
            collection: 'receiptcreditpayment',
            data: {
              creditPayment: doc.id,
              receiptNumber: '', // ← SE LLENARÁ CON beforeChange
              issueDate: new Date().toISOString(), // ← OBLIGATORIO
              totalPaid: doc.totalPaid,
              appliedDetails,
              paymentMethods: cleanPaymentMethods,
              status: 'emitido',
            },
          })

          await payload.update({
            collection: 'creditpayment',
            id: doc.id,
            data: { status: 'aplicado' },
            context: { skipPaymentApplication: true },
          })

          return doc
        } catch (err) {
          console.error('Error aplicando pago:', err)
          await payload.update({
            collection: 'creditpayment',
            id: doc.id,
            data: { status: 'revertido' },
          })
          return doc
        }
      },
    ],
  },

  // hooks: {
  //   beforeChange: [
  //     // === GENERAR paymentNumber ===
  //     async ({ data, operation, req: { payload } }) => {
  //       if (operation === 'create' && !data.paymentNumber) {
  //         const now = new Date()
  //         const year = now.getFullYear()
  //         const prefix = `PAY-${year}-`
  //         const last = await payload.find({
  //           collection: 'creditpayment',
  //           where: { paymentNumber: { like: prefix } },
  //           sort: '-paymentNumber',
  //           limit: 1,
  //         })
  //         let next = 1
  //         if (last.docs.length > 0) {
  //           const match = last.docs[0].paymentNumber.match(/PAY-\d+-(\d+)/)
  //           if (match) next = parseInt(match[1]) + 1
  //         }
  //         data.paymentNumber = `${prefix}${String(next).padStart(4, '0')}`
  //       }
  //       return data
  //     },

  //     // === CALCULAR totalPaid ===
  //     async ({ data }) => {
  //       const total =
  //         data.paymentMethods?.reduce((sum: number, m: any) => sum + (m.amount || 0), 0) || 0
  //       data.totalPaid = Math.round(total * 100) / 100
  //       return data
  //     },

  //     // === VALIDAR DEUDA ===
  //     async ({ data, req: { payload } }) => {
  //       const ids = Array.isArray(data.installments)
  //         ? data.installments.map((i: any) => (typeof i === 'object' ? i.id : i))
  //         : []
  //       if (ids.length === 0) return data

  //       const { docs: installments } = await payload.find({
  //         collection: 'creditinstallment',
  //         where: { id: { in: ids } },
  //       })

  //       const totalDebt = installments.reduce((sum, inst) => {
  //         return sum + (inst.totalDue + (inst.lateFee || 0) - (inst.paidAmount || 0))
  //       }, 0)

  //       if (data.totalPaid > totalDebt + 0.01) {
  //         throw new Error(`Pago excede deuda. Máximo: $${totalDebt.toFixed(2)}`)
  //       }
  //       return data
  //     },
  //   ],

  //   afterChange: [
  //     async ({ doc, operation, req: { payload } }) => {
  //       if (operation !== 'create') return doc

  //       const installmentIds = Array.isArray(doc.installments)
  //         ? doc.installments.map((i: any) => (typeof i === 'object' ? i.id : i))
  //         : []
  //       if (installmentIds.length === 0) return doc

  //       let remaining = doc.totalPaid
  //       const appliedDetails: any[] = []

  //       const { docs: installments } = await payload.find({
  //         collection: 'creditinstallment',
  //         where: { id: { in: installmentIds } },
  //         sort: 'dueDate',
  //       })

  //       for (const inst of installments) {
  //         if (remaining <= 0) break

  //         const paidSoFar = inst.paidAmount || 0
  //         const lateFee = inst.lateFee || 0
  //         const interestDue = inst.interest
  //         const principalDue = inst.principal

  //         const toLateFee = Math.min(remaining, lateFee)
  //         remaining -= toLateFee

  //         let toInterest = 0
  //         if (remaining > 0) {
  //           toInterest = Math.min(remaining, interestDue - paidSoFar)
  //           remaining -= toInterest
  //         }

  //         let toPrincipal = 0
  //         if (remaining > 0) {
  //           toPrincipal = Math.min(remaining, principalDue)
  //           remaining -= toPrincipal
  //         }

  //         const totalApplied = toLateFee + toInterest + toPrincipal
  //         if (totalApplied <= 0) continue

  //         const newPaid = paidSoFar + totalApplied
  //         const statusAfter = newPaid >= inst.totalDue + lateFee ? 'pagada' : 'parcial'

  //         await payload.update({
  //           collection: 'creditinstallment',
  //           id: inst.id,
  //           data: {
  //             paidAmount: newPaid,
  //             status: statusAfter,
  //           },
  //         })

  //         appliedDetails.push({
  //           installment: inst.id,
  //           installmentNumber: inst.installmentNumber,
  //           amountApplied: totalApplied,
  //           statusBefore: inst.status,
  //           statusAfter,
  //         })
  //       }

  //       // === ACTUALIZAR SOLO totalPaid Y remainingBalance EN PLAN ===

  //       const rawPlanId = installments[0]?.creditPlan
  //       if (!rawPlanId) return doc

  //       const planId = typeof rawPlanId === 'object' ? rawPlanId.id : rawPlanId

  //       if (planId) {
  //         const { docs: allInstallments } = await payload.find({
  //           collection: 'creditinstallment',
  //           where: { creditPlan: { equals: planId } },
  //           pagination: false,
  //         })

  //         const totalPaid = allInstallments.reduce((sum, i) => sum + (i.paidAmount || 0), 0)
  //         const plan = await payload.findByID({
  //           collection: 'creditplan',
  //           id: planId,
  //         })
  //         const remaining = plan.amountToFinance - totalPaid

  //         await payload.update({
  //           collection: 'creditplan',
  //           id: planId,
  //           data: {
  //             totalPaid,
  //             remainingBalance: Math.max(0, remaining),
  //           },
  //         })
  //       }

  //       // === CREAR RECIBO ===
  //       const receipt = await payload.create({
  //         collection: 'receiptcreditpayment',
  //         data: {
  //           creditPayment: doc.id,
  //           receiptNumber: '', // ← SE LLENARÁ CON beforeChange
  //           issueDate: new Date().toISOString(), // ← OBLIGATORIO
  //           totalPaid: doc.totalPaid,
  //           appliedDetails,
  //           paymentMethods: doc.paymentMethods.map((m: any) => ({
  //             typePayment: typeof m.typePayment === 'object' ? m.typePayment.id : m.typePayment,
  //             amount: m.amount,
  //             typeCurrency: typeof m.typeCurrency === 'object' ? m.typeCurrency.id : m.typeCurrency,
  //             account: m.account
  //               ? typeof m.account === 'object'
  //                 ? m.account.id
  //                 : m.account
  //               : null,
  //             operationNumber: m.operationNumber,
  //             voucher: m.voucher,
  //           })),
  //           status: 'emitido',
  //         },
  //       })

  //       await payload.update({
  //         collection: 'creditpayment',
  //         id: doc.id,
  //         data: { receipt: receipt.id, status: 'aplicado' },
  //       })

  //       return doc
  //     },
  //   ],
  // },
}
