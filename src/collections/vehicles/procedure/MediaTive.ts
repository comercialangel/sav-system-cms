import type { CollectionConfig } from 'payload'

export const MediaTive: CollectionConfig = {
  slug: 'mediative',
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
    singular: 'Media (TIVE)',
    plural: "Media (TIVE's)",
  },
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediative/${doc.filename}`,
  },
  fields: [],
}
