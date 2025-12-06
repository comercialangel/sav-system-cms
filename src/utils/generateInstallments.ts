// // utils/generateInstallments.ts
// import type { Payload } from 'payload'
// import { addMonths } from 'date-fns'

// export async function generateInstallments(
//   payload: Payload,
//   planId: string,
//   financedAmount: number,
//   termMonths: number,
//   startDate: string | Date,
//   interestRate: number,
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
//   const createdIds: string[] = []

//   try {
//     // CAMBIO CLAVE: secuencial en lugar de Promise.all
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

//       // Crea una por una (nunca falla con WriteConflict)
//       const doc = await payload.create({
//         collection: 'creditinstallment',
//         data: {
//           creditPlan: planId,
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
//       })

//       createdIds.push(doc.id)
//     }

//     // Actualiza la relación hasMany
//     await payload.update({
//       collection: 'creditplan',
//       id: planId,
//       data: { installments: createdIds },
//     })
//   } catch (err) {
//     console.error('Error generando cuotas:', err)
//     // Rollback: borra las cuotas creadas
//     for (const id of createdIds) {
//       try {
//         await payload.delete({ collection: 'creditinstallment', id })
//       } catch {}
//     }
//     throw err
//   }
// }

// utils/generateInstallments.ts
import type { Payload } from 'payload'
import { addMonths } from 'date-fns'

export async function generateInstallments(
  payload: Payload,
  planId: string,
  financedAmount: number,
  termMonths: number,
  startDate: string | Date,
  interestRate: number,
): Promise<void> {
  if (!planId || !financedAmount || !termMonths || !startDate || interestRate == null) {
    throw new Error('Faltan parámetros para generar cuotas')
  }

  const baseDate = new Date(startDate)
  if (isNaN(baseDate.getTime())) {
    throw new Error('Fecha de inicio inválida')
  }

  // Fórmula de la empresa (interés simple lineal)
  const decimalInterestRate = interestRate / 100
  let installmentAmount =
    (financedAmount * decimalInterestRate * termMonths + financedAmount) / termMonths

  // Redondeo a entero más cercano
  installmentAmount = Math.round(installmentAmount)

  let balance = financedAmount

  // Mantenemos este array SOLO para el manejo de errores (Rollback),
  // ya no para actualizar al padre.
  const createdIds: string[] = []

  try {
    // Generación secuencial
    for (let i = 1; i <= termMonths; i++) {
      const interest = Math.round(financedAmount * decimalInterestRate)
      let principal = installmentAmount - interest

      // Ajuste última cuota para balance 0
      if (i === termMonths) {
        principal = balance
      }

      const totalDue = principal + interest
      balance = Math.max(0, balance - principal)

      const dueDate = addMonths(baseDate, i)

      const doc = await payload.create({
        collection: 'creditinstallment',
        data: {
          creditPlan: planId, // <--- Esto es lo único necesario para que el JOIN funcione
          installmentNumber: i,
          dueDate: dueDate.toISOString(),
          principal,
          interest,
          totalDue,
          paidAmount: 0,
          daysLate: 0,
          lateFee: 0,
          status: 'pendiente',
        },
      })

      createdIds.push(doc.id)
    }

    // --- ELIMINADO ---
    // Ya NO hacemos el payload.update de 'creditplan'.
    // Al haber guardado 'creditPlan: planId' en cada cuota,
    // el campo 'join' del padre las detectará automáticamente.

    console.log(`Generadas ${termMonths} cuotas exitosamente para el plan ${planId}`)
  } catch (err) {
    console.error('Error generando cuotas:', err)

    // Rollback: borra las cuotas creadas si algo falló a la mitad
    // (Esta lógica sigue siendo muy útil)
    for (const id of createdIds) {
      try {
        await payload.delete({ collection: 'creditinstallment', id })
      } catch {}
    }
    throw err
  }
}
