import type { CollectionConfig } from 'payload'

export const LicensePlateIssuanceProcedure: CollectionConfig = {
  slug: 'licenseplateissuanceprocedure',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Trámites vehiculares',
  },
  labels: {
    singular: 'Trámite para obtención de placas de rodaje',
    plural: 'Trámites para obtención de placas de rodaje',
  },
  fields: [
    {
      name: 'vehicleregistration',
      label: 'Trámite de inscripción vehicular',
      type: 'relationship', // Relación con el procedimiento de inscripción vehicular
      relationTo: 'vehicleregistrationprocedure',
      required: true,
      hasMany: false,
      admin: {
        allowCreate: false,
      },
      /* hooks: {
        // Hook para cargar el valor de optionsprocedure desde vehicleregistrationprocedure
        beforeChange: [
          async ({ data, req }) => {
            if (data && data.vehicleregistration) {
              try {
                const vehicleRegistration = await req.payload.findByID({
                  collection: 'vehicleregistrationprocedure',
                  id: data.vehicleregistration,
                })
                data.optionsprocedure = vehicleRegistration.optionsprocedure
              } catch (error) {
                console.error(
                  'Error cargando optionsprocedure desde vehicleregistrationprocedure:',
                  error,
                )
              }
            }
            return data
          },
        ],
      }, */
    },
    {
      name: 'optionsprocedure',
      label: 'Proceso de trámite',
      type: 'radio',
      options: [
        {
          label: 'Trámite realizado por el proveedor',
          value: 'procedureprovider',
        },
        {
          label: 'Trámite realizado por la empresa compradora',
          value: 'procedurecompany',
        },
      ],
      admin: {
        readOnly: false, // Hacer el campo de solo lectura
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startdate',
          label: 'Fecha de inicio',
          type: 'date',
          required: false,
          timezone: true,
          admin: {
            width: '50%',
            date: {
              displayFormat: 'd MMM yyy',
            },
          },
        },
      ],
    },
    {
      name: 'procedurecompany',
      label: 'Información de trámite por empresa',
      type: 'group',
      admin: {
        description:
          'Esta sección será completada unicamente si el trámite será realizado por la empresa compradora de la unidad vehicular',
        condition: (data) => data.optionsprocedure === 'procedurecompany',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'registryofficeprocedure',
              label: 'Oficina registral',
              type: 'relationship',
              relationTo: 'registryofficeprocedure',
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
          name: 'mediaprocedureaap',
          label: 'Orden de giro',
          type: 'upload',
          relationTo: 'mediaprocedureaap',
          required: false,
        },
      ],
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
              relationTo: 'expenseprocedureaap',
              required: true,
              hasMany: false,
              admin: {
                width: '50%',
                allowCreate: false,
              },
            },
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
              type: 'number',
              required: true,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'expenseAAPfiles',
          label: 'Archivos',
          type: 'array',
          required: false,
          labels: {
            singular: 'Archivo',
            plural: 'Archivos',
          },
          fields: [
            {
              name: 'mediaexpenseprocedureaap',
              label: 'Archivo',
              type: 'upload',
              relationTo: 'mediaexpenseprocedureaap',
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
                width: '50%',
                date: {
                  displayFormat: 'd MMM yyy',
                },
              },
            },
          ],
        },
        {
          name: 'registrationprocessor',
          label: 'Recepcionado por',
          type: 'relationship',
          relationTo: 'registrationprocessor',
          required: false,
          hasMany: false,
          admin: {
            width: '100%',
            allowCreate: true,
          },
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
      options: ['Pendiente', 'Pago pendiente', 'Trámite en proceso', 'Recibido'],
      defaultValue: 'Pendiente',
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
      async ({ req, data, operation }) => {
        if (req.user) {
          if (operation === 'create') {
            data.createdBy = req.user.id
          }
          data.updatedBy = req.user.id
        }
        return data
      },
    ],
  },
}
