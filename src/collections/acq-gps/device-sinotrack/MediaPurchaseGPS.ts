import type { CollectionConfig } from 'payload'

export const MediaPurchaseGPS: CollectionConfig = {
  slug: 'mediapurchasegps',
  access: {
    read: () => true,
  },
  admin: {
    group: "Adquisiciones de GPS y SIM's",
  },
  labels: {
    singular: 'Archivo de compra GPS',
    plural: 'Archivos de compras GPS',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediapurchasegps/${doc.filename}`,
  },
  fields: [],
}
