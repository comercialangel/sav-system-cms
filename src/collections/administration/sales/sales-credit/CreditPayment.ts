// collections/CreditPayment.ts
import { generateSequence } from '@/utils/generateSequence'
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
    // === NUEVO: CAMPO DE DESCUENTO DE MORA ===
    {
      name: 'lateFeeDiscount', //El usuario debera ingresar manualmente el monto de mora a descontar en este pago, basado en la deuda total de mora que tengan las cuotas seleccionadas. El sistema validará que no exceda la mora adeudada.
      label: 'Condonación de Mora (Descuento)',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Monto de la mora que gerencia autoriza perdonar (no aplica a capital).',
      },
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
      // 1. GENERAR paymentNumber
      async ({ data, operation, req }) => {
        const { payload } = req

        if (operation === 'create' && !data.paymentNumber) {
          data.paymentNumber = await generateSequence(payload, {
            name: 'creditpayment', // Diferenciador en counters
            prefix: 'PAG-', // Resultado: PAG-2025-000001
            padding: 6,
          })
        }
        return data
      },

      // 2. CALCULAR totalPaid
      async ({ data }) => {
        const total =
          data.paymentMethods?.reduce(
            (sum: number, m: { amount: number }) => sum + (m.amount || 0),
            0,
          ) || 0
        data.totalPaid = Math.round(total * 100) / 100
        return data
      },

      // 3. VALIDAR DEUDA Y DESCUENTO
      async ({ data, req }) => {
        const ids = Array.isArray(data.installments)
          ? data.installments.map((i: { id: string } | string) =>
              typeof i === 'object' ? i.id : i,
            )
          : []
        if (ids.length === 0) return data

        const { docs: installments } = await req.payload.find({
          collection: 'creditinstallment',
          where: { id: { in: ids } },
          sort: 'dueDate',
          req,
        })

        // === ✨ NUEVO: VALIDACIÓN DE PRELACIÓN ESTRICTA (NO SALTAR CUOTAS) ✨ ===
        const oldestSelectedInstallment = installments[0]
        const planId =
          typeof oldestSelectedInstallment.creditPlan === 'object'
            ? oldestSelectedInstallment.creditPlan.id
            : oldestSelectedInstallment.creditPlan

        // ✨ NUEVO: VALIDACIÓN DEL ESTADO DEL PLAN ✨
        const plan = await req.payload.findByID({
          collection: 'creditplan',
          id: planId,
          req,
        })

        // ✨ ACTUALIZADO: Bloqueamos cobros normales para autos incautados o liquidados
        const blockedStates = [
          'refinanciado',
          'reprogramado',
          'cancelado',
          'completado',
          'en_recuperacion',
          'liquidado',
        ]
        if (blockedStates.includes(plan.status || '')) {
          throw new Error(
            `Operación rechazada: El plan de crédito se encuentra '${plan.status}'. No puede recibir nuevos pagos en ventanilla.`,
          )
        }

        // Buscamos si el cliente tiene cuotas más viejas sin pagar
        const { docs: olderUnpaidInstallments } = await req.payload.find({
          collection: 'creditinstallment',
          where: {
            and: [
              { creditPlan: { equals: planId } },
              { dueDate: { less_than: oldestSelectedInstallment.dueDate } },
              { status: { not_equals: 'pagada' } }, // Si está pendiente, parcial o vencida
            ],
          },
          req,
        })

        if (olderUnpaidInstallments.length > 0) {
          // Extraemos los números de cuota para darle un mensaje claro al cajero
          const unpaidNumbers = olderUnpaidInstallments.map((i) => i.installmentNumber).join(', ')
          throw new Error(
            `No puede pagar estas cuotas. Existen cuotas anteriores sin cancelar (Cuota(s): ${unpaidNumbers}). Debe seleccionarlas y pagarlas primero.`,
          )
        }
        // =========================================================================

        // A. Validar que el descuento no sea mayor a la mora acumulada
        const totalMoraAvailable = installments.reduce((sum, inst) => {
          return sum + ((inst.lateFee || 0) - (inst.lateFeeForgiven || 0))
        }, 0)

        const appliedDiscount = data.lateFeeDiscount || 0

        if (appliedDiscount > totalMoraAvailable + 0.01) {
          throw new Error(
            `El descuento ($${appliedDiscount}) no puede exceder la mora adeudada ($${totalMoraAvailable})`,
          )
        }

        // B. Validar que Efectivo + Descuento no superen la deuda total
        const totalDebt = installments.reduce((sum, inst) => {
          // Deuda real = (Capital + Interes) + Mora - EfectivoPagado - MoraPerdonada
          return (
            sum +
            (inst.totalDue +
              (inst.lateFee || 0) -
              (inst.paidAmount || 0) -
              (inst.lateFeeForgiven || 0))
          )
        }, 0)

        if (data.totalPaid + appliedDiscount > totalDebt + 0.01) {
          throw new Error(
            `El pago + descuento excede la deuda. Máximo a cubrir: $${totalDebt.toFixed(2)}`,
          )
        }
        return data
      },
    ],

    afterChange: [
      async ({ doc, operation, req }) => {
        const { payload, context } = req

        if (operation !== 'create' || context.skipPaymentApplication) return doc

        const installmentIds = Array.isArray(doc.installments)
          ? doc.installments.map((i: { id: string } | string) => (typeof i === 'object' ? i.id : i))
          : []
        if (installmentIds.length === 0) return doc

        try {
          let remainingCash = doc.totalPaid
          let remainingDiscount = doc.lateFeeDiscount || 0 // Iniciamos el cubo de descuento
          const appliedDetails: any[] = []

          const { docs: installments } = await payload.find({
            collection: 'creditinstallment',
            where: { id: { in: installmentIds } },
            sort: 'dueDate',
            req,
          })

          // === NUEVA CASCADA MATEMÁTICA PERFECTA ===

          for (const inst of installments) {
            if (remainingCash <= 0 && remainingDiscount <= 0) break

            const paidSoFar = inst.paidAmount || 0
            const forgivenSoFar = inst.lateFeeForgiven || 0
            const lateFeePaidSoFar = inst.lateFeePaid || 0
            const lateFee = inst.lateFee || 0
            const totalDue = inst.totalDue

            // 1. ¿Cuánta Mora sigue viva?
            const totalMoraCovered = forgivenSoFar + lateFeePaidSoFar
            const pendingMora = lateFee - totalMoraCovered

            // 2. Aplicar DESCUENTO (Solo a la mora)
            const appliedDiscountToMora = Math.min(remainingDiscount, pendingMora)
            remainingDiscount -= appliedDiscountToMora
            const pendingMoraAfterDiscount = pendingMora - appliedDiscountToMora

            // 3. Aplicar EFECTIVO a la Mora (Prelación de pagos)
            const appliedCashToMora = Math.min(remainingCash, pendingMoraAfterDiscount)
            remainingCash -= appliedCashToMora

            // 4. Aplicar EFECTIVO al Capital (Lo que quede de dinero)
            const pendingInstallmentCash = totalDue - paidSoFar
            const appliedCashToPrincipal = Math.min(remainingCash, pendingInstallmentCash)
            remainingCash -= appliedCashToPrincipal

            const appliedCashTotal = appliedCashToMora + appliedCashToPrincipal

            if (appliedCashTotal <= 0 && appliedDiscountToMora <= 0) continue

            // 5. Determinar nuevos estados
            const newPaidAmount = paidSoFar + appliedCashToPrincipal
            const newForgivenAmount = forgivenSoFar + appliedDiscountToMora
            const newLateFeePaid = lateFeePaidSoFar + appliedCashToMora

            const isFullyPaid =
              newPaidAmount >= totalDue && newForgivenAmount + newLateFeePaid >= lateFee
            const statusAfter = isFullyPaid ? 'pagada' : 'parcial'

            // 6. Guardar en Base de Datos
            await payload.update({
              collection: 'creditinstallment',
              id: inst.id,
              data: {
                paidAmount: newPaidAmount, // Solo efectivo que fue al capital
                lateFeeForgiven: newForgivenAmount, // Descuento que fue a la mora
                lateFeePaid: newLateFeePaid, // Efectivo que fue a la mora
                status: statusAfter,
              },
              context: { skipMoraCalculation: true },
              req,
            })

            appliedDetails.push({
              installment: inst.id,
              installmentNumber: inst.installmentNumber,
              amountApplied: appliedCashTotal,
              discountApplied: appliedDiscountToMora,
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
              req,
            })
            // === ✨ REEMPLÁZALO CON ESTO ✨ ===
            const plan = await payload.findByID({ collection: 'creditplan', id: planId, req })

            // 1. Total Pagado a las cuotas (Capital + Interés de la cuota)
            const totalPaid = allInstallments.reduce((sum, i) => sum + (i.paidAmount || 0), 0)

            // 2. Deuda Total Original (Suma de todos los totalDue del cronograma)
            const totalPlanDue = allInstallments.reduce((sum, i) => sum + (i.totalDue || 0), 0)

            // 3. Saldo Pendiente Matemáticamente Perfecto
            const remaining = totalPlanDue - totalPaid

            // === ✨ NUEVA MÁQUINA DE ESTADOS AUTOMÁTICA ✨ ===
            let newPlanStatus = plan.status
            // 🏆 FORMA INFALIBLE: ¿Están todas las cuotas pagadas?
            const isFullyPaid = allInstallments.every((inst) => inst.status === 'pagada')

            if (isFullyPaid) {
              // Si no queda ni una sola cuota pendiente/parcial/vencida, se acabó.
              newPlanStatus = 'completado'
            } else if (plan.status === 'moroso') {
              // Si era moroso, verificamos si aún tiene deudas de fechas pasadas
              const today = new Date()
              today.setHours(0, 0, 0, 0)

              const hasVencidas = allInstallments.some((inst) => {
                // Si ya está pagada al 100%, no es vencida
                if (inst.status === 'pagada') return false

                // Si le falta dinero (pendiente/parcial) y su fecha ya pasó, SIGUE VENCIDA
                const dueDate = new Date(inst.dueDate)
                dueDate.setHours(0, 0, 0, 0)

                return dueDate.getTime() < today.getTime() || inst.status === 'vencida'
              })

              if (!hasVencidas) {
                newPlanStatus = 'activo'
              }
            }

            await payload.update({
              collection: 'creditplan',
              id: planId,
              data: {
                totalPaid,
                remainingBalance: Math.max(0, remaining),
                status: newPlanStatus,
              },
              req,
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
              lateFeeDiscount: doc.lateFeeDiscount || 0, // ¡NUEVO!
              appliedDetails,
              paymentMethods: cleanPaymentMethods,
              status: 'emitido',
            },
            req,
          })

          await payload.update({
            collection: 'creditpayment',
            id: doc.id,
            data: { status: 'aplicado' },
            context: { skipPaymentApplication: true },
            req,
          })

          return doc
        } catch (err) {
          console.error('Error aplicando pago:', err)
          return doc
        }
      },
    ],
  },
}
