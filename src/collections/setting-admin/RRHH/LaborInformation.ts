import type { CollectionConfig } from 'payload'

export const LaborInformation: CollectionConfig = {
  slug: 'laborinformation',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'collaborator',
    group: 'Recursos Humanos',
  },
  labels: {
    singular: 'Información laboral',
    plural: 'Información laboral',
  },
  fields: [
    {
      name: 'collaborator',
      label: 'Colaborador',
      type: 'relationship',
      relationTo: 'collaborator',
      required: true,
      hasMany: false,
      admin: {
        allowCreate: false,
      },
    },
    {
      name: 'laborinformation',
      label: 'Información laboral',
      type: 'group',
      fields: [
        {
          name: 'company',
          label: 'Compañía asignada para laboral',
          type: 'relationship',
          relationTo: 'company',
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
              name: 'typecollaborator',
              label: 'Tipo de colaborador',
              type: 'relationship',
              relationTo: 'typecollaborator',
              required: false,
              hasMany: false,
              admin: {
                width: '50%',
                allowCreate: false,
              },
            },
            {
              name: 'establishment',
              label: 'Establecimiento',
              type: 'relationship',
              relationTo: 'establishment',
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
              name: 'laborarea',
              label: 'Área Laboral',
              type: 'relationship',
              relationTo: 'laborarea',
              required: false,
              hasMany: false,
              admin: {
                width: '50%',
                allowCreate: false,
              },
            },
            {
              name: 'jobposition',
              label: 'Puesto de Trabajo',
              type: 'relationship',
              relationTo: 'jobposition',
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
              name: 'entrydate',
              label: 'Fecha de Ingreso',
              type: 'date',
              required: true,
              admin: {
                width: '50%',
              },
            },

            {
              name: 'departuredate',
              label: 'Fecha de salida',
              type: 'date',
              required: false,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'drivinglicense',
              label: 'Licencia de conducir (opcional)',
              type: 'text',
              required: false,
              admin: {
                width: '30%',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'emergencycontact',
      label: 'Contacto de Emergencia',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              label: 'Nombre',
              type: 'text',
              required: false,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'numbermovil',
              label: 'Número móvil',
              type: 'text',
              required: false,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'relationship',
              label: 'Parentesco',
              type: 'text',
              required: false,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'address',
              label: 'Dirección',
              type: 'text',
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
      name: 'familyinformation',
      label: 'Información familiar',
      labels: {
        singular: 'Familiar',
        plural: 'Familiares',
      },
      type: 'array',
      admin: {
        description: 'Complete esta sección solo si el colaborador está registrado en planilla',
      },
      required: false,
      fields: [
        {
          name: 'fullname',
          label: 'Nombre completo',
          type: 'text',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'familyrelation',
              label: 'Realación familiar',
              type: 'relationship',
              relationTo: 'familyrelation',
              required: true,
              hasMany: false,
              admin: {
                width: '50%',
                allowCreate: true,
              },
            },
            {
              name: 'datebirth',
              label: 'Fecha de nacimiento',
              type: 'date',
              required: true,
              admin: {
                width: '50%',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'salaryinformation',
      label: 'Información de sueldo',
      type: 'group',
      admin: {
        description: 'Complete esta sección solo si el colaborador está registrado en planilla',
      },
      fields: [
        {
          name: 'salary',
          label: 'Salario PEN S/',
          type: 'text',
          required: false,
          admin: {
            width: '30%',
          },
        },
        {
          name: 'account',
          label: 'Cuenta bancaria para pago de sueldo',
          type: 'group',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'typebank',
                  label: 'Tipo de banco',
                  type: 'relationship',
                  relationTo: 'typebank',
                  required: false,
                  hasMany: false,
                  admin: {
                    width: '33%',
                    allowCreate: false,
                  },
                },
                {
                  name: 'typeaccount',
                  label: 'Tipo de cuenta',
                  type: 'relationship',
                  relationTo: 'typeaccount',
                  required: false,
                  hasMany: false,
                  admin: {
                    width: '33%',
                    allowCreate: false,
                  },
                },
                {
                  name: 'typecurrency',
                  label: 'Tipo de moneda',
                  type: 'relationship',
                  relationTo: 'typecurrency',
                  required: false,
                  hasMany: false,
                  admin: {
                    width: '34%',
                    allowCreate: false,
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'accountnumber',
                  label: 'Número de cuenta',
                  type: 'text',
                  required: false,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'cci',
                  label: 'CCI',
                  type: 'text',
                  required: false,
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'socialsecurityinformation',
      label: 'Información de seguro social',
      type: 'group',
      admin: {
        description: 'Complete esta sección solo si el colaborador está registrado en planilla',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'pensionsystem',
              label: 'Sistema de pensión',
              type: 'relationship',
              relationTo: 'pensionsystem',
              required: false,
              hasMany: false,
              admin: {
                width: '50%',
                allowCreate: false,
              },
            },
            {
              name: 'typeafp',
              label: 'Tipo de AFP',
              type: 'relationship',
              relationTo: 'typeafp',
              required: false,
              hasMany: false,
              admin: {
                width: '50%',
                allowCreate: false,
                description: 'complete si seleccionó AFP como sistema de pensión',
              },
            },
          ],
        },
        {
          name: 'afppayment',
          label: 'Pagos de AFP',
          labels: {
            singular: 'Pago',
            plural: 'Pagos',
          },
          type: 'array',
          required: false,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'dateafp',
                  label: 'Fecha de pago',
                  type: 'date',
                  required: true,
                  admin: {
                    width: '33%',
                  },
                },
              ],
            },
            {
              name: 'afpfiles',
              label: 'Archivos',
              type: 'array',
              required: false,
              labels: {
                singular: 'Archivo',
                plural: 'Archivos',
              },
              fields: [
                {
                  name: 'mediaafp',
                  label: 'Archivo',
                  type: 'upload',
                  relationTo: 'mediaafp',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          name: 'ctspayment',
          label: 'Pagos de CTS',
          labels: {
            singular: 'Pago',
            plural: 'Pagos',
          },
          type: 'array',
          required: false,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'datects',
                  label: 'Fecha de pago',
                  type: 'date',
                  required: true,
                  admin: {
                    width: '33%',
                  },
                },
              ],
            },
            {
              name: 'ctsfiles',
              label: 'Archivos',
              type: 'array',
              required: false,
              labels: {
                singular: 'Archivo',
                plural: 'Archivos',
              },
              fields: [
                {
                  name: 'mediacts',
                  label: 'Archivo',
                  type: 'upload',
                  relationTo: 'mediacts',
                  required: true,
                },
              ],
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
