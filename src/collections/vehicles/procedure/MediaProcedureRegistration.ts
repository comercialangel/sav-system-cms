import type { CollectionConfig } from 'payload'

export const MediaProcedureRegistration: CollectionConfig = {
  slug: 'mediaprocedureregistration',
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
    singular: 'Media (trámite de inscripción vehicular)',
    plural: 'Media (trámites de inscripción vehicular)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediaprocedureregistration/${doc.filename}`,
  },
  fields: [],
}
