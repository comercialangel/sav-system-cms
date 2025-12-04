import type { CollectionConfig } from 'payload'

export const MediaDownPayment: CollectionConfig = {
  slug: 'mediasaledownpayment',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Ventas vehiculares',
  },
  labels: {
    singular: 'Media (voucher de inical de venta a crédito)',
    plural: 'Media (vouchers de iniciales de ventas a crédito)',
  },
  upload: {
    mimeTypes: ['image/*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediasaledownpayment/${doc.filename}`,
  },
  fields: [],
}
