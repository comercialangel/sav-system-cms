import type { CollectionConfig } from 'payload'

export const MediaCollaborator: CollectionConfig = {
  slug: 'mediacollaborator',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Recursos Humanos',
  },
  labels: {
    singular: 'Media (Foto de colaborador)',
    plural: 'Media (Fotos de colaboradores)',
  },
  upload: {
    mimeTypes: ['image/*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediacollaborator/${doc.filename}`,
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
