import type { CollectionConfig } from 'payload'

export const MediaRenewal: CollectionConfig = {
  slug: 'mediarenewal',
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
    singular: 'Media (renovación de GPS)',
    plural: 'Media (renovaciones de GPS)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediarenewal/${doc.filename}`,
  },
  fields: [],
}
