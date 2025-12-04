import type { CollectionConfig } from 'payload'

export const MediaInternalSale: CollectionConfig = {
  slug: 'mediainternalsale',
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
    singular: 'Media (archivo de venta interna)',
    plural: 'Media (archivos de ventas internas)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediainternalsale/${doc.filename}`,
  },
  fields: [],
}
