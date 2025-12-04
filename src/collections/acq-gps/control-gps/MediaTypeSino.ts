import type { CollectionConfig } from 'payload'

export const MediaTypeSino: CollectionConfig = {
  slug: 'mediatypesino',
  access: {
    read: () => true,
  },
  admin: {
    group: "Adquisiciones de GPS y SIM's",
  },
  labels: {
    singular: 'Media (modelo de Sinotrack)',
    plural: 'Media (modelos de Sinotrack)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediatypesino/${doc.filename}`,
  },
  fields: [],
}
