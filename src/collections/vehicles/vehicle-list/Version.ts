import type { CollectionConfig } from 'payload'

export const Version: CollectionConfig = {
  slug: 'version',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'version',
    group: 'Unidades vehiculares',
  },
  labels: {
    singular: 'Versión',
    plural: 'Versiones',
  },
  fields: [
    {
      name: 'model',
      label: 'Modelo',
      type: 'relationship',
      relationTo: 'model',
      required: true,
      admin: {
        allowCreate: true,
      },
    },
    {
      name: 'version',
      label: 'Versión',
      type: 'text',
      required: true,
      unique: false,
    },
    {
      name: 'modelversion',
      label: 'Modelo/Version',
      type: 'text',
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            interface AccountData {
              model: string
              version: string
            }
            const typedata = data as AccountData

            if (typedata.model && typedata.version) {
              let modelName = ''

              // Obtener el nombre de la compañía
              const model = await req.payload.findByID({
                collection: 'model',
                id: typedata.model,
              })
              if (model) {
                modelName = model.model || '' // Supongamos que 'name' es el campo en 'company'
              }

              // Formatear la información combinada
              return `${modelName} ${typedata.version}`
            }
          },
        ],
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      required: true,
      admin: {
        position: 'sidebar',
      },
      options: [
        {
          label: 'Activo',
          value: 'activo',
        },
        {
          label: 'Inactivo',
          value: 'inactivo',
        },
      ],
      defaultValue: 'activo',
    },
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
