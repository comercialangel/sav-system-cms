import type { CollectionConfig } from 'payload'

export const MediaTransferSale: CollectionConfig = {
  slug: 'mediatransfersale',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Transferencias de unidades vehiculares',
  },
  labels: {
    singular: 'Media (archivo de transferencia)',
    plural: 'Media (archivos de transferencias)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediatransfersale/${doc.filename}`,
  },
  fields: [],
}
