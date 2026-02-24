import type { CollectionConfig } from 'payload'

export const GPSCancellation: CollectionConfig = {
  slug: 'gpscancellation',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: "Adquisiciones de GPS y SIM's",
  },
  labels: {
    singular: 'Cancelación de GPS',
    plural: 'Cancelaciones de GPS',
  },
  fields: [
    {
      name: 'assignmentgps',
      label: 'Asignación de GPS asociada',
      type: 'relationship',
      relationTo: 'assignmentgps',
      required: true,
      hasMany: false,
      admin: {
        allowCreate: false,
        allowEdit: false,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'cancellationdate',
          label: 'Fecha de cancelación',
          type: 'date',
          required: false,
          timezone: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'motivecancellationgps',
          label: 'Motivo de cancelación',
          type: 'relationship',
          relationTo: 'motivecancellationgps',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: true,
          },
        },
      ],
    },
    {
      name: 'gpscancellationfiles',
      label: 'Archivos',
      type: 'array',
      labels: {
        singular: 'Archivo',
        plural: 'Archivos',
      },
      required: false,
      fields: [
        {
          name: 'mediagpscancellation',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediagpscancellation',
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

    afterChange: [
      async ({ doc, req, operation }) => {
        const { payload } = req

        try {
          // Solo procesar en creación (para evitar ejecuciones duplicadas en updates)
          if (operation === 'create' && doc.assignmentgps) {
            const assignmentId =
              typeof doc.assignmentgps === 'object' ? doc.assignmentgps.id : doc.assignmentgps

            // Obtener la asignación completa con relaciones
            const assignment = await payload.findByID({
              collection: 'assignmentgps',
              id: assignmentId,
              depth: 2,
            })

            // 1. Actualizar la asignación GPS
            await payload.update({
              collection: 'assignmentgps',
              id: assignmentId,
              data: {
                statusassignment: 'no vigente',
              },
            })

            // 2. Actualizar estado del dispositivo GPS
            if (assignment.devicecode) {
              const deviceId =
                typeof assignment.devicecode === 'object'
                  ? assignment.devicecode.id
                  : assignment.devicecode

              await payload.update({
                collection: 'devicegps',
                id: deviceId,
                data: {
                  status: 'uso finalizado',
                },
              })
              console.log('Dispositivo GPS marcado como "uso finalizado"')
            }

            // 3. Actualizar estado de la tarjeta SIM
            if (assignment.numbersim) {
              const simId =
                typeof assignment.numbersim === 'object'
                  ? assignment.numbersim.id
                  : assignment.numbersim

              await payload.update({
                collection: 'cardsim',
                id: simId,
                data: {
                  status: 'uso finalizado',
                },
              })
              console.log('Tarjeta SIM marcada como "uso finalizado"')
            }

            console.log('Cancelación procesada correctamente')
          }
        } catch (error) {
          console.error('Error en hook de cancelación GPS:', error)
          throw new Error('No se pudo completar el proceso de cancelación')
        }
      },
    ],
  },
}
