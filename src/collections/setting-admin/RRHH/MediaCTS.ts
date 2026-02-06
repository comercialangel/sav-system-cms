import type { CollectionConfig } from 'payload'

export const MediaCTS: CollectionConfig = {
  slug: 'mediacts',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Recursos Humanos',
  },
  labels: {
    singular: 'Media (Archivo CTS)',
    plural: 'Media (Archivos CTS)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediacts/${doc.filename}`,
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
