import type { CollectionConfig } from 'payload'

export const MediaReleaseDocument: CollectionConfig = {
  slug: 'mediareleasedocument',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Post-Venta y Legales',
  },
  labels: {
    singular: 'Media (documento de liberación)',
    plural: 'Media (documentos de liberación)',
  },
  upload: {
    mimeTypes: ['image/*, application/pdf'], // Permitir imágenes y PDFs
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediareleasedocument/${doc.filename}`,
  },
  fields: [],
}
