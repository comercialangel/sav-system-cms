import type { CollectionConfig } from 'payload'

export const MediaGPS: CollectionConfig = {
  slug: 'mediagps',
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
  },
  admin: {
    group: "Adquisiciones de GPS y SIM's",
  },
  labels: {
    singular: 'Media (control GPS)',
    plural: 'Media (control GPS)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediagps/${doc.filename}`,
  },
  fields: [],
}
