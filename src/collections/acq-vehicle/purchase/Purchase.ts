import { isAdmin, isAuthenticated } from '@/access/access'
import { generateSequence } from '@/utils/generateSequence'
import type { CollectionConfig } from 'payload'
import { headersWithCors } from 'payload'

export const Purchase: CollectionConfig = {
  slug: 'purchase',
  access: {
    read: isAuthenticated, // Cualquier empleado puede ver las compras
    create: isAuthenticated, // Cualquier empleado puede registrar compras
    update: isAuthenticated, // Cualquier empleado puede editar compras
    delete: isAdmin, // SOLO los administradores pueden borrar registros financieros
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
        // 1. Naturaleza de la compra
        {
          name: 'typepurchase',
          label: 'Tipo de compra',
          type: 'select',
          admin: { width: '50%' },
          required: true,
          options: ['Convencional', 'Consignación', 'Interna'],
          defaultValue: 'Convencional',
        },
        // 2. Motivo operativo / logistico
        {
          name: 'purchaseReason',
          label: 'Motivo de Adquisición',
          type: 'select',
          options: [
            { label: 'Para Stock General', value: 'stock' },
            { label: 'Atención de Pedido', value: 'order_fulfillment' },
          ],
          defaultValue: 'stock',
          required: true,
          admin: { width: '50%' },
        },
        // 3. Vínculo (Solo si es a pedido)
        {
          name: 'vehicleorder',
          label: 'Pedido vehicular asociado',
          type: 'relationship',
          relationTo: 'saleorder',
          required: false,
          admin: {
            description: 'Seleccione el pedido si el motivo es Atención de Pedido',
            allowCreate: false,
            condition: (data) => data.purchaseReason === 'order_fulfillment',
          },
        },

        // 4: Términos de consignación (Solo si el tipo es Consignación)
        {
          name: 'consignmentTerms',
          label: 'Términos del Contrato de Consignación',
          type: 'group',
          admin: {
            condition: (data) => data.typepurchase === 'Consignación',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'contractDurationDays',
                  type: 'number',
                  label: 'Días de Exclusividad (Contrato)',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
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
      name: 'reasonDeletion',
      label: 'Motivo de eliminación',
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
        {
          label: 'Eliminado',
          value: 'eliminado',
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
        {
          label: 'No aplicable',
          value: 'no aplicable',
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
        {
          label: 'No aplicable',
          value: 'no aplicable',
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
      type: 'join',
      label: 'Traslado de compra asociada',
      collection: 'purchasetransportation',
      on: 'purchase',
      maxDepth: 2,
      hasMany: false,
    },
    {
      name: 'cancellation',
      type: 'join',
      label: 'Cancelación de compra asociada',
      collection: 'purchasecancellation',
      on: 'purchase',
      maxDepth: 2,
    },
    {
      name: 'payment',
      type: 'join',
      label: 'Pago de compra asociada',
      collection: 'purchasepayment',
      on: 'purchase',
      maxDepth: 2,
    },

    {
      name: 'invoice',
      type: 'join',
      label: 'Comprobante de compra asociado',
      collection: 'purchaseinvoice',
      on: 'purchase',
      hasMany: false,
      maxDepth: 2,
    },
    {
      name: 'receptions',
      type: 'join',
      label: 'Recepción de compra asociada',
      collection: 'purchasereceptions',
      on: 'purchase',
      hasMany: false,
      maxDepth: 2,
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
      async ({ req, data, operation, originalDoc, context }) => {
        if (context.skipHook) {
          return data
        }
        const { payload, user } = req

        // ============================================================
        // 1. AUDITORÍA (Siempre va primero para asegurar user IDs)
        // ============================================================
        if (user) {
          if (operation === 'create') data.createdBy = user.id
          data.updatedBy = user.id
        }

        // ============================================================
        // 2. GENERADOR DE CORRELATIVO SEGURO (Anti-Race Condition)
        // En Purchase
        if (operation === 'create' && !data.purchaseNumber) {
          data.purchaseNumber = await generateSequence(payload, {
            name: 'purchase',
            prefix: 'COM-',
          })
        }
        // ============================================================
        // 3. LÓGICA CENTRALIZADA DE ESTADO (Integrada)
        // ============================================================
        if (operation === 'update') {
          const incomingPrice = data.pricepurchase
          const incomingPaid = data.amountpaid

          // Si cambió el precio O el monto pagado
          if (typeof incomingPrice !== 'undefined' || typeof incomingPaid !== 'undefined') {
            const finalPrice = incomingPrice ?? originalDoc.pricepurchase ?? 0
            const finalPaid = incomingPaid ?? originalDoc.amountpaid ?? 0

            if (data.status === 'eliminado') {
              data.statuspayment = 'no aplicable'
              return
            }

            let newStatus = originalDoc.statuspayment

            // Tolerancia decimal 0.01
            if (finalPaid >= finalPrice) {
              newStatus = 'completado'
            } else if (finalPaid > 0) {
              newStatus = 'parcial'
            } else {
              newStatus = 'pendiente'
            }

            // Solo aplicamos si no está anulado
            if (originalDoc.status !== 'anulado') {
              data.statuspayment = newStatus
            }
          }
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
        //agregar seguridad para que solo usuarios autenticados puedan eliminar archivos
        if (!req.user) {
          return Response.json(
            { error: 'No autorizado. Debes iniciar sesión.' },
            { status: 401, headers: headersWithCors({ headers: new Headers(), req }) },
          )
        }
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
        // Seguridad: Solo usuarios autenticados pueden acceder a este endpoint
        if (!req.user) {
          return Response.json(
            { error: 'No autorizado. Debes iniciar sesión.' },
            { status: 401, headers: headersWithCors({ headers: new Headers(), req }) },
          )
        }
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
