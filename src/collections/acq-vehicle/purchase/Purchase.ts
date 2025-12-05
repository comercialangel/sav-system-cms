import type { CollectionConfig } from 'payload'
import { headersWithCors } from 'payload'

export const Purchase: CollectionConfig = {
  slug: 'purchase',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'purchaseNumber',
    group: 'Adquisiciones vehiculares',
  },
  labels: {
    singular: 'Compra',
    plural: 'Compras',
  },
  fields: [
    {
      name: 'purchaseNumber',
      label: 'Número de compra',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        readOnly: true, // Hace que el campo sea de solo lectura en la interfaz de administración
        hidden: true,
      },
    },
    {
      name: 'company',
      label: 'Empresa compradora',
      type: 'relationship',
      relationTo: 'company',
      required: true,
      hasMany: false,
      maxDepth: 2,
      admin: {
        allowCreate: false,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'typepurchase',
          label: 'Tipo de compra',
          type: 'select',
          admin: {
            width: '50%',
          },
          required: true,
          options: ['Convencional', 'Pedido', 'Interna', 'Consignación'],
          defaultValue: 'Convencional',
        },
        {
          name: 'purchasedate',
          label: 'Fecha de compra',
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
        /* {
          name: 'vehicleorder',
          label: 'Pedido vehicular',
          type: 'relationship',
          relationTo: 'saleorder',
          required: false,
          admin: {
            description: 'Seleccione un opción si el tipo de compra es PEDIDO',
            allowCreate: false,
            condition: (data) => data.typepurchase === 'Pedido',
          },
        }, */
        {
          name: 'supplier',
          label: 'Proveedor',
          type: 'relationship',
          relationTo: 'supplier',
          required: true,
          maxDepth: 1,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: true,
          },
        },
        {
          name: 'suppliercontact',
          label: 'Asesor de ventas',
          type: 'relationship',
          relationTo: 'suppliercontact',
          required: false,
          hasMany: false,
          maxDepth: 1,
          admin: {
            width: '50%',
            allowCreate: true,
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
          name: 'pricepurchase',
          label: 'Precio de compra',
          type: 'number',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'amountpaid',
          label: 'Monto pagado',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            hidden: true,
          },
        },
      ],
    },
    {
      name: 'vehicle',
      label: 'Unidad vehicular',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'brand',
              label: 'Marca',
              type: 'relationship',
              relationTo: 'brand',
              required: true,
              maxDepth: 1,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: true,
              },
            },
            {
              name: 'model',
              label: 'Modelo',
              type: 'relationship',
              relationTo: 'model',
              required: true,
              maxDepth: 1,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: true,
              },
            },
            {
              name: 'version',
              label: 'Versión',
              type: 'relationship',
              relationTo: 'version',
              required: true,
              maxDepth: 1,
              hasMany: false,
              admin: {
                width: '34%',
                allowCreate: true,
              },
            },
            {
              name: 'color',
              label: 'Color',
              type: 'relationship',
              relationTo: 'color',
              required: true,
              hasMany: false,
              admin: {
                width: '33%',
                allowCreate: true,
              },
            },
            {
              name: 'yearmodel',
              label: 'Año de modelo',
              type: 'number',
              required: true,
              admin: {
                width: '33%',
              },
            },
            {
              name: 'fuel',
              label: 'Combustible',
              type: 'relationship',
              relationTo: 'fuel',
              required: true,
              hasMany: false,
              admin: {
                width: '34%',
                allowCreate: true,
              },
            },
            {
              name: 'condition',
              label: 'Condición de vehicular',
              type: 'select',
              admin: {
                width: '33%',
              },
              options: ['Nuevo', 'Usado'],
              required: true,
              defaultValue: 'Nuevo',
            },
            {
              name: 'licensePlatesNumber',
              label: 'Placas de rodaje',
              type: 'text',
              required: false,
              admin: {
                width: '33%',
              },
            },
            {
              name: 'licensePlateUsageType',
              label: 'Tipo de uso',
              type: 'relationship',
              relationTo: 'typeuse',
              required: false,
              hasMany: false,
              admin: {
                width: '67%',
                allowCreate: false,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'purchasefiles',
      label: 'Archivos',
      type: 'array',
      labels: {
        singular: 'Archivo',
        plural: 'Archivos',
      },
      required: false,
      fields: [
        {
          name: 'mediapurchase',
          label: 'Archivo',
          type: 'upload',
          maxDepth: 4,
          relationTo: 'mediapurchase',
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
      name: 'status',
      label: 'Estado',
      type: 'select',
      required: true,
      admin: {
        position: 'sidebar',
      },
      options: [
        {
          label: 'Aprobado',
          value: 'aprobado',
        },
        {
          label: 'Anulado',
          value: 'anulado',
        },
      ],
      defaultValue: 'aprobado',
    },
    {
      name: 'statusreception',
      type: 'select',
      label: 'Estado de recepción',
      admin: {
        readOnly: false,
        position: 'sidebar',
      },
      options: [
        {
          label: 'En tránsito',
          value: 'en transito',
        },
        {
          label: 'Recepcionado',
          value: 'recepcionado',
        },
        {
          label: 'Pendiente',
          value: 'pendiente',
        },
        {
          label: 'Cancelado',
          value: 'cancelado',
        },
      ],
      defaultValue: 'pendiente',
    },
    {
      name: 'statuspayment',
      label: 'Estado de pagos',
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
          label: 'Parcial',
          value: 'parcial',
        },
        {
          label: 'Completado',
          value: 'completado',
        },
        {
          label: 'Por retornar',
          value: 'por retornar',
        },
        {
          label: 'Retorno parcial',
          value: 'retorno parcial',
        },
        {
          label: 'Retornado',
          value: 'retornado',
        },
      ],
      defaultValue: 'pendiente',
    },
    {
      name: 'statusreceipt',
      label: 'Estado de comprobante',
      type: 'select',
      required: true,
      admin: {
        position: 'sidebar',
      },
      options: [
        {
          label: 'No aplicable',
          value: 'no aplicable',
        },
        {
          label: 'Pendiente',
          value: 'pendiente',
        },
        {
          label: 'Recibido',
          value: 'recibido',
        },
        {
          label: 'Cancelado',
          value: 'cancelado',
        },
        {
          label: 'Anulado',
          value: 'anulado',
        },
      ],
      defaultValue: 'pendiente',
    },
    {
      name: 'transportation',
      type: 'relationship',
      label: 'Traslado de compra asociada',
      relationTo: 'purchasetransportation',
      hasMany: false,
      index: true,
      admin: {
        readOnly: false,
        position: 'sidebar',
        allowEdit: false,
      },
    },
    {
      name: 'cancellation',
      type: 'join',
      label: 'Cancelación de compra asociada',
      collection: 'purchasecancellation',
      on: 'purchase',
      maxDepth: 1,
    },
    // {
    //   name: 'cancellation',
    //   type: 'relationship',
    //   label: 'Cancelación de compra asociada',
    //   relationTo: 'purchasecancellation',
    //   hasMany: false,
    //   admin: {
    //     readOnly: false,
    //     position: 'sidebar',
    //     allowEdit: false,
    //   },
    // },
    // {
    //   name: 'payment',
    //   type: 'relationship',
    //   label: 'Pago de compra asociada',
    //   relationTo: 'purchasepayment',
    //   hasMany: true,
    //   maxDepth: 2,
    //   admin: {
    //     readOnly: false,
    //     position: 'sidebar',
    //     allowEdit: false,
    //   },
    // },

    {
      name: 'payment',
      type: 'join',
      label: 'Pago de compra asociada',
      collection: 'purchasepayment',
      on: 'purchase',
    },

    {
      name: 'invoice',
      type: 'relationship',
      label: 'Comprobante de compra asociado',
      relationTo: 'purchaseinvoice',
      hasMany: false,
      admin: {
        readOnly: false,
        position: 'sidebar',
        allowEdit: false,
      },
    },
    {
      name: 'receptions',
      type: 'relationship',
      label: 'Recepción de compra asociada',
      relationTo: 'purchasereceptions',
      hasMany: false,
      maxDepth: 2,
      index: true,
      admin: {
        readOnly: false,
        position: 'sidebar',
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
    // afterChange: [
    //   async ({ doc, previousDoc, operation }) => {
    //     // Lógica para actualizar statuspayment cuando pricepurchase > amountpaid o iguales
    //     if (
    //       operation === 'update' &&
    //       (doc.pricepurchase !== undefined || doc.amountpaid !== undefined)
    //     ) {
    //       const currentPricePurchase = doc.pricepurchase ?? previousDoc?.pricepurchase ?? 0
    //       const currentAmountPaid = doc.amountpaid ?? previousDoc?.amountpaid ?? 0

    //       if (currentPricePurchase === currentAmountPaid && currentAmountPaid !== 0) {
    //         doc.statuspayment = 'completado'
    //       } else if (currentPricePurchase > currentAmountPaid && currentAmountPaid !== 0) {
    //         doc.statuspayment = 'parcial'
    //       } else if (currentAmountPaid === 0) {
    //         doc.statuspayment = 'pendiente'
    //       }
    //     }

    // if (operation === 'update' && data.status === 'anulado') {
    //   data.statuspayment = 'por retornar'
    // }
    //   },
    // ],

    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        // Si la compra está anulada, no actualizar el statuspayment
        if (doc.status === 'anulado') {
          return
        }

        // Lógica para actualizar statuspayment cuando pricepurchase > amountpaid o iguales
        const { payload } = req
        if (
          operation === 'update' &&
          (doc.pricepurchase !== undefined || doc.amountpaid !== undefined)
        ) {
          const currentPricePurchase = doc.pricepurchase ?? previousDoc?.pricepurchase ?? 0
          const currentAmountPaid = doc.amountpaid ?? previousDoc?.amountpaid ?? 0
          let newStatus = doc.statuspayment

          if (currentPricePurchase === currentAmountPaid && currentAmountPaid !== 0) {
            newStatus = 'completado'
          } else if (currentPricePurchase > currentAmountPaid && currentAmountPaid !== 0) {
            newStatus = 'parcial'
          } else if (currentAmountPaid === 0) {
            newStatus = 'pendiente'
          }

          // Solo actualizar si el estado cambió
          if (newStatus !== doc.statuspayment) {
            try {
              await payload.update({
                collection: 'purchase',
                id: doc.id,
                data: {
                  statuspayment: newStatus,
                },
              })
            } catch (error) {
              console.error('Error updating purchase status:', error)
            }
          }
        }
      },
    ],
    beforeChange: [
      async ({ req: { user }, data, operation, originalDoc, req }) => {
        // Lógica para generar el número de compra (solo en creación)
        if (operation === 'create') {
          // Obtener el último número de compra
          const lastOrder = await req.payload.find({
            collection: 'purchase',
            limit: 1,
            sort: '-purchaseNumber', // Ordenar por purchaseNumber descendente
          })

          let lastOrderNumber = 'C1-00000000' // Valor por defecto si no hay compras

          if (lastOrder.docs.length > 0) {
            lastOrderNumber = lastOrder.docs[0].purchaseNumber
          }

          // Extraer el número y incrementarlo
          const lastNumber = parseInt(lastOrderNumber.split('-')[1], 10)
          const newNumber = lastNumber + 1

          // Formatear el nuevo número de compra con 8 dígitos
          const formattedNumber = `C1-${String(newNumber).padStart(8, '0')}`

          // Asignar el nuevo número de compra al campo orderNumber
          data.purchaseNumber = formattedNumber
        }
        // Lógica para manejar createdBy y updatedBy
        if (user) {
          if (!originalDoc?.createdBy) {
            data.createdBy = user.id // Asignar createdBy si no existe
          }
          data.updatedBy = user.id // Siempre actualizar updatedBy
        }
        return data
      },
    ],
  },
  // Agregar endpoints personalizados
  endpoints: [
    //enpoint para eliminar un archivo de compra
    // y eliminar su respectivo archivo físico asociado
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
            collection: 'purchase',
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
          const fileToDelete = currentDoc.purchasefiles?.find((file) => file.id === fileArrayId)

          if (!fileToDelete?.mediapurchase) {
            return Response.json(
              { error: 'Archivo no encontrado en esta compra' },
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
            typeof fileToDelete.mediapurchase === 'string'
              ? fileToDelete.mediapurchase
              : fileToDelete.mediapurchase.id

          await req.payload.delete({
            collection: 'mediapurchase',
            id: mediaId,
            req,
          })

          // 5. Actualización eficiente del documento
          const updatedDoc = await req.payload.update({
            collection: 'purchase',
            id,
            data: {
              purchasefiles: currentDoc.purchasefiles?.filter((file) => file.id !== fileArrayId),
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

    {
      path: '/purchase-summary',
      method: 'get',
      handler: async (req) => {
        try {
          const { payload, query } = req

          // Extraer parámetros de la consulta
          const startDate = query.startDate ? new Date(query.startDate as string) : undefined
          const endDate = query.endDate ? new Date(query.endDate as string) : undefined

          // Validar parámetros
          if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'Parámetros startDate y endDate son requeridos y deben ser fechas válidas',
              }),
              {
                status: 400,
                headers: headersWithCors({
                  headers: new Headers(),
                  req,
                }),
              },
            )
          }

          // Consulta con payload.find
          const result = await payload.find({
            collection: 'purchase',
            depth: 3, // Asegurar que vehicle.brand, vehicle.model, receptions.vehicle, supplier estén poblados
            where: {
              and: [
                {
                  purchasedate: { greater_than: startDate.toISOString() },
                },
                {
                  purchasedate: { less_than: endDate.toISOString() },
                },
                {
                  statusreception: { not_equals: 'cancelado' },
                },
              ],
            },
            sort: '-purchasedate',
            select: {
              id: 1,
              vehicle: true,
              receptions: true,
              supplier: true,
              typepurchase: true,
              purchaseNumber: true,
              purchasedate: true,
              invoice: true,
              statusreceipt: true,
            },
          })

          return Response.json(
            {
              success: true,
              docs: result.docs,
              totalDocs: result.totalDocs,
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
            { error: 'Error al realizar peticion de compras', details: error },
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
