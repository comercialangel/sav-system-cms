import type { CollectionConfig } from 'payload'

export const MediaEquipment: CollectionConfig = {
  slug: 'mediaequipment',
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
    singular: 'Media (equipamiento vehicular)',
    plural: 'Media (equipamiento vehicular)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediaequipment/${doc.filename}`,
  },
  fields: [],
}
