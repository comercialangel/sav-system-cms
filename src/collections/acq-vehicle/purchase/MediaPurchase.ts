import type { CollectionConfig } from 'payload'

export const MediaPurchase: CollectionConfig = {
  slug: 'mediapurchase',
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Adquisiciones vehiculares',
  },
  labels: {
    singular: 'Media (compra)',
    plural: 'Media (compra)',
  },
  upload: {
    mimeTypes: ['*'],
    // disableLocalStorage: false,
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediapurchase/${doc.filename}`,
  },
  fields: [],
}
