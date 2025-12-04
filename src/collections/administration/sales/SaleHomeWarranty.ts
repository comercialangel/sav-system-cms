import type { CollectionConfig } from 'payload'

export const SaleHomeWarranty: CollectionConfig = {
  slug: 'salehomewarranty',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Ventas vehiculares',
  },
  labels: {
    singular: 'Garantía inmobiliaría vehicular',
    plural: 'Garantías inmobilarías vehiculares',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'datehomewarranty',
          label: 'Fecha de garantía inmobiliaria',
          type: 'date',
          required: true,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'collaborator',
          label: 'Colaborador ejecutor',
          type: 'relationship',
          relationTo: 'collaborator',
          required: true,
          hasMany: false,
          admin: {
            width: '67%',
            allowCreate: false,
          },
        },
      ],
    },
    {
      name: 'notary',
      label: 'Notaría',
      type: 'relationship',
      relationTo: 'notary',
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
          name: 'kardex',
          label: 'Número de kardex',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'folio',
          label: 'Número de folio',
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
          name: 'valuemonetary',
          label: 'Valor monetario',
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
      name: 'homewarrantyfiles',
      label: 'Archvios',
      type: 'array',
      required: false,
      labels: {
        singular: 'Archivo',
        plural: 'Archivos',
      },
      fields: [
        {
          name: 'mediahomewarranty',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediahomewarranty',
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
      name: 'warrantyrelease',
      label: 'Levantamiento de garantía inmobiliaria',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'datehomewarrantyrelease',
              label: 'Fecha de levantamiento garantía inmobiliaria',
              type: 'date',
              required: true,
              admin: {
                width: '33%',
              },
            },
          ],
        },
        {
          name: 'homewarrantyreleasefiles',
          label: 'Archvios',
          type: 'array',
          required: false,
          labels: {
            singular: 'Archivo',
            plural: 'Archivos',
          },
          fields: [
            {
              name: 'mediahomewarrantyrelease',
              label: 'Archivo',
              type: 'upload',
              relationTo: 'mediahomewarranty',
              required: true,
            },
          ],
        },
        {
          name: 'observationswarrantyrelease',
          label: 'Observaciones de levantamiento',
          type: 'textarea',
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
      options: [
        {
          label: 'En proceso',
          value: 'en proceso',
        },
        {
          label: 'Vigente',
          value: 'vigente',
        },
        {
          label: 'Liberado',
          value: 'liberado',
        },
      ],
      defaultValue: 'en proceso',
    },
  ],
}
