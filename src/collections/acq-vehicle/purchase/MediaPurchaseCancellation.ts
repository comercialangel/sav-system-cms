import type { CollectionConfig } from 'payload'

export const MediaPurchaseCancellation: CollectionConfig = {
  slug: 'mediapurchasecancellation',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Adquisiciones vehiculares',
  },
  labels: {
    singular: 'Media (cancelación de compra)',
    plural: 'Media (cancelación de compra)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediapurchasecancellation/${doc.filename}`,
  },
  fields: [],
}
