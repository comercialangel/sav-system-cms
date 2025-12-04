import type { CollectionConfig } from 'payload'

export const MediaGPSCancellation: CollectionConfig = {
  slug: 'mediagpscancellation',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: "Adquisiciones de GPS y SIM's",
  },
  labels: {
    singular: 'Media (cancelación de GPS)',
    plural: 'Media (cancelaciones de GPS)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediagpscancellation/${doc.filename}`,
  },
  fields: [],
}
