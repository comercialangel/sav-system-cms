import type { CollectionConfig } from 'payload'

export const MediaJudicialOrder: CollectionConfig = {
  slug: 'mediajudicialorder',
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
    singular: 'Media (orden judicial)',
    plural: 'Media (órdenes judiciales)',
  },
  upload: {
    mimeTypes: ['image/*, application/pdf'], // Permitir imágenes y PDFs
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediajudicialorder/${doc.filename}`,
  },
  fields: [],
}
