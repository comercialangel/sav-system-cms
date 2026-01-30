import type { CollectionConfig } from 'payload'

export const SupplierContact: CollectionConfig = {
  slug: 'suppliercontact',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'namesuppliercontact',
    group: 'Proveedores vehiculares',
  },
  labels: {
    singular: 'Contacto de proveedor',
    plural: 'Contactos de proveedores',
  },
  fields: [
    {
      name: 'supplier',
      label: 'Proveedor',
      type: 'relationship',
      relationTo: 'supplier',
      required: true,
      hasMany: false,
      admin: {
        allowCreate: false,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'namesuppliercontact',
          label: 'Nombre completo',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'jobposition',
          label: 'Puesto de trabajo',
          type: 'text',
          required: true,
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
  ],
}
