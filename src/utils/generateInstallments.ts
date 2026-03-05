// // utils/generateInstallments.ts
// import type { Payload, PayloadRequest } from 'payload'
// import { addMonths } from 'date-fns'

// export async function generateInstallments(
//   payload: Payload,
//   planId: string,
//   financedAmount: number,
//   termMonths: number,
//   startDate: string | Date,
//   interestRate: number,
//   req: PayloadRequest,
// ): Promise<void> {
//   if (!planId || !financedAmount || !termMonths || !startDate || interestRate == null) {
//     throw new Error('Faltan parámetros para generar cuotas')
//   }

//   const baseDate = new Date(startDate)
//   if (isNaN(baseDate.getTime())) {
//     throw new Error('Fecha de inicio inválida')
//   }

//   // Fórmula de la empresa (interés simple lineal)
//   const decimalInterestRate = interestRate / 100
//   let installmentAmount =
//     (financedAmount * decimalInterestRate * termMonths + financedAmount) / termMonths

//   // Redondeo a entero más cercano
//   installmentAmount = Math.round(installmentAmount)

//   let balance = financedAmount

//   try {
//     // Generación secuencial
//     for (let i = 1; i <= termMonths; i++) {
//       const interest = Math.round(financedAmount * decimalInterestRate)
//       let principal = installmentAmount - interest

//       // Ajuste última cuota para balance 0
//       if (i === termMonths) {
//         principal = balance
//       }

//       const totalDue = principal + interest
//       balance = Math.max(0, balance - principal)

//       const dueDate = addMonths(baseDate, i)

//       // 2. PASAMOS REQ AL CREATE
//       await payload.create({
//         collection: 'creditinstallment',
//         data: {
//           creditPlan: planId, // Relación física (Padre)
//           installmentNumber: i,
//           dueDate: dueDate.toISOString(),
//           principal,
//           interest,
//           totalDue,
//           paidAmount: 0,
//           daysLate: 0,
//           lateFee: 0,
//           status: 'pendiente',
//         },
//         req,
//       })
//     }
//     console.log(`Generadas ${termMonths} cuotas exitosamente para el plan ${planId}`)
//   } catch (err) {
//     console.error(`Error generando cuotas para el plan ${planId}:`, err)
//     throw err
//   }
// }

// utils/generateInstallments.ts
import type { Payload, PayloadRequest } from 'payload'
import { addMonths } from 'date-fns'

export async function generateInstallments(
  payload: Payload,
  planId: string,
  financedAmount: number,
  termMonths: number,
  startDate: string | Date,
  interestRate: number, // <-- Tasa MENSUAL en porcentaje (ej: 2 para 2% mensual)
  req: PayloadRequest,
): Promise<void> {
  if (!planId || !financedAmount || !termMonths || !startDate || interestRate == null) {
    throw new Error('Faltan parámetros para generar cuotas')
  }

  const baseDate = new Date(startDate)
  if (isNaN(baseDate.getTime())) {
    throw new Error('Fecha de inicio inválida')
  }

  // 1. Fórmula de la empresa (interés simple lineal mensual)
  const decimalInterestRate = interestRate / 100

  // Mantenemos TODOS los decimales durante el cálculo inicial
  const rawInstallmentAmount =
    (financedAmount * decimalInterestRate * termMonths + financedAmount) / termMonths

  // ✨ AJUSTE 1: Redondeo exacto a 2 decimales (Céntimos/Centavos)
  const installmentAmount = Math.round(rawInstallmentAmount * 100) / 100

  let balance = financedAmount

  try {
    // Generación secuencial
    for (let i = 1; i <= termMonths; i++) {
      // Calculamos el interés fijo por cuota a 2 decimales
      const interest = Math.round(financedAmount * decimalInterestRate * 100) / 100
      let principal = Math.round((installmentAmount - interest) * 100) / 100

      // Ajuste última cuota para balance 0 absoluto
      if (i === termMonths) {
        principal = balance
      }

      const totalDue = Math.round((principal + interest) * 100) / 100
      balance = Math.round((balance - principal) * 100) / 100

      const dueDate = addMonths(baseDate, i)

      // 2. PASAMOS REQ AL CREATE
      await payload.create({
        collection: 'creditinstallment',
        data: {
          creditPlan: planId, // Relación física (Padre)
          installmentNumber: i,
          dueDate: dueDate.toISOString(),
          principal,
          interest,
          totalDue,
          paidAmount: 0,
          daysLate: 0,
          lateFee: 0,
          lateFeeForgiven: 0, // ✨ AJUSTE 3: Nuevos campos en cero
          lateFeePaid: 0, // ✨ AJUSTE 3: Nuevos campos en cero
          status: 'pendiente',
        },
        req, // <--- MAGIA: Esto une la creación a la transacción global
        overrideAccess: true, // ✨ AJUSTE 2: Bypassea la restricción de create: () => false
      })
    }

    payload.logger.info(`Generadas ${termMonths} cuotas exitosamente para el plan ${planId}`)
  } catch (err) {
    payload.logger.error(`Error generando cuotas para el plan ${planId}: ${err}`)

    // ADIÓS ROLLBACK MANUAL
    // Al lanzar el error, Payload le dirá a la Base de Datos: "¡Abortar Transacción!"
    throw err
  }
}
