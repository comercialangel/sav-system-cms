import type { CollectionConfig } from 'payload'

export const MotiveCancellationDevice: CollectionConfig = {
  slug: 'motivecancellationdevice',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'motivecancellation',
    group: "Adquisiciones de GPS y SIM's",
  },
  labels: {
    singular: 'Motivo de cancelación de dipositivo GPS',
    plural: 'Motivos de cancelación de dispositivos GPS',
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
