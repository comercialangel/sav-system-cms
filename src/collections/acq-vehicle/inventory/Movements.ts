import type { CollectionConfig } from 'payload'

export const Movements: CollectionConfig = {
  slug: 'movements',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  admin: {
    group: 'Control de inventario vehicular',
  },
  labels: {
    singular: 'Movimiento vehicular',
    plural: 'Movimientos vehiculares',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'vehicle',
          label: 'Unidad vehicular',
          type: 'relationship',
          relationTo: 'vehicle',
          required: true,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },
        {
          name: 'company',
          label: 'Empresa',
          type: 'relationship',
          relationTo: 'company',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'movementdate',
          label: 'Fecha de movimiento',
          type: 'date',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'typemovement',
          label: 'Tipo de movimiento',
          type: 'select',
          required: true,
          admin: {
            width: '50%',
          },
          options: [
            {
              label: 'Entrada',
              value: 'entrada',
            },
            {
              label: 'Salida',
              value: 'salida',
            },
          ],
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'motivemovement',
          label: 'Motivo de movimiento',
          type: 'text',
          required: true,
          hasMany: false,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'warehouse',
          label: 'Almacén',
          type: 'relationship',
          relationTo: 'warehouse',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },
      ],
    },

    {
      name: 'status',
      label: 'Estado del movimiento',
      type: 'select',
      options: [
        {
          label: 'Activo',
          value: 'activo',
        },
        {
          label: 'Cancelado',
          value: 'cancelado',
        },
      ],
      defaultValue: 'activo',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },

    {
      name: 'relocationId',
      type: 'text',
      label: 'ID de traslado',
      required: false,
      admin: {
        // hidden: true,
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}
