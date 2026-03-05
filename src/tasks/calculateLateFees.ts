// src/tasks/calculateLateFeesHandler.ts
import type { TaskHandler } from 'payload'

export type LateFeesTaskIO = {
  input: Record<string, never>
  output: {
    processedInstallments: number
    updatedPlans: number
  }
}

export const calculateLateFeesHandler: TaskHandler<LateFeesTaskIO> = async ({ req }) => {
  const { payload } = req
  payload.logger.info('Iniciando cálculo diario de mora...')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let processed = 0
  let updatedPlansCount = 0

  try {
    const pendingInstallments = await payload.find({
      collection: 'creditinstallment',
      where: {
        status: { in: ['pendiente', 'parcial', 'vencida'] },
        dueDate: { less_than: today.toISOString() },
      },
      pagination: false,
      req,
    })

    //CAMBIO 1: El caché ahora se llama 'planCache' y guarda un objeto con { rate, status }
    const planCache = new Map<string, { rate: number; status: string }>()

    //OPTIMIZACIÓN 2: Almacenar solo los IDs de los planes que realmente tienen cuotas vencidas hoy
    const plansWithLateInstallments = new Set<string>()

    for (const inst of pendingInstallments.docs) {
      const dueDate = new Date(inst.dueDate)
      dueDate.setHours(0, 0, 0, 0)

      const currentDaysLate = Math.floor(
        (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24),
      )
      const daysMissed = currentDaysLate - (inst.daysLate || 0)

      if (daysMissed > 0) {
        const planId = typeof inst.creditPlan === 'object' ? inst.creditPlan.id : inst.creditPlan

        //CAMBIO 2: Buscamos en el nuevo caché y guardamos tanto la tasa como el estado
        if (!planCache.has(planId)) {
          const plan = await payload.findByID({ collection: 'creditplan', id: planId, req })
          planCache.set(planId, {
            rate: plan?.lateFeeRate || 0.01,
            status: plan?.status || 'activo',
          })
        }

        const cachedPlan = planCache.get(planId)!

        //CAMBIO 3: EL CONGELADOR DE MORA (La Magia)
        // Si el plan está incautado o liquidado, ignoramos esta cuota y pasamos a la siguiente del bucle
        if (cachedPlan.status === 'en_recuperacion' || cachedPlan.status === 'liquidado') {
          continue
        }

        const dailyRate = cachedPlan.rate

        const debtForThisInstallment = inst.totalDue - (inst.paidAmount || 0)
        const accruedMora = debtForThisInstallment * dailyRate * daysMissed
        const newLateFee = Math.round(((inst.lateFee || 0) + accruedMora) * 100) / 100

        await payload.update({
          collection: 'creditinstallment',
          id: inst.id,
          data: {
            daysLate: currentDaysLate,
            lateFee: newLateFee,
            status: 'vencida',
          },
          context: { skipMoraCalculation: true },
          req,
        })

        processed++
        // Anotamos que este plan tiene al menos una cuota vencida
        plansWithLateInstallments.add(planId)
      }
    }

    //OPTIMIZACIÓN 3: Evaluar usando el caché de la memoria RAM (0 consultas extra a la BD)
    for (const planId of plansWithLateInstallments) {
      const cachedPlan = planCache.get(planId)

      // Si el plan estaba 'activo', lo pasamos a 'moroso'.
      if (cachedPlan && cachedPlan.status === 'activo') {
        await payload.update({
          collection: 'creditplan',
          id: planId,
          data: { status: 'moroso' },
          req,
        })
        updatedPlansCount++
        // Actualizamos nuestro caché por si acaso (buena práctica)
        cachedPlan.status = 'moroso'
      }
    }
    payload.logger.info(
      `Cálculo de mora finalizado. Cuotas procesadas: ${processed}. Planes actualizados a morosos: ${updatedPlansCount}.`,
    )

    return {
      output: {
        processedInstallments: processed,
        updatedPlans: updatedPlansCount,
      },
    }
  } catch (error) {
    payload.logger.error(`Error en CalculateLateFeesTask: ${error}`)
    throw error
  }
}
