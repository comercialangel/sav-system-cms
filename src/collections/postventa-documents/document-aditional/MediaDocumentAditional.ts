import type { CollectionConfig } from 'payload'

export const MediaDocumentAditional: CollectionConfig = {
  slug: 'mediadocumentaditional',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Notificaciones y otros documentos adicionales',
  },
  labels: {
    singular: 'Media (archivo de documento adicional)',
    plural: 'Media (archivos de documentos adicionales)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediadocumentaditional/${doc.filename}`,
  },
  fields: [],
}
