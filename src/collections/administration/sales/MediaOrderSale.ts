import type { CollectionConfig } from 'payload'

export const MediaOrderSale: CollectionConfig = {
  slug: 'mediaordersale',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Ventas vehiculares',
  },
  labels: {
    singular: 'Media (archivo de pedido vehicular)',
    plural: 'Media (archivos de pedidos vehiculares)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediaordersale/${doc.filename}`,
  },
  fields: [],
}
