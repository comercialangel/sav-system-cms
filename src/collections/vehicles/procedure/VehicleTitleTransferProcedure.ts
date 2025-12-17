import type { CollectionConfig } from 'payload'
import { headersWithCors } from 'payload'

export const VehicleTitleTransferProcedure: CollectionConfig = {
  slug: 'vehicletitletransferprocedure',
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
    singular: 'Trámite por transferencia de titularidad vehicular',
    plural: 'Trámites por transferencia de titularidad vehicular',
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
        allowEdit: false,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startdate',
          label: 'Fecha de transferencia',
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
          name: 'notary',
          label: 'Notaría',
          type: 'relationship',
          relationTo: 'notary',
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
              relationTo: 'expenseproceduretitletransfer',
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
          name: 'mediaproceduretitletransfer',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediaproceduretitletransfer',
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
      name: 'registrationprocedurefiles',
      label: 'Archivos de trámite',
      type: 'array',
      required: false,
      labels: {
        singular: 'Archivo',
        plural: 'Archivos',
      },
      fields: [
        {
          name: 'mediaproceduretitletransfer',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediaproceduretitletransfer',
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
                width: '50%',
                date: {
                  displayFormat: 'd MMM yyy',
                },
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
      defaultValue: 'En proceso',
    },
  ],
  endpoints: [
    // Endpoint para eliminar un archivo
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
            collection: 'vehicletitletransferprocedure',
            id,
            depth: 1,
            req,
          })

          if (!currentDoc) {
            return Response.json(
              { error: 'vehículo no encontrada' },
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
          const fileToDelete = currentDoc.registrationprocedurefiles?.find(
            (file) => file.id === fileArrayId,
          )

          if (!fileToDelete?.mediaproceduretitletransfer) {
            return Response.json(
              { error: 'Imagen no encontrada en esta galería vehicular' },
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
            typeof fileToDelete.mediaproceduretitletransfer === 'string'
              ? fileToDelete.mediaproceduretitletransfer
              : fileToDelete.mediaproceduretitletransfer.id

          await req.payload.delete({
            collection: 'mediaproceduretitletransfer',
            id: mediaId,
            req,
          })

          // 5. Actualización eficiente del documento
          const updatedDoc = await req.payload.update({
            collection: 'vehicletitletransferprocedure',
            id,
            data: {
              registrationprocedurefiles: currentDoc.registrationprocedurefiles?.filter(
                (file) => file.id !== fileArrayId,
              ),
            },
            req,
          })

          // 6. Respuesta informativa
          return Response.json(
            {
              success: true,
              message: 'Archivo eliminado exitosamente',
              vehicle: updatedDoc,
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

    // Endpoint para eliminar un gasto específico
    {
      path: '/:id/remove-expense/:expenseId',
      method: 'delete',
      handler: async (req) => {
        try {
          // 1. Obtener parámetros de la ruta
          const id = req.routeParams?.id as string
          const expenseId = req.routeParams?.expenseId as string

          if (!id || !expenseId) {
            return Response.json(
              { error: 'Se requieren los parámetros id y expenseId' },
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
            collection: 'vehicletitletransferprocedure',
            id,
            depth: 1,
            req,
          })

          if (!currentDoc) {
            return Response.json(
              { error: 'Traslado no encontrado' },
              {
                status: 404,
                headers: headersWithCors({
                  headers: new Headers(),
                  req,
                }),
              },
            )
          }

          // 3. Validar que el gasto existe
          const expenseToDelete = currentDoc.expenselist?.find(
            (expense) => expense.id === expenseId,
          )

          if (!expenseToDelete) {
            return Response.json(
              { error: 'Gasto no encontrado en este traslado' },
              {
                status: 404,
                headers: headersWithCors({
                  headers: new Headers(),
                  req,
                }),
              },
            )
          }

          // 4. Eliminar archivo asociado si existe
          if (expenseToDelete.mediaproceduretitletransfer) {
            const mediaId =
              typeof expenseToDelete.mediaproceduretitletransfer === 'string'
                ? expenseToDelete.mediaproceduretitletransfer
                : expenseToDelete.mediaproceduretitletransfer.id

            await req.payload.delete({
              collection: 'mediaproceduretitletransfer',
              id: mediaId,
              req,
            })
          }

          // 5. Actualizar el documento eliminando el gasto
          const updatedDoc = await req.payload.update({
            collection: 'vehicletitletransferprocedure',
            id,
            data: {
              expenselist: currentDoc.expenselist?.filter((expense) => expense.id !== expenseId),
            },
            req,
          })

          // 6. Respuesta exitosa
          return Response.json(
            {
              success: true,
              message: 'Gasto eliminado exitosamente',
              transportation: updatedDoc,
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
            { error: 'Error eliminando gasto', details: error },
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
