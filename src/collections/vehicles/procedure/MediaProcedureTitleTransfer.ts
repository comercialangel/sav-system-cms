import type { CollectionConfig } from 'payload'

export const MediaProcedureTitleTransfer: CollectionConfig = {
  slug: 'mediaproceduretitletransfer',
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
    singular: 'Media (trámite por transferencia de titularidad vehicular)',
    plural: 'Media (trámites por transferencia de titularidad vehicular)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediaproceduretitletransfer/${doc.filename}`,
  },
  fields: [],
}
