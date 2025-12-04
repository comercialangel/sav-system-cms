import type { CollectionConfig } from 'payload'

export const MediaVehicle: CollectionConfig = {
  slug: 'mediavehicle',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Unidades vehiculares',
  },
  labels: {
    singular: 'Media (vehículo)',
    plural: 'Media (vehículos)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediavehicle/${doc.filename}`,
  },
  fields: [],
}
