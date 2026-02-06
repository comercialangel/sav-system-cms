import type { CollectionConfig } from 'payload'

export const Establishment: CollectionConfig = {
  slug: 'establishment',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'establishmentname',
    group: 'Configuraciones de administración',
  },
  labels: {
    singular: 'Establecimiento',
    plural: 'Establecimientos',
  },
  fields: [
    {
      name: 'establishmentname',
      label: 'Nombre del establecimiento',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'departamento',
          label: 'Departamento',
          type: 'relationship',
          relationTo: 'departamento',
          required: true,
          hasMany: false,
          admin: {
            width: '33%',
            allowCreate: false,
          },
        },
        {
          name: 'provincia',
          label: 'Provincia',
          type: 'relationship',
          relationTo: 'provincia',
          required: true,
          hasMany: false,
          admin: {
            width: '33%',
            allowCreate: false,
          },
        },
        {
          name: 'distrito',
          label: 'Distrito',
          type: 'relationship',
          relationTo: 'distrito',
          required: true,
          hasMany: false,
          admin: {
            width: '34%',
            allowCreate: false,
          },
        },
      ],
    },
    {
      name: 'address',
      label: 'Dirección',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'numbermovil',
          label: 'Número móvil',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'email',
          label: 'Correo electrónico',
          type: 'email',
          required: false,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'company',
      label: 'Compañías relacionadas a este establecimiento',
      type: 'relationship',
      relationTo: 'company',
      required: true,
      hasMany: true,
      admin: {
        allowCreate: false,
      },
    },
    {
      name: 'observations',
      label: 'Observaciones',
      type: 'textarea',
      required: false,
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
