import type { CollectionConfig } from 'payload'

export const MediaExpenseProcedureSunarp: CollectionConfig = {
  slug: 'mediaexpenseproceduresunarp',
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
    singular: 'Media (costos de trámite SUNARP)',
    plural: 'Media (costos de trámite SUNARP)',
  },
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediaexpenseproceduresunarp/${doc.filename}`,
  },
  fields: [],
}
