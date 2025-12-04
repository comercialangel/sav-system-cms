import type { CollectionConfig } from 'payload'
import { headersWithCors } from 'payload'

export const TransferSale: CollectionConfig = {
  slug: 'transfersale',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Transferencias de unidades vehiculares',
  },
  labels: {
    singular: 'Transferencia vehicular',
    plural: 'Transferencias vehiculares',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'finalsale',
          label: 'Venta vehicular final',
          type: 'relationship',
          relationTo: 'finalsale',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },
        {
          name: 'Internalsales',
          label: 'Venta vehicular interna',
          type: 'relationship',
          relationTo: 'internal-sales',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },
        {
          name: 'transferdate',
          label: 'Fecha de firma',
          type: 'date',
          required: false,
          timezone: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'transferTo',
          label: 'Transferencia a',
          type: 'select',
          required: false,
          admin: {
            width: '50%',
          },
          options: [
            {
              label: 'Comprador(es)',
              value: 'comprador(es)',
            },
            {
              label: 'Tercero(s)',
              value: 'tercero(s)',
            },
          ],
        },
        {
          name: 'notary',
          label: 'Notaría',
          type: 'relationship',
          relationTo: 'notary',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: false,
          },
        },
        {
          name: 'collaborator',
          label: 'Colaborador que realizó la transferencia',
          type: 'relationship',
          relationTo: 'collaborator',
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
      name: 'vehicleTitleTransferToAThirdParty',
      label: 'Transferencia a tercero(s)',
      type: 'array',
      labels: {
        singular: 'Tercero',
        plural: 'Terceros',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'typeidentificationdocument',
              label: 'Tipo de documento de identificación',
              type: 'relationship',
              relationTo: 'typeidentificationdocument',
              required: true,
              hasMany: false,
              admin: {
                width: '50%',
                allowCreate: false,
              },
            },
            {
              name: 'identificationnumber',
              label: 'Número de identificación',
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
          name: 'fullname',
          label: 'Nombre completo',
          type: 'text',
          required: true,
        },
        {
          name: 'mediathirddni',
          label: 'DNI (Documento de identidad) ',
          type: 'upload',
          relationTo: 'mediatransfersale',
          required: true,
        },
        {
          name: 'observationsthird',
          label: 'Observaciones',
          type: 'textarea',
          required: false,
        },
      ],
    },
    {
      name: 'vouchertransfersale',
      label: 'Lista de voucher a utilizar',
      type: 'relationship',
      relationTo: 'vouchertransfersale',
      required: false,
      hasMany: true,
      admin: {
        width: '50%',
        allowCreate: false,
      },
    },
    {
      name: 'transfersalefiles',
      label: 'Archivos',
      type: 'array',
      required: false,
      labels: {
        singular: 'Archivo',
        plural: 'Archivos',
      },
      fields: [
        {
          name: 'mediatransfersale',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediatransfersale',
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
          label: 'Pendiente',
          value: 'pendiente',
        },
        {
          label: 'En proceso',
          value: 'en proceso',
        },
        {
          label: 'Finalizado',
          value: 'finalizado',
        },
      ],
      defaultValue: 'pendiente',
    },
    {
      name: 'finish',
      label: 'Finalización de transferencia',
      type: 'group',
      admin: {
        description: 'Esta sección será completada unicamente si se ha concretado la transferencia',
      },
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
        {
          name: 'observationsfinish',
          label: 'Observaciones',
          type: 'textarea',
          required: false,
        },
      ],
    },
  ],

  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        const { payload } = req

        // Solo ejecutar para operaciones de creación o actualización
        if (operation === 'update') {
          const voucherIds = doc.vouchertransfersale || []

          // Normalizar los IDs: extraer 'id' si son objetos, o usar directamente si son strings
          const normalizedVoucherIds = Array.isArray(voucherIds)
            ? voucherIds.map((voucher) =>
                typeof voucher === 'object' && voucher?.id ? voucher.id : voucher,
              )
            : []

          // Actualizar el estado de cada voucher en vouchertransfersale
          if (normalizedVoucherIds.length > 0) {
            try {
              await Promise.all(
                normalizedVoucherIds.map(async (voucherId) => {
                  // Verificar que el voucherId sea un string válido
                  if (typeof voucherId === 'string' && voucherId) {
                    await payload.update({
                      collection: 'vouchertransfersale',
                      id: voucherId,
                      data: {
                        status: 'utilizado',
                      },
                      req,
                    })
                  }
                }),
              )
              console.log(
                `Vouchers actualizados a estado 'utilizado': ${normalizedVoucherIds.join(', ')}`,
              )
            } catch (error) {
              console.error(`Error al actualizar vouchers: ${error}`)
            }
          }
        }

        return doc // Retornar el documento sin cambios
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
            collection: 'transfersale',
            id,
            depth: 1,
            req,
          })

          if (!currentDoc) {
            return Response.json(
              { error: 'Compra no encontrada' },
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
          const fileToDelete = currentDoc.transfersalefiles?.find((file) => file.id === fileArrayId)

          if (!fileToDelete?.mediatransfersale) {
            return Response.json(
              { error: 'Archivo no encontrado en esta transferencia' },
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
            typeof fileToDelete.mediatransfersale === 'string'
              ? fileToDelete.mediatransfersale
              : fileToDelete.mediatransfersale.id

          await req.payload.delete({
            collection: 'mediatransfersale',
            id: mediaId,
            req,
          })

          // 5. Actualización eficiente del documento
          const updatedDoc = await req.payload.update({
            collection: 'transfersale',
            id,
            data: {
              transfersalefiles: currentDoc.transfersalefiles?.filter(
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
