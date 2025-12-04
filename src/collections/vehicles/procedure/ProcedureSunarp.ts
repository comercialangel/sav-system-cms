import type { CollectionConfig } from 'payload'

export const ProcedureSunarp: CollectionConfig = {
  slug: 'proceduresunarp',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'typeproceduresunarp',
    group: 'Trámites vehiculares',
  },
  labels: {
    singular: 'Trámite de SUNARP',
    plural: 'Trámites de SUNARP',
  },
  fields: [
    {
      name: 'vehicle',
      label: 'Unidad vehicular',
      type: 'relationship',
      relationTo: 'vehicle',
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
          name: 'typeproceduresunarp',
          label: 'Tipo de trámite',
          type: 'relationship',
          relationTo: 'typeproceduresunarp',
          required: true,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },
        {
          name: 'procedureconcept',
          label: 'Concepto de trámite',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'pregistryofficeprocedure',
          label: 'Oficina registral',
          type: 'relationship',
          relationTo: 'registryofficeprocedure',
          required: true,
          hasMany: false,
          admin: {
            width: '33%',
            allowCreate: false,
          },
        },
        {
          name: 'titlenumber',
          label: 'Número de título',
          type: 'text',
          required: false,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'startdate',
          label: 'Fecha de inicio',
          type: 'date',
          required: false,
          timezone: true,
          admin: {
            width: '34%',
          },
        },
      ],
    },
    {
      name: 'collaborator',
      label: 'Colaborador que presenta el trámite',
      type: 'relationship',
      relationTo: 'collaborator',
      required: false,
      hasMany: false,
      admin: {
        allowCreate: false,
        description:
          'Si el colaborador no presenta el trámite, seleccione quién lo realiza; COMPRADOR o TERCERO',
      },
    },
    {
      name: 'expenselist',
      label: 'Lista de costos',
      type: 'array',
      required: false,
      labels: {
        singular: 'Costo',
        plural: 'Costos',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'expensedate',
              label: 'Fecha',
              type: 'date',
              required: true,
              timezone: true,
              admin: {
                width: '50%',
                date: {
                  displayFormat: 'd MMM yyy',
                },
              },
            },
            {
              name: 'conceptexpense',
              label: 'Concepto',
              type: 'relationship',
              relationTo: 'expenseproceduresunarp',
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
              name: 'typecurrency',
              label: 'Tipo de moneda',
              type: 'relationship',
              relationTo: 'typecurrency',
              required: true,
              hasMany: false,
              admin: {
                width: '50%',
                allowCreate: false,
              },
            },
            {
              name: 'expensevalue',
              label: 'Valor',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'mediaexpenseproceduresunarp',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediaexpenseproceduresunarp',
          required: false,
        },
        {
          name: 'observations',
          label: 'Observaciones',
          type: 'textarea',
          required: false,
        },
      ],
    },
    {
      name: 'proceduredatafiles',
      label: 'Archivos de trámite',
      type: 'array',
      required: false,
      labels: {
        singular: 'Archivo',
        plural: 'Archivos',
      },
      fields: [
        {
          name: 'mediaprocedure',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediaproceduresunarp',
          required: true,
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
      name: 'procedurefinish',
      label: 'Finalización de trámite',
      type: 'group',
      admin: {
        description: 'Esta sección será completada unicamente si el trámite haya finalizado',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'enddate',
              label: 'Fecha de finalización',
              type: 'date',
              required: false,
              timezone: true,
              admin: {
                width: '33%',
              },
            },
          ],
        },
        {
          name: 'mediaregistration',
          label: 'Asiento de inscripción vehicular',
          type: 'upload',
          relationTo: 'mediaregistration',
          required: false,
        },
        {
          name: 'mediative',
          label: 'TIVE (Tarjeta de identificación vehicular electrónica)',
          type: 'upload',
          relationTo: 'mediative',
          required: false,
        },
      ],
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      required: true,
      admin: {
        position: 'sidebar',
      },
      options: ['En proceso', 'Inscrito', 'Tachado', 'Cancelado'],
      defaultValue: 'en proceso',
    },
  ],
}
