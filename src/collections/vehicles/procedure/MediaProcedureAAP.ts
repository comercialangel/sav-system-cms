import type { CollectionConfig } from 'payload'

export const MediaProcedureAAP: CollectionConfig = {
  slug: 'mediaprocedureaap',
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
    singular: 'Media (trámites en AAP)',
    plural: 'Media (trámites en AAP)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediaprocedureaap/${doc.filename}`,
  },
  fields: [],
}
