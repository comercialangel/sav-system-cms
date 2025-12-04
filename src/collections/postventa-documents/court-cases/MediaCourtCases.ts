import type { CollectionConfig } from 'payload'

export const MediaCourtCases: CollectionConfig = {
  slug: 'mediacourtcases',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Casos judiciales de vehículos',
  },
  labels: {
    singular: 'Media (archivo de caso judicial)',
    plural: 'Media (archivos de casos judiciales)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediacourtcases/${doc.filename}`,
  },
  fields: [],
}
