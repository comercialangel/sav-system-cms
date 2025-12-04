import type { CollectionConfig } from 'payload'

export const MediaVehicleDelivery: CollectionConfig = {
  slug: 'mediavehicledelivery',
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Entregas y devoluciones',
  },
  labels: {
    singular: 'Media (entrega vehicular)',
    plural: 'Media (entrega vehicular)',
  },
  upload: {
    mimeTypes: ['*'],
    // disableLocalStorage: false,
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediavehicledelivery/${doc.filename}`,
  },
  fields: [],
}
