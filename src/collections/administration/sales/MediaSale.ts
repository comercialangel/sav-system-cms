import type { CollectionConfig } from 'payload'

export const MediaSale: CollectionConfig = {
  slug: 'mediasale',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Ventas vehiculares',
  },
  labels: {
    singular: 'Media (archivo de venta final)',
    plural: 'Media (archivos de venta final)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediasale/${doc.filename}`,
  },
  fields: [],
}
