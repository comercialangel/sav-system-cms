import type { CollectionConfig } from 'payload'

export const MediaVehicleTax: CollectionConfig = {
  slug: 'mediavehicletax',
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
    singular: 'Media (archivo de impuesto vehicular)',
    plural: 'Media (archivos de impuestos vehiculares)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediavehicletax/${doc.filename}`,
  },
  fields: [],
}
