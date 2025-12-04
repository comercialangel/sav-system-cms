import type { CollectionConfig } from 'payload'

export const MediaPlates: CollectionConfig = {
  slug: 'mediaplates',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Unidades vehiculares',
  },
  labels: {
    singular: 'Media (placas de rodaje)',
    plural: 'Media (placas de rodaje)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediaplates/${doc.filename}`,
  },
  fields: [],
}
