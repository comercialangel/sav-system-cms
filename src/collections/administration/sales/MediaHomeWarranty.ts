import type { CollectionConfig } from 'payload'

export const MediaHomeWarranty: CollectionConfig = {
  slug: 'mediahomewarranty',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Ventas vehiculares',
  },
  labels: {
    singular: 'Media (archivo de garantía inmobiliaria)',
    plural: 'Media (archivos de garantías inmobiliarias)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediahomewarranty/${doc.filename}`,
  },
  fields: [],
}
