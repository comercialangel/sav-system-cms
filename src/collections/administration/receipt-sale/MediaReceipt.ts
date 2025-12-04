import type { CollectionConfig } from 'payload'

export const MediaReceipt: CollectionConfig = {
  slug: 'mediareceipt',
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
    singular: 'Media (archivo de comprobante de venta)',
    plural: 'Media (archivos de comprobantes de ventas)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediareceipt/${doc.filename}`,
  },
  fields: [],
}
