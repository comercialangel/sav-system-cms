import type { CollectionConfig } from 'payload'

export const SupplierAddress: CollectionConfig = {
  slug: 'supplieraddress',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'address',
    group: 'Proveedores vehiculares',
  },
  labels: {
    singular: 'Sede de proveedor',
    plural: 'Sedes de proveedores',
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
          name: 'sede',
          label: 'Nombre de sede',
          type: 'text',
          required: true,
          admin: {
            width: '30%',
          },
        },
        {
          name: 'address',
          label: 'Dirección de sede',
          type: 'text',
          required: true,
          admin: {
            width: '70%',
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
