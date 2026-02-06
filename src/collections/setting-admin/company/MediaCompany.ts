import type { CollectionConfig } from 'payload'

export const MediaCompany: CollectionConfig = {
  slug: 'mediacompany',
  admin: {
    group: 'Configuraciones de administración',
  },
  labels: {
    singular: 'Media (Logo de compañía)',
    plural: 'Media (Logos de Compañias)',
  },
  upload: {
    // staticDir: 'https://storage.cloud.google.com/mediasav/mediacompany',
    mimeTypes: ['image/*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediacompany/${doc.filename}`,
  },
  fields: [
    {
      type: 'relationship',
      name: 'createdBy',
      label: 'Creado por',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
        allowEdit: false,
      },
    },
    {
      type: 'relationship',
      name: 'updatedBy',
      label: 'Actualizado por',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
        allowEdit: false,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        if (req.user) {
          if (operation === 'create') {
            data.createdBy = req.user.id
          }
          data.updatedBy = req.user.id
        }
        return data
      },
    ],
  },
}
