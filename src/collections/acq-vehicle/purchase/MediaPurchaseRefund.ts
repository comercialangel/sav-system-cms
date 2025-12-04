import type { CollectionConfig } from 'payload'

export const MediaPurchaseRefund: CollectionConfig = {
  slug: 'mediapurchaserefund',
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Adquisiciones vehiculares',
  },
  labels: {
    singular: 'Media (retorno de pago de compra)',
    plural: 'Media (retornos de pagos de compra)',
  },
  upload: {
    mimeTypes: ['*'],
    // disableLocalStorage: false,
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediapurchaserefund/${doc.filename}`,
  },
  fields: [],
}
