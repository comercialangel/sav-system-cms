import type { CollectionConfig } from 'payload'

export const RegistryOfficeProcedure: CollectionConfig = {
  slug: 'registryofficeprocedure',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'registryofficeprocedure',
    group: 'Trámites vehiculares',
  },
  labels: {
    singular: 'Oficina de registro SUNARP y recojo de placas en AAP',
    plural: 'Oficinas de registro SUNARP y recojo de placas en AAP',
  },
  fields: [
    {
      name: 'registryofficeprocedure',
      label: 'Oficina de registro y recojo',
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
