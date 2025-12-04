import type { CollectionConfig } from 'payload'

export const MediaReferenceImage: CollectionConfig = {
  slug: 'mediareferenceimage',
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
    singular: 'Media (Imagen vehicular referencial)',
    plural: 'Media (Imágenes vehiculares referenciales)',
  },
  upload: {
    mimeTypes: ['image/*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediareferenceimage/${doc.filename}`,
  },
  fields: [],
}
