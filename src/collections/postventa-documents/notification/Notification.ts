import type { CollectionConfig } from 'payload'
import { headersWithCors } from 'payload'

export const Notification: CollectionConfig = {
  slug: 'notification',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Notificaciones y otros documentos adicionales',
  },
  labels: {
    singular: 'Notificación de venta',
    plural: 'Notificaciones de ventas',
  },
  fields: [
    {
      name: 'finalsale',
      label: 'Venta vehicular',
      type: 'relationship',
      relationTo: 'finalsale',
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
          name: 'datenotification',
          label: 'Fecha de notificación',
          type: 'date',
          required: true,
          timezone: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'typenotification',
          label: 'Tipo de notificación',
          type: 'select',
          required: true,
          admin: {
            width: '50%',
          },
          options: [
            {
              label: 'Vencimiento de cuotas',
              value: 'Vencimiento de cuotas',
            },
            {
              label: 'Transferencia vehicular pendiente',
              value: 'Transferencia vehicular pendiente',
            },
          ],
        },
      ],
    },
    {
      name: 'notificationfiles',
      label: 'Archivos',
      type: 'array',
      required: false,
      labels: {
        singular: 'Archivo',
        plural: 'Archivos',
      },
      fields: [
        {
          name: 'medianotification',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'medianotification',
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
            collection: 'notification',
            id,
            depth: 1,
            req,
          })

          if (!currentDoc) {
            return Response.json(
              { error: 'Notificacion no encontrada' },
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
          const fileToDelete = currentDoc.notificationfiles?.find((file) => file.id === fileArrayId)

          if (!fileToDelete?.medianotification) {
            return Response.json(
              { error: 'Archivo no encontrado en esta notificación' },
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
            typeof fileToDelete.medianotification === 'string'
              ? fileToDelete.medianotification
              : fileToDelete.medianotification.id

          await req.payload.delete({
            collection: 'medianotification',
            id: mediaId,
            req,
          })

          // 5. Actualización eficiente del documento
          const updatedDoc = await req.payload.update({
            collection: 'notification',
            id,
            data: {
              notificationfiles: currentDoc.notificationfiles?.filter(
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
              purchase: updatedDoc,
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
