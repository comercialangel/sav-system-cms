import type { CollectionConfig } from 'payload'

export const VehicleDelivery: CollectionConfig = {
  slug: 'vehicledelivery',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Entregas y devoluciones',
  },
  labels: {
    singular: 'Entrega de vehicular',
    plural: 'Entregas de vehiculos',
  },
  fields: [
    {
      name: 'finalsale',
      label: 'Venta vehicular final',
      type: 'relationship',
      relationTo: 'finalsale',
      required: false,
      hasMany: false,
      admin: {
        allowCreate: false,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'typedelivery',
          label: 'Tipo de entrega',
          type: 'select',
          admin: {
            width: '50%',
          },
          options: [
            { label: 'Entrega vehicular', value: 'entrega-vehicular' },
            { label: 'Entrega de TIVE', value: 'entrega-de-tive' },
            { label: 'Entrega de placas', value: 'entrega-de-placas' },
            { label: 'Entrega de segunda llave', value: 'entrega-de-segunda-llave' },
          ],
          required: true,
        },
        {
          name: 'deliverydate',
          label: 'Fecha de entrega',
          type: 'date',
          required: false,
          timezone: true,
          admin: {
            width: '50%',
            date: {
              displayFormat: 'd MMM yyy',
            },
          },
        },
      ],
    },
    {
      name: 'deliveryplace',
      label: 'Lugar de entrega',
      type: 'text',
      required: false,
    },
    {
      name: 'vehicledeliveryfiles',
      label: 'Archivos',
      type: 'array',
      labels: {
        singular: 'Archivo',
        plural: 'Archivos',
      },
      required: false,
      fields: [
        {
          name: 'mediavehicledelivery',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediavehicledelivery',
          required: false,
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
      name: 'statusdelivery',
      label: 'Estado de entrega',
      type: 'select',
      admin: {
        width: '50%',
        position: 'sidebar',
      },
      options: [
        { label: 'Pendiente', value: 'pendiente' },
        { label: 'Entregado', value: 'entregado' },
      ],
      required: true,
      defaultValue: 'pendiente',
    },
  ],
}
