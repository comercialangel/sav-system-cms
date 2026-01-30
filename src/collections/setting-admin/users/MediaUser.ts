import type { CollectionConfig } from 'payload'

export const MediaUser: CollectionConfig = {
  slug: 'mediauser',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Usuarios del sistema SAV',
  },
  labels: {
    singular: 'Media (Foto de usuario)',
    plural: 'Media (Fotos de usuarios)',
  },
  upload: {
    mimeTypes: ['image/*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediauser/${doc.filename}`,
  },
  fields: [],
}
