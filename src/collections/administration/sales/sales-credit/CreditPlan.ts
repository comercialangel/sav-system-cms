// collections/CreditPlan.ts
import { generateSequence } from '@/utils/generateSequence'
import { addMonths } from 'date-fns'
import { headersWithCors, type CollectionConfig } from 'payload'

export const CreditPlan: CollectionConfig = {
  slug: 'creditplan',
  access: {
    // Esto es lo que usan el 99% de proyectos reales
    create: () => true, // ← necesario para que el hook cree el plan
    read: () => true,
    update: ({ req }) => !!req.user,
  },
  labels: { singular: 'Plan de Crédito', plural: 'Planes de Crédito' },
  admin: {
    useAsTitle: 'creditPlanNumber',
    group: 'Créditos',
  },
  fields: [
    // === Número único ===
    {
      name: 'creditPlanNumber',
      label: 'Correlativo de crédito',
      type: 'text',
      unique: true,
      index: true,
      // required: true,
      admin: { readOnly: true },
    },

    // === Venta ===
    {
      name: 'finalSale',
      type: 'relationship',
      relationTo: 'finalsale',
      hasMany: false,
      index: true,
    },

    // === Parámetros (copiados de FinalSale) ===
    {
      name: 'amountToFinance',
      label: 'Monto a financiar',
      type: 'number',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'monthlyPayment',
      label: 'Cuota mensual',
      type: 'number',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'startDate',
      label: 'Fecha de inicio del crédito',
      type: 'date',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'termMonths',
      label: 'Plazo (meses)',
      type: 'number',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'interestRate',
      label: 'Tasa de interés mensual (%)',
      type: 'number',
      required: true,
      admin: {
        readOnly: true,
        description: 'Tasa mensual (Ej: 2 para cobrar 2% mensual)',
      },
    },

    // === REFINANCIAMIENTO (BIDIRECCIONAL) ===
    {
      name: 'parentPlan',
      label: 'Refinanciamiento asociado',
      type: 'relationship',
      relationTo: 'creditplan',
      hasMany: false,
      admin: {
        description: 'Plan del que proviene este (si fue refinanciado)',
        position: 'sidebar',
      },
    },
    {
      name: 'refinancedPlans',
      label: 'Historial de refinaciamientos',
      type: 'relationship',
      relationTo: 'creditplan',
      hasMany: true,
      admin: {
        description: 'Planes generados a partir de este',
        position: 'sidebar',
        isSortable: true,
      },
      filterOptions: ({ id }) => ({
        parentPlan: { equals: id },
      }),
    },
    {
      name: 'refinancingReason',
      label: 'Motivo de refinanciamiento',
      type: 'select',
      options: [
        { label: 'Mora', value: 'mora' },
        { label: 'Mejor tasa', value: 'mejor_tasa' },
        { label: 'Extensión de plazo', value: 'extension_plazo' },
        { label: 'Reprogramación de fechas', value: 'reprogramacion_fechas' },
        { label: 'Otro', value: 'otro' },
      ],
      admin: {
        condition: ({ parentPlan }) => !!parentPlan,
      },
    },

    // === Estado financiero ===
    {
      name: 'totalPaid',
      label: 'Pago total',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'remainingBalance',
      label: 'Saldo pendiente (balance de pago)',
      type: 'number',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'lateFeeRate',
      label: 'Tasa fija por mora',
      type: 'number',
      defaultValue: 0.01, // 1% diario
      admin: { description: 'Tasa diaria de mora (ej: 0.01 = 1%)' },
    },

    {
      name: 'status',
      label: 'Estado de plan de crédito',
      type: 'select',
      defaultValue: 'activo',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Activo', value: 'activo' },
        { label: 'Moroso', value: 'moroso' },
        { label: 'Completado', value: 'completado' },
        { label: 'Refinanciado', value: 'refinanciado' },
        { label: 'Reprogramado', value: 'reprogramado' },
        { label: 'En Recuperación', value: 'en_recuperacion' }, // ✨ NUEVO: Congela el crédito
        { label: 'Liquidado', value: 'liquidado' }, // ✨ NUEVO: Cierra el crédito tras el remate
      ],
      index: true,
    },

    // === Cuotas ===
    {
      name: 'installments',
      label: 'Cuotas asociadas a crédito',
      type: 'join',
      collection: 'creditinstallment',
      on: 'creditPlan',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data, operation, req: { payload } }) => {
        // Lógica limpia y atómica
        if (operation === 'create' && !data.creditPlanNumber) {
          data.creditPlanNumber = await generateSequence(payload, {
            name: 'creditplan', // Se guardará como 'creditplan-2026' en counters
            prefix: 'CRED-', // Resultado: CRED-2026-000001
            padding: 6, // 6 dígitos según tu diseño anterior
          })
        }
        return data
      },
    ],
  },

  endpoints: [
    {
      path: '/:id/refinance',
      method: 'post',
      handler: async (req) => {
        try {
          // 1. Acceso a parámetros
          const planId = req.routeParams?.id as string

          const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

          const { newTermMonths, newInterestRate, refinancingReason, startDate } = body

          if (!planId || !newTermMonths || !newInterestRate || !refinancingReason || !startDate) {
            return Response.json(
              {
                error:
                  'Faltan parámetros requeridos (newTermMonths, newInterestRate, refinancingReason, startDate)',
              },
              {
                status: 400,
                headers: headersWithCors({
                  headers: new Headers(),
                  req,
                }),
              },
            )
          }

          const { payload } = req

          // 2. Obtener el Plan Viejo
          const oldPlan = await payload.findByID({
            collection: 'creditplan',
            id: planId,
            req,
          })

          if (!oldPlan) {
            return Response.json(
              { error: 'Plan de crédito no encontrado' },
              {
                status: 404,
                headers: headersWithCors({
                  headers: new Headers(),
                  req,
                }),
              },
            )
          }

          // 3. Validación de estado
          if (oldPlan.status !== 'activo' && oldPlan.status !== 'moroso') {
            return Response.json(
              { error: `El plan está '${oldPlan.status}' y no puede refinanciarse.` },
              {
                status: 400,
                headers: headersWithCors({
                  headers: new Headers(),
                  req,
                }),
              },
            )
          }

          // 4. Obtener cuotas vivas (no pagadas)
          const { docs: unpaidInstallments } = await payload.find({
            collection: 'creditinstallment',
            where: {
              and: [{ creditPlan: { equals: planId } }, { status: { not_equals: 'pagada' } }],
            },
            pagination: false,
            req,
          })

          // 5. Calcular la "Deuda a Capitalizar" (Capital Puro + Mora Viva)
          let totalDebtToCapitalize = 0
          for (const inst of unpaidInstallments) {
            // Calculamos la mora viva
            const pendingLateFee =
              (inst.lateFee || 0) - (inst.lateFeeForgiven || 0) - (inst.lateFeePaid || 0)

            // Calculamos el capital pendiente.
            // Si hubo un pago parcial (paidAmount), se lo restamos al capital para ser justos con el cliente.
            const capitalPendiente = inst.principal - (inst.paidAmount || 0)

            // Sumamos asegurándonos de no bajar de cero en caso de pagos parciales grandes
            totalDebtToCapitalize += Math.max(0, capitalPendiente) + Math.max(0, pendingLateFee)
          }

          if (totalDebtToCapitalize <= 0) {
            return Response.json(
              { error: 'No hay deuda pendiente para refinanciar' },
              {
                status: 400,
                headers: headersWithCors({
                  headers: new Headers(),
                  req,
                }),
              },
            )
          }

          // 6. Crear el NUEVO Plan
          // const totalConInteres = totalDebtToCapitalize * (1 + newInterestRate / 100)
          // const newMonthlyPayment = totalConInteres / newTermMonths

          // 6. Crear el NUEVO Plan (Matemática de Interés Simple Mensual)
          const decimalRate = newInterestRate / 100

          // Interés total = Capital * Tasa Mensual * Plazo
          const totalInterest = totalDebtToCapitalize * decimalRate * newTermMonths
          const totalConInteres = totalDebtToCapitalize + totalInterest

          // Cuota mensual con redondeo exacto a 2 decimales
          const newMonthlyPayment = Math.round((totalConInteres / newTermMonths) * 100) / 100
          const newPlan = await payload.create({
            collection: 'creditplan',
            data: {
              creditPlanNumber: '', // Autogenerado por hook
              finalSale:
                oldPlan.finalSale && typeof oldPlan.finalSale === 'object'
                  ? oldPlan.finalSale.id
                  : oldPlan.finalSale,
              amountToFinance: Math.round(totalDebtToCapitalize * 100) / 100,
              monthlyPayment: newMonthlyPayment,
              startDate: startDate,
              termMonths: newTermMonths,
              interestRate: newInterestRate,
              parentPlan: oldPlan.id,
              refinancingReason: refinancingReason,
              totalPaid: 0,
              // remainingBalance: Math.max(0, totalDebtToCapitalize),
              remainingBalance: Math.max(0, Math.round(totalConInteres * 100) / 100), // Saldo es Capital + Interés
              lateFeeRate: oldPlan.lateFeeRate,
              status: 'activo',
            },
            req,
          })

          // 7. ✨ GENERAR LAS NUEVAS CUOTAS (CreditInstallment) ✨
          const baseDate = new Date(startDate)
          if (isNaN(baseDate.getTime())) {
            throw new Error('Fecha de inicio inválida')
          }

          let balance = totalDebtToCapitalize

          // Bucle para crear cada una de las cuotas
          for (let i = 1; i <= newTermMonths; i++) {
            const currentDueDate = addMonths(baseDate, i)

            // Calculamos el interés fijo por cuota a 2 decimales
            const interest = Math.round(totalDebtToCapitalize * decimalRate * 100) / 100
            let principal = Math.round((newMonthlyPayment - interest) * 100) / 100

            // Ajuste de la última cuota para balance 0 absoluto
            if (i === newTermMonths) {
              principal = balance
            }

            const totalDue = Math.round((principal + interest) * 100) / 100
            balance = Math.round((balance - principal) * 100) / 100

            await payload.create({
              collection: 'creditinstallment',
              data: {
                installmentNumber: i,
                dueDate: currentDueDate.toISOString(),
                principal,
                interest,
                totalDue,
                paidAmount: 0,
                daysLate: 0,
                lateFee: 0,
                lateFeeForgiven: 0, // Campo nuevo asegurado
                lateFeePaid: 0, // Campo nuevo asegurado
                status: 'pendiente',
                creditPlan: newPlan.id,
              },
              overrideAccess: true,
              req,
            })
          }

          // 8. Matar el Plan Viejo y sus Cuotas
          await payload.update({
            collection: 'creditplan',
            id: oldPlan.id,
            data: { status: 'refinanciado' },
            req,
          })

          for (const inst of unpaidInstallments) {
            await payload.update({
              collection: 'creditinstallment',
              id: inst.id,
              data: { status: 'refinanciada' },
              context: { skipMoraCalculation: true },
              req,
            })
          }

          // 9. Respuesta exitosa con CORS
          return Response.json(
            {
              success: true,
              message: 'Refinanciamiento exitoso',
              newPlanId: newPlan.id,
            },
            {
              status: 200,
              headers: headersWithCors({
                headers: new Headers(),
                req,
              }),
            },
          )
        } catch (error) {
          req.payload.logger.error(`Error refinanciando: ${error}`)
          return Response.json(
            { error: 'Error interno procesando el refinanciamiento', details: error },
            {
              status: 500,
              headers: headersWithCors({
                headers: new Headers(),
                req,
              }),
            },
          )
        }
      },
    },
    {
      path: '/:id/reschedule',
      method: 'post',
      handler: async (req) => {
        try {
          const planId = req.routeParams?.id as string
          const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}

          // Solo necesitamos la nueva fecha de inicio y el nuevo plazo
          const { newTermMonths, startDate, reason } = body

          if (!planId || !newTermMonths || !startDate) {
            return Response.json(
              { error: 'Faltan parámetros requeridos (newTermMonths, startDate)' },
              { status: 400, headers: headersWithCors({ headers: new Headers(), req }) },
            )
          }

          const { payload } = req

          // 1. Obtener el Plan Viejo
          const oldPlan = await payload.findByID({
            collection: 'creditplan',
            id: planId,
            req,
          })

          if (!oldPlan || oldPlan.status !== 'activo') {
            return Response.json(
              {
                error: `El plan está '${oldPlan?.status || 'no encontrado'}' y no puede reprogramarse. Debe estar 'activo'.`,
              },
              { status: 400, headers: headersWithCors({ headers: new Headers(), req }) },
            )
          }

          // 2. Obtener cuotas vivas
          const { docs: unpaidInstallments } = await payload.find({
            collection: 'creditinstallment',
            where: {
              and: [{ creditPlan: { equals: planId } }, { status: { not_equals: 'pagada' } }],
            },
            pagination: false,
            req,
          })

          if (unpaidInstallments.length === 0) {
            return Response.json(
              { error: 'No hay cuotas pendientes para reprogramar' },
              { status: 400, headers: headersWithCors({ headers: new Headers(), req }) },
            )
          }

          // 3. ✨ REGLA DE NEGOCIO: VALIDAR MORA Y CALCULAR CAPITAL PENDIENTE ✨
          let remainingPrincipal = 0
          let pendingLateFees = 0

          for (const inst of unpaidInstallments) {
            // Verificamos si hay mora viva
            const moraViva =
              (inst.lateFee || 0) - (inst.lateFeeForgiven || 0) - (inst.lateFeePaid || 0)
            if (moraViva > 0) pendingLateFees += moraViva

            // El saldo a reprogramar es el capital puro menos lo que ya se haya pagado de ese capital
            const capitalPendiente = inst.principal - (inst.paidAmount || 0)
            remainingPrincipal += capitalPendiente
          }

          // Bloqueo estricto: No se reprograma a deudores con mora activa
          if (pendingLateFees > 0) {
            return Response.json(
              {
                error: `El cliente tiene $${pendingLateFees} de mora pendiente. Debe cancelar o condonar la mora antes de reprogramar.`,
              },
              { status: 400, headers: headersWithCors({ headers: new Headers(), req }) },
            )
          }

          // 4. Crear el NUEVO Plan (Matemática de Interés Simple Mensual)
          const interestRate = oldPlan.interestRate
          const decimalRate = interestRate / 100

          const totalInterest = remainingPrincipal * decimalRate * newTermMonths
          const totalConInteres = remainingPrincipal + totalInterest
          const newMonthlyPayment = Math.round((totalConInteres / newTermMonths) * 100) / 100

          const newPlan = await payload.create({
            collection: 'creditplan',
            data: {
              creditPlanNumber: '',
              finalSale:
                typeof oldPlan.finalSale === 'object' ? oldPlan.finalSale?.id : oldPlan.finalSale,
              amountToFinance: Math.round(remainingPrincipal * 100) / 100, // Capital puro
              monthlyPayment: newMonthlyPayment,
              startDate: startDate,
              termMonths: newTermMonths,
              interestRate: interestRate, // Se mantiene la tasa original
              parentPlan: oldPlan.id,
              refinancingReason: reason,
              totalPaid: 0,
              remainingBalance: Math.max(0, Math.round(totalConInteres * 100) / 100),
              lateFeeRate: oldPlan.lateFeeRate,
              status: 'activo',
            },
            req,
          })

          // 5. Generar las nuevas cuotas
          const baseDate = new Date(startDate)
          if (isNaN(baseDate.getTime())) throw new Error('Fecha de inicio inválida')

          let balance = remainingPrincipal

          for (let i = 1; i <= newTermMonths; i++) {
            const currentDueDate = addMonths(baseDate, i)

            const interest = Math.round(remainingPrincipal * decimalRate * 100) / 100
            let principal = Math.round((newMonthlyPayment - interest) * 100) / 100

            // Ajuste última cuota para balance 0 absoluto
            if (i === newTermMonths) {
              principal = balance
            }

            const totalDue = Math.round((principal + interest) * 100) / 100
            balance = Math.round((balance - principal) * 100) / 100

            await payload.create({
              collection: 'creditinstallment',
              data: {
                installmentNumber: i,
                dueDate: currentDueDate.toISOString(),
                principal,
                interest,
                totalDue,
                paidAmount: 0,
                daysLate: 0,
                lateFee: 0,
                lateFeeForgiven: 0, // Campo nuevo
                lateFeePaid: 0, // Campo nuevo
                status: 'pendiente',
                creditPlan: newPlan.id,
              },
              // overrideAccess: true, solo si create es false en access, pero en este caso es true, así que no es necesario
              req,
            })
          }

          // 6. Matar el Plan Viejo y sus Cuotas
          await payload.update({
            collection: 'creditplan',
            id: oldPlan.id,
            data: { status: 'reprogramado' }, // Nuevo estado bloqueado
            req,
          })

          for (const inst of unpaidInstallments) {
            await payload.update({
              collection: 'creditinstallment',
              id: inst.id,
              data: { status: 'reprogramada' }, // Estado muerto para el Cron Job
              context: { skipMoraCalculation: true },
              req,
            })
          }

          return Response.json(
            { success: true, message: 'Reprogramación exitosa', newPlanId: newPlan.id },
            { status: 200, headers: headersWithCors({ headers: new Headers(), req }) },
          )
        } catch (error) {
          req.payload.logger.error(`Error reprogramando: ${error}`)
          return Response.json(
            { error: 'Error interno procesando la reprogramación', details: error },
            { status: 500, headers: headersWithCors({ headers: new Headers(), req }) },
          )
        }
      },
    },
  ],
}
