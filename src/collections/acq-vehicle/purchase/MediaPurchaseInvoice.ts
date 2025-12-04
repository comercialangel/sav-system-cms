import type { CollectionConfig } from 'payload'

export const MediaPurchaseInvoice: CollectionConfig = {
  slug: 'mediapurchaseinvoice',
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Adquisiciones vehiculares',
  },
  labels: {
    singular: 'Media (comprobante de compra)',
    plural: 'Media (comprobantes de compra)',
  },
  upload: {
    mimeTypes: ['*'],
    // disableLocalStorage: false,
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediapurchaseinvoice/${doc.filename}`,
  },
  fields: [],
}
