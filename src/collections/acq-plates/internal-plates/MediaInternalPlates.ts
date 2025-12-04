import type { CollectionConfig } from 'payload'

export const MediaInternalPlates: CollectionConfig = {
  slug: 'mediainternalplates',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Adquisición de placas de exhibición',
  },
  labels: {
    singular: 'Media (placa de exhibición interna)',
    plural: 'Media (placas de exhibición intenas)',
  },
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediainternalplates/${doc.filename}`,
  },
  fields: [],
}
