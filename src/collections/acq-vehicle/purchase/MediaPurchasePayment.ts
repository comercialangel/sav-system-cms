import type { CollectionConfig } from 'payload'

export const MediaPurchasePayment: CollectionConfig = {
  slug: 'mediapurchasepayment',
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Adquisiciones vehiculares',
  },
  labels: {
    singular: 'Media (pago de compra)',
    plural: 'Media (pagos de compra)',
  },
  upload: {
    mimeTypes: ['*'],
    // disableLocalStorage: false,
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediapurchasepayment/${doc.filename}`,
  },
  fields: [],
}
