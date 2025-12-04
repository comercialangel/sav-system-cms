import type { CollectionConfig } from 'payload'

export const MediaRelocation: CollectionConfig = {
  slug: 'mediarelocation',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Control de inventario vehicular',
  },
  labels: {
    singular: 'Media (Archivos de traslado vehicular)',
    plural: 'Media (Archivos de traslados vehiculares)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediarelocation/${doc.filename}`,
  },
  fields: [],
}
