import type { CollectionConfig } from 'payload'

export const ExternalPlates: CollectionConfig = {
  slug: 'externalplates',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'platenumber',
    group: 'Adquisición de placas de exhibición',
  },
  labels: {
    singular: 'Placa externa',
    plural: 'Placas externas',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'platenumber',
          label: 'Número de placas',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            width: '25%',
          },
        },
        {
          name: 'typeplate',
          label: 'Tipo de placa',
          type: 'select',
          admin: {
            width: '25%',
          },
          required: true,
          options: [
            {
              label: 'Exhibición',
              value: 'exhibicion',
            },
            {
              label: 'Rotativa',
              value: 'rotativa',
            },
          ],
        },
        {
          name: 'ownerexternalplates',
          label: 'Propietario',
          type: 'relationship',
          relationTo: 'ownerexternalplates',
          required: true,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
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
          label: 'Liberada',
          value: 'liberada',
        },
        {
          label: 'Asignada',
          value: 'asignada',
        },
      ],
      defaultValue: 'liberada',
    },
  ],
}
