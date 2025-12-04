import type { CollectionConfig } from 'payload'
import { headersWithCors } from 'payload'

export const AssignmentGPS: CollectionConfig = {
  slug: 'assignmentgps',
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
    singular: 'Asignación de GPS',
    plural: 'Asignaciones de GPS',
  },
  fields: [
    {
      name: 'vehicle',
      label: 'Unidad vehicular',
      type: 'relationship',
      relationTo: 'vehicle',
      required: true,
      hasMany: false,
      index: true,
      admin: {
        allowCreate: false,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'devicecode',
          label: 'Dispositivo GPS',
          type: 'relationship',
          relationTo: 'devicegps',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: true,
          },
        },
        {
          name: 'numbersim',
          label: 'Número de tarjeta SIM sinotrack',
          type: 'relationship',
          relationTo: 'cardsim',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: true,
            description: 'Completar campo si el tipo de GPS seleccionado es Sinotrack',
          },
        },
      ],
    },
    {
      name: 'gpsfiles',
      label: 'Archivos GPS',
      type: 'array',
      required: false,
      labels: {
        singular: 'Archivo',
        plural: 'Archivos',
      },
      fields: [
        {
          name: 'mediagps',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediagps',
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
      name: 'statusassignment',
      label: 'Estado de asignación',
      type: 'select',
      required: true,
      admin: {
        position: 'sidebar',
      },
      options: [
        {
          label: 'Vigente',
          value: 'vigente',
        },
        {
          label: 'No vigente',
          value: 'no vigente',
        },
      ],
      defaultValue: 'vigente',
    },
    {
      name: 'statusinstallation',
      label: 'Estado de instalación',
      type: 'select',
      required: true,
      admin: {
        position: 'sidebar',
      },
      options: [
        {
          label: 'Pendiente',
          value: 'pendiente',
        },
        {
          label: 'Instalado',
          value: 'instalado',
        },
      ],
      defaultValue: 'pendiente',
    },
    {
      name: 'installationgps',
      type: 'relationship',
      label: 'Instalación de GPS',
      relationTo: 'installationgps',
      required: false,
      hasMany: false,
      admin: {
        readOnly: false,
        position: 'sidebar',
        allowEdit: false,
      },
    },
    {
      name: 'periodusegps',
      type: 'relationship',
      label: 'Periodo de uso GPS asociada',
      relationTo: 'periodusegps',
      required: false,
      hasMany: false,
      admin: {
        readOnly: false,
        position: 'sidebar',
        allowEdit: false,
      },
    },
    {
      name: 'gpscancellation',
      type: 'relationship',
      label: 'Cancelación de GPS',
      relationTo: 'gpscancellation',
      required: false,
      hasMany: false,
      admin: {
        readOnly: false,
        position: 'sidebar',
        allowEdit: false,
      },
    },
  ],

  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req, operation }) => {
        const { payload } = req

        try {
          if (doc?.statusinstallation === 'instalado') {
            return // Evita procesamiento si ya esta instalado
          }

          // Operación de creación
          if (operation === 'create') {
            // Actualizar estado del dispositivo GPS si existe
            if (doc.devicecode) {
              await payload.update({
                collection: 'devicegps',
                id: typeof doc.devicecode === 'object' ? doc.devicecode.id : doc.devicecode,
                data: {
                  status: 'asignado',
                },
              })
              console.log(`Dispositivo GPS ${doc.devicecode} marcado como asignado`)
            }

            // Actualizar estado de la tarjeta SIM si existe
            if (doc.numbersim) {
              await payload.update({
                collection: 'cardsim',
                id: typeof doc.numbersim === 'object' ? doc.numbersim.id : doc.numbersim,
                data: {
                  status: 'asignado',
                },
              })
              console.log(`Tarjeta SIM marcada como asignada`)
            }
          }

          // Operación de actualización
          if (operation === 'update' && previousDoc) {
            // Manejar cambios en el dispositivo GPS
            if (doc.devicecode !== previousDoc.devicecode) {
              // Liberar dispositivo anterior
              if (previousDoc.devicecode) {
                await payload.update({
                  collection: 'devicegps',
                  id:
                    typeof previousDoc.devicecode === 'object'
                      ? previousDoc.devicecode.id
                      : previousDoc.devicecode,
                  data: {
                    status: 'disponible',
                  },
                })
                console.log(`Dispositivo GPS anterior liberado`)
              }

              // Asignar nuevo dispositivo

              if (doc.devicecode) {
                await payload.update({
                  collection: 'devicegps',
                  id: typeof doc.devicecode === 'object' ? doc.devicecode.id : doc.devicecode,
                  data: {
                    status: 'asignado',
                  },
                })
                console.log(`Nuevo dispositivo GPS asignado`)
              }
            }

            // Manejar cambios en la tarjeta SIM
            if (doc.numbersim !== previousDoc.numbersim) {
              // Liberar SIM anterior
              if (previousDoc.numbersim) {
                await payload.update({
                  collection: 'cardsim',
                  id:
                    typeof previousDoc.numbersim === 'object'
                      ? previousDoc.numbersim.id
                      : previousDoc.numbersim,
                  data: { status: 'disponible' },
                })
                console.log('Tarjeta SIM anterior liberada')
              }

              // Asignar nueva SIM
              if (doc.numbersim) {
                await payload.update({
                  collection: 'cardsim',
                  id: typeof doc.numbersim === 'object' ? doc.numbersim.id : doc.numbersim,
                  data: { status: 'asignado' },
                })
                console.log('Nueva tarjeta SIM asignada')
              }
            }

            // Manejar cancelación de asignación
            if (
              doc.statusassignment === 'no vigente' &&
              previousDoc.statusassignment === 'vigente'
            ) {
              // Liberar dispositivo si existe
              if (doc.devicecode) {
                await payload.update({
                  collection: 'devicegps',
                  id: typeof doc.devicecode === 'object' ? doc.devicecode.id : doc.devicecode,
                  data: { status: 'disponible' },
                })
              }

              // Liberar SIM si existe
              if (doc.numbersim) {
                await payload.update({
                  collection: 'cardsim',
                  id: typeof doc.numbersim === 'object' ? doc.numbersim.id : doc.numbersim,
                  data: { status: 'disponible' },
                })
              }
              console.log(`Asignación cancelada - Dispositivos liberados`)
            }
          }
        } catch (error) {
          console.error('Error en hook de asignación GPS:', error)
          throw new Error('No se pudo completar la actualización de estados')
        }
      },
    ],

    afterDelete: [
      async ({ doc, req }) => {
        const { payload } = req

        try {
          // Liberar dispositivo GPS si existe
          if (doc.devicecode) {
            await payload.update({
              collection: 'devicegps',
              id: typeof doc.devicecode === 'object' ? doc.devicecode.id : doc.devicecode,
              data: { status: 'disponible' },
            })
            console.log(`Dispositivo GPS ${doc.devicecode} liberado`)
          }

          // Liberar tarjeta SIM si existe
          if (doc.numbersim) {
            await payload.update({
              collection: 'cardsim',
              id: typeof doc.numbersim === 'object' ? doc.numbersim.id : doc.numbersim,
              data: { status: 'disponible' },
            })
            console.log(`Tarjeta SIM liberada`)
          }
        } catch (error) {
          console.error('Error al liberar recursos en eliminación de asignación GPS:', error)
        }
      },
    ],
  },
  endpoints: [
    {
      path: '/:id/remove-file/:fileArrayId',
      method: 'delete',
      handler: async (req) => {
        try {
          //1. Acceso correcto a los parámetros de ruta
          const id = req.routeParams?.id as string
          const fileArrayId = req.routeParams?.fileArrayId as string

          if (!id || !fileArrayId) {
            return Response.json(
              { error: 'Se requieren los parámetros id y fileArrayId' },
              {
                status: 400,
                headers: headersWithCors({
                  headers: new Headers(),
                  req,
                }),
              },
            )
          }

          // 2. Obtener el documento actual
          const currentDoc = await req.payload.findByID({
            collection: 'assignmentgps',
            id,
            depth: 1,
            req,
          })

          if (!currentDoc) {
            return Response.json(
              { error: 'Asignación GPS no encontrada' },
              {
                status: 404,
                headers: headersWithCors({
                  headers: new Headers(),
                  req,
                }),
              },
            )
          }

          // 3. Validación del archivo
          const fileToDelete = currentDoc.gpsfiles?.find((file) => file.id === fileArrayId)

          if (!fileToDelete?.mediagps) {
            return Response.json(
              { error: 'Archivo no encontrado en esta asignación de GPS' },
              {
                status: 404,
                headers: headersWithCors({
                  headers: new Headers(),
                  req,
                }),
              },
            )
          }

          // 4. Eliminación segura del archivo físico
          const mediaId =
            typeof fileToDelete.mediagps === 'string'
              ? fileToDelete.mediagps
              : fileToDelete.mediagps.id

          await req.payload.delete({
            collection: 'mediagps',
            id: mediaId,
            req,
          })

          // 5. Actualización eficiente del documento
          const updatedDoc = await req.payload.update({
            collection: 'assignmentgps',
            id,
            data: {
              gpsfiles: currentDoc.gpsfiles?.filter((file) => file.id !== fileArrayId),
            },
            req,
          })

          // 6. Respuesta informativa
          return Response.json(
            {
              success: true,
              message: 'Archivo eliminado exitosamente',
              Assignmentgp: updatedDoc,
            },
            {
              headers: headersWithCors({
                headers: new Headers(),
                req,
              }),
            },
          )
        } catch (error) {
          return Response.json(
            { error: 'Error eliminando archivo', details: error },
            {
              status: 500,
              headers: headersWithCors({
                headers: new Headers(),
                req,
              }),
            },
          )
        }
      },
    },
  ],
}
