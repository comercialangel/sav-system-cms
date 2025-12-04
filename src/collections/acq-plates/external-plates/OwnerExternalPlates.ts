import type { CollectionConfig } from 'payload'

export const OwnerExternalPlates: CollectionConfig = {
  slug: 'ownerexternalplates',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'owner',
    group: 'Adquisición de placas de exhibición',
  },
  labels: {
    singular: 'Propietario de placa externa',
    plural: 'Propietarios de placas externas',
  },
  fields: [
    {
      name: 'owner',
      label: 'Nombres y apellidos (propietario)',
      type: 'text',
      required: true,
      unique: true,
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
