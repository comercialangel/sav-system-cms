import type { CollectionConfig } from 'payload'

export const MediaExpenseProcedureAAP: CollectionConfig = {
  slug: 'mediaexpenseprocedureaap',
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
    singular: 'Media (costos de trámite AAP)',
    plural: 'Media (costos de trámite AAP)',
  },
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediaexpenseprocedureaap/${doc.filename}`,
  },
  fields: [],
}
