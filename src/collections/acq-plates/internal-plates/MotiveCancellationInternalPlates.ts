import type { CollectionConfig } from 'payload'

export const MotiveCancellationInternalPlates: CollectionConfig = {
  slug: 'motivecancellationinternalplates',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'motivecancellation',
    group: 'Adquisición de placas de exhibición',
  },
  labels: {
    singular: 'Motivo de cancelación de placa',
    plural: 'Motivos de cancelación de placas',
  },
  fields: [
    {
      name: 'motivecancellation',
      label: 'Motivo de cancelación',
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
