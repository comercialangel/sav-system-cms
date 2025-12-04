import type { CollectionConfig } from 'payload'

export const MediaInstallation: CollectionConfig = {
  slug: 'mediainstallation',
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
  },
  admin: {
    group: "Adquisiciones de GPS y SIM's",
  },
  labels: {
    singular: 'Media (pago de instalación GPS)',
    plural: 'Media (pagos de instalación GPS)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediainstallation/${doc.filename}`,
  },
  fields: [],
}
