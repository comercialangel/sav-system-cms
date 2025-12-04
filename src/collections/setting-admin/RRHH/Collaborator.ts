import type { CollectionConfig } from 'payload'

export const Collaborator: CollectionConfig = {
  slug: 'collaborator',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'fullname',
    group: 'Recursos Humanos',
  },
  labels: {
    singular: 'Colaborador',
    plural: 'Colaboradores',
  },
  fields: [
    {
      name: 'photo',
      label: 'Foto',
      type: 'upload',
      relationTo: 'mediacollaborator',
      required: false,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'typeidentificationdocument',
          label: 'Tipo de documento de identificación',
          type: 'relationship',
          relationTo: 'typeidentificationdocument',
          required: true,
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
          required: true,
          unique: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'fullname',
      label: 'Nombre completo',
      type: 'text',
      hooks: {
        beforeChange: [
          ({ data }) => {
            interface FullNameData {
              name: string
              paternallastname: string
              motherlastname: string
            }
            const typedData = data as FullNameData
            return `${typedData.name} ${typedData.paternallastname} ${typedData.motherlastname}`
          },
        ],
      },
      admin: {
        hidden: true,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          label: 'Nombre(s)',
          type: 'text',
          required: true,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'paternallastname',
          label: 'Apellido paterno',
          type: 'text',
          required: true,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'motherlastname',
          label: 'Apellido materno',
          type: 'text',
          required: true,
          admin: {
            width: '33%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'civilstatus',
          label: 'Estado civil',
          type: 'relationship',
          relationTo: 'civilstatus',
          required: true,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },
        {
          name: 'genre',
          label: 'Género',
          type: 'relationship',
          relationTo: 'genre',
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
      type: 'row',
      fields: [
        {
          name: 'datebirth',
          label: 'Fecha de nacimiento',
          type: 'date',
          required: false,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'nationality',
          label: 'Nacionalidad',
          type: 'relationship',
          relationTo: 'country',
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
      name: 'contactinformation',
      label: 'Información de contacto',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'departamento',
              label: 'Departamento',
              type: 'relationship',
              relationTo: 'departamento',
              required: true,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: false,
              },
            },
            {
              name: 'provincia',
              label: 'Provincia',
              type: 'relationship',
              relationTo: 'provincia',
              required: true,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: false,
              },
            },
            {
              name: 'distrito',
              label: 'Distrito',
              type: 'relationship',
              relationTo: 'distrito',
              required: true,
              hasMany: false,
              admin: {
                width: '34%',
                allowCreate: false,
              },
            },
          ],
        },
        {
          name: 'address',
          label: 'Dirección',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'numbermovil',
              label: 'Número móvil',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'email',
              label: 'Correo electrónico',
              type: 'email',
              required: false,
              admin: {
                width: '50%',
              },
            },
          ],
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
    {
      type: 'relationship',
      name: 'createdBy',
      label: 'Creado por',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
        allowEdit: false,
      },
    },
    {
      type: 'relationship',
      name: 'updatedBy',
      label: 'Actualizado por',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
        allowEdit: false,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req: { user }, data, originalDoc }) => {
        if (user) {
          if (!originalDoc.createdBy) {
            data.createdBy = user.id
          }
          data.updatedBy = user.id
        }
        return data
      },
    ],
  },
}
