import type { CollectionConfig } from 'payload'

export const MediaRegistration: CollectionConfig = {
  slug: 'mediaregistration',
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
    singular: 'Media (asiento de inscripción vehicular)',
    plural: 'Media (asiento de inscripción vehicular)',
  },
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediaregistration/${doc.filename}`,
  },
  fields: [],
}
