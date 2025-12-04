import type { CollectionConfig } from 'payload'

export const Notary: CollectionConfig = {
  slug: 'notary',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'notaryname',
    group: 'Transferencias de unidades vehiculares',
  },
  labels: {
    singular: 'Notaria',
    plural: 'Notarias',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'ruc',
          label: 'RUC',
          type: 'text',
          required: false,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'notaryname',
          label: 'Nombre de notaria',
          type: 'text',
          required: true,
          admin: {
            width: '67%',
          },
        },
      ],
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
  ],
}
