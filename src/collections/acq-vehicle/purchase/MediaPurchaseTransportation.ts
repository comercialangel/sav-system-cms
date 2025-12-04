import type { CollectionConfig } from 'payload'

export const MediaPurchaseTransportation: CollectionConfig = {
  slug: 'mediapurchasetransportation',
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Adquisiciones vehiculares',
  },
  labels: {
    singular: 'Media (traslado de compra)',
    plural: 'Media (traslados de compra)',
  },
  upload: {
    mimeTypes: ['*'],
    // disableLocalStorage: false,
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediapurchasetransportation/${doc.filename}`,
  },
  fields: [],
}
