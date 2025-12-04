import type { CollectionConfig } from 'payload'

export const MediaNotification: CollectionConfig = {
  slug: 'medianotification',
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
    singular: 'Media (archivo de notificación)',
    plural: 'Media (archivos de notificaciones)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/medianotification/${doc.filename}`,
  },
  fields: [],
}
