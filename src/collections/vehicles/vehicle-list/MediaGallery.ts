import type { CollectionConfig } from 'payload'

export const MediaGallery: CollectionConfig = {
  slug: 'mediagallery',
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
    singular: 'Media (gGalería de imagen vehicular)',
    plural: 'Media (galería de imágenes vehiculares)',
  },
  upload: {
    mimeTypes: ['image/*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediagallery/${doc.filename}`,
  },
  fields: [],
}
