import type { CollectionConfig } from 'payload'

export const MediaInfraction: CollectionConfig = {
  slug: 'mediainfraction',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Impuestos e infracciones de tránsito vehiculares',
  },
  labels: {
    singular: 'Media (archivo de infracción vehicular)',
    plural: 'Media (archivos de infracciones vehiculares)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediainfraction/${doc.filename}`,
  },
  fields: [],
}
