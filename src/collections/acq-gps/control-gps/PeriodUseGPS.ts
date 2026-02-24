import type { CollectionConfig } from 'payload'

export const PeriodUseGPS: CollectionConfig = {
  slug: 'periodusegps',
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
    singular: 'Periodo de uso GPS',
    plural: 'Periodos de uso GPS',
  },
  fields: [
    {
      name: 'assignmentgps',
      type: 'relationship',
      label: 'Asignación de GPS asociada',
      relationTo: 'assignmentgps',
      required: false,
      hasMany: false,
      admin: {
        position: 'sidebar',
        allowEdit: false,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'periodgps',
          label: 'Periodo de renovación',
          type: 'select',
          options: [
            {
              label: 'Mensual',
              value: 'mensual',
            },
            {
              label: 'Anual',
              value: 'anual',
            },
          ],
          required: true,
          hasMany: false,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'typeresponsible',
          label: 'Responsable de renovar',
          type: 'select',
          required: true,
          admin: {
            width: '50%',
          },
          options: [
            {
              label: 'Comprador',
              value: 'comprador',
            },
            {
              label: 'Proveedor',
              value: 'proveedor',
            },
          ],
          defaultValue: 'comprador',
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
      name: 'renewalsgps',
      type: 'relationship',
      label: 'Renovaciones',
      relationTo: 'renewalsgps',
      required: false,
      hasMany: true,
      admin: {
        readOnly: false,
        allowEdit: false,
      },
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

    // afterChange: [
    //   async ({ doc, req, operation }) => {
    //     const { payload } = req

    //     try {
    //       // Solo procesar si hay una asignación GPS asociada
    //       if (doc.assignmentgps) {
    //         const assignmentId =
    //           typeof doc.assignmentgps === 'object' ? doc.assignmentgps.id : doc.assignmentgps

    //         // Actualizar la asignación GPS con la referencia al periodo de uso
    //         await payload.update({
    //           collection: 'assignmentgps',
    //           id: assignmentId,
    //           data: {
    //             periodusegps: doc.id, // Establecemos la relación inversa
    //           },
    //         })

    //         console.log(`Asignación GPS ${assignmentId} actualizada con periodo de uso ${doc.id}`)
    //       }
    //     } catch (error) {
    //       console.error('Error en hook de PeriodUseGPS:', {
    //         error: error,
    //         stack: error,
    //         docId: doc.id,
    //         operation,
    //       })
    //       throw new Error('No se pudo agregar la asignación GPS con el periodo de uso')
    //     }
    //   },
    // ],
  },
}
