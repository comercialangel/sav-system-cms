import type { CollectionConfig } from 'payload'

export const OwnerSIM: CollectionConfig = {
  slug: 'ownersim',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'fullname',
    group: "Adquisiciones de GPS y SIM's",
  },
  labels: {
    singular: 'Titular de tarjeta SIM',
    plural: "Titulares de tarjetas SIM's",
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'typeidentificationdocument',
          label: 'Tipo de documento de identificación',
          type: 'relationship',
          relationTo: 'typeidentificationdocument',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },
        {
          name: 'identificationnumber',
          label: 'Número de identificación',
          type: 'text',
          required: false,
          unique: false,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'fullname',
          label: 'Nombre completa /Razón social',
          type: 'text',
          required: true,
          admin: {
            width: '100%',
          },
        },
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
        {
          name: 'address',
          label: 'Dirección',
          type: 'text',
          required: false,
          admin: {
            width: '100%',
          },
        },
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
