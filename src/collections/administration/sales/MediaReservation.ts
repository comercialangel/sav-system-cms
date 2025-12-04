import type { CollectionConfig } from 'payload'

export const MediaReservation: CollectionConfig = {
  slug: 'mediareservation',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Ventas vehiculares',
  },
  labels: {
    singular: 'Media (archivo de reservación vehicular)',
    plural: 'Media (archivos de reservaciones vehiculares)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediareservation/${doc.filename}`,
  },
  fields: [],
}
