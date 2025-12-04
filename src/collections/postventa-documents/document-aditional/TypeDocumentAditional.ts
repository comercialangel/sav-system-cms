import type { CollectionConfig } from 'payload'

export const TypeDocumentAditional: CollectionConfig = {
  slug: 'typedocumentaditional',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'typedocumentaditional',
    group: 'Notificaciones y otros documentos adicionales',
  },
  labels: {
    singular: 'Tipo de documento adicional de venta',
    plural: 'Tipos de documentos adicionales de ventas',
  },
  fields: [
    {
      name: 'typedocumentaditional',
      label: 'Tipo de documento adicional',
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
