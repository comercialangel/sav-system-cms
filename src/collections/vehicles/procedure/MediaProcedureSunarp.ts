import type { CollectionConfig } from 'payload'

export const MediaProcedureSunarp: CollectionConfig = {
  slug: 'mediaproceduresunarp',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Trámites vehiculares',
  },
  labels: {
    singular: 'Media (otros trámites SUNARP)',
    plural: 'Media (otros trámites SUNARP)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediaproceduresunarp/${doc.filename}`,
  },
  fields: [],
}
