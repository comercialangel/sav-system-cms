import type { CollectionConfig } from 'payload'

export const InstallerGPS: CollectionConfig = {
  slug: 'installergps',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'nameinstaller',
    group: "Adquisiciones de GPS y SIM's",
  },
  labels: {
    singular: 'Instalador de GPS',
    plural: 'Instaladores de GPS',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'typeidentificationdocument',
          label: 'Tipo de documento de identificación',
          type: 'relationship',
          relationTo: 'typeidentificationdocument',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },
        {
          name: 'identificationnumber',
          label: 'Número de identificación',
          type: 'text',
          required: false,
          unique: false,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'nameinstaller',
      label: 'Nombre completo',
      type: 'text',
      required: true,
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
