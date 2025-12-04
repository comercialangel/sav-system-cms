// collections/ReceiptCreditPayment.ts
import type { CollectionConfig } from 'payload'

export const ReceiptCreditPayment: CollectionConfig = {
  slug: 'receiptcreditpayment',
  access: {
    read: () => true,
    create: () => false, // SOLO desde CreditPayment
    update: () => false,
    delete: () => false,
  },
  admin: {
    useAsTitle: 'receiptNumber',
    group: 'Créditos',
  },
  labels: { singular: 'Recibo de Pago', plural: 'Recibos de Pago' },
  fields: [
    // === NÚMERO DE RECIBO (único y seguro) ===
    {
      name: 'receiptNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: { readOnly: true },
    },

    // === RELACIÓN CON PAGO ===
    {
      name: 'creditPayment',
      type: 'relationship',
      relationTo: 'creditpayment',
      required: true,
      hasMany: false,
      index: true,
      admin: { readOnly: true, position: 'sidebar' },
    },

    // === FECHA DE EMISIÓN ===
    {
      name: 'issueDate',
      label: 'Fecha de emisión',
      type: 'date',
      required: true,
      admin: { readOnly: true },
    },

    // === TOTAL PAGADO ===
    {
      name: 'totalPaid',
      label: 'Total pagado',
      type: 'number',
      defaultValue: 0,
      required: true,
      admin: { readOnly: true },
    },

    // === DETALLE DE CUOTAS APLICADAS ===
    {
      name: 'appliedDetails',
      type: 'array',
      required: true,
      admin: { readOnly: true },
      fields: [
        {
          name: 'installment',
          type: 'relationship',
          relationTo: 'creditinstallment',
          required: true,
          hasMany: false,
        },
        {
          name: 'installmentNumber',
          type: 'number',
          required: true,
          admin: { readOnly: true },
        },
        {
          name: 'amountApplied',
          type: 'number',
          defaultValue: 0,
          required: true,
          admin: { readOnly: true },
        },
        {
          name: 'statusBefore',
          type: 'text',
          required: true,
          admin: { readOnly: true },
        },
        {
          name: 'statusAfter',
          type: 'text',
          required: true,
          admin: { readOnly: true },
        },
      ],
    },

    // === MÉTODOS DE PAGO ===
    {
      name: 'paymentMethods',
      type: 'array',
      required: true,
      admin: { readOnly: true },
      fields: [
        {
          name: 'typePayment',
          type: 'relationship',
          relationTo: 'typepayment',
          required: true,
        },
        {
          name: 'amount',
          type: 'number',
          required: true,
        },
        {
          name: 'typeCurrency',
          type: 'relationship',
          relationTo: 'typecurrency',
          required: true,
        },
        {
          name: 'account',
          type: 'relationship',
          relationTo: 'accountcompany',
        },
        {
          name: 'operationNumber',
          type: 'text',
        },
        {
          name: 'voucher',
          type: 'upload',
          relationTo: 'mediasale',
        },
      ],
    },

    // === ESTADO ===
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'emitido',
      options: ['emitido', 'anulado'],
      admin: { readOnly: true, position: 'sidebar' },
    },

    // === OBSERVACIONES ===
    { name: 'observations', type: 'textarea', admin: { readOnly: true } },
  ],

  hooks: {
    beforeChange: [
      // === GENERAR receiptNumber SEGURO (sin duplicados) ===
      async ({ data, operation, req: { payload } }) => {
        if (operation === 'create' && !data.receiptNumber) {
          const now = new Date()
          const year = now.getFullYear()
          const prefix = `REC-${year}-`

          const last = await payload.find({
            collection: 'receiptcreditpayment',
            where: { receiptNumber: { like: prefix } },
            sort: '-receiptNumber',
            limit: 1,
          })

          let next = 1
          if (last.docs.length > 0) {
            const match = last.docs[0].receiptNumber.match(/REC-\d+-(\d+)/)
            if (match) next = parseInt(match[1]) + 1
          }

          data.receiptNumber = `${prefix}${String(next).padStart(6, '0')}`
        }
        return data
      },
    ],
  },
}
