// collections/ReceiptCreditPayment.ts
import { generateSequence } from '@/utils/generateSequence'
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
      async ({ data, operation, req }) => {
        const { payload } = req

        // if (user) {
        //   if (operation === 'create') data.createdBy = user.id
        //   data.updatedBy = user.id
        // }

        if (operation === 'create' && !data.receiptNumber) {
          data.receiptNumber = await generateSequence(payload, {
            name: 'receiptcreditpayment', // Diferenciador en counters
            prefix: 'REC-', // Resultado: REC-2025-000001
            padding: 6,
          })
        }
        return data
      },
    ],
  },
}
