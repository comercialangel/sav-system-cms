// // src/utils/generateSequence.ts
// import type { Payload } from 'payload'

// export async function generateSequence(
//   payload: Payload,
//   options: {
//     name: string // ej: 'purchase', 'sale', 'quote'
//     year?: number // si no pasas nada usa el año actual
//     prefix: string // ej: 'COM-', 'VEN-', 'COT-'
//     padding?: number // cuántos dígitos (6 por defecto)
//   },
// ): Promise<string> {
//   const { name, prefix, padding = 6 } = options
//   const year = options.year ?? new Date().getFullYear()

//   const counterName = `${name}-${year}`

//   const counterDoc = await payload.db.collections['counters'].findOneAndUpdate(
//     { name: counterName },
//     {
//       $inc: { value: 1 },
//       $max: { value: 1 }, // asegura que nunca baje de 1
//     },
//     {
//       upsert: true,
//       new: true,
//       setDefaultsOnInsert: true,
//     },
//   )

//   const sequence = counterDoc.value as number

//   return `${prefix}${year}-${String(sequence).padStart(padding, '0')}`
// }

// src/utils/generateSequence.ts
import type { Payload } from 'payload'

export async function generateSequence(
  payload: Payload,
  options: {
    name: string
    prefix: string
    year?: number | null
    padding?: number
  },
): Promise<string> {
  const { name, prefix, padding = 6 } = options
  const year = options.year ?? new Date().getFullYear()
  const counterName = year ? `${name}-${year}` : name
  const yearPart = year ? `${year}-` : ''

  // Usamos un pipeline de actualización para evitar el conflicto
  const result = await payload.db.collections['counters'].findOneAndUpdate(
    { name: counterName },
    [
      {
        $set: {
          value: {
            $cond: [
              { $not: ['$value'] }, // si no existe o es null
              1,
              { $add: ['$value', 1] }, // si existe, suma 1
            ],
          },
        },
      },
    ],
    {
      upsert: true,
      returnDocument: 'after', // importante: devuelve el documento actualizado
      includeResultMetadata: false,
    },
  )

  // result es el documento completo después del update
  const sequence = (result as any).value as number

  return `${prefix}${yearPart}${String(sequence).padStart(padding, '0')}`
}
