import type { CollectionConfig } from 'payload'
import { headersWithCors } from 'payload'

export const DocumentAditional: CollectionConfig = {
  slug: 'documentaditional',
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
    singular: 'Documento adicional de venta',
    plural: 'Documentos adicionales de ventas',
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
          name: 'datedocument',
          label: 'Fecha de documento',
          type: 'date',
          required: true,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'typedocumentaditional',
          label: 'Tipo de documento adicional',
          type: 'relationship',
          relationTo: 'typedocumentaditional',
          required: true,
          hasMany: false,
          admin: {
            width: '67%',
            allowCreate: true,
          },
        },
      ],
    },
    {
      name: 'documentaditionalfiles',
      label: 'Archivos',
      type: 'array',
      required: false,
      labels: {
        singular: 'Archivo',
        plural: 'Archivos',
      },
      fields: [
        {
          name: 'mediadocumentaditional',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediadocumentaditional',
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
            collection: 'documentaditional',
            id,
            depth: 1,
            req,
          })

          if (!currentDoc) {
            return Response.json(
              { error: 'Documento adicional no encontrada' },
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
          const fileToDelete = currentDoc.documentaditionalfiles?.find(
            (file) => file.id === fileArrayId,
          )

          if (!fileToDelete?.mediadocumentaditional) {
            return Response.json(
              { error: 'Archivo no encontrado en este documento adicional' },
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
            typeof fileToDelete.mediadocumentaditional === 'string'
              ? fileToDelete.mediadocumentaditional
              : fileToDelete.mediadocumentaditional.id

          await req.payload.delete({
            collection: 'mediadocumentaditional',
            id: mediaId,
            req,
          })

          // 5. Actualización eficiente del documento
          const updatedDoc = await req.payload.update({
            collection: 'documentaditional',
            id,
            data: {
              documentaditionalfiles: currentDoc.documentaditionalfiles?.filter(
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
