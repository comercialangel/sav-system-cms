import type { CollectionConfig } from 'payload'

export const MediaBuyer: CollectionConfig = {
  slug: 'mediabuyer',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Compradores (Clientes externos)',
  },
  labels: {
    singular: 'Media (foto de comprador)',
    plural: 'Media (fotos de compradores)',
  },
  upload: {
    mimeTypes: ['image/*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediabuyer/${doc.filename}`,
  },
  fields: [],
}
