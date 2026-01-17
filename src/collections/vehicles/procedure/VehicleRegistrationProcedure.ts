import type { CollectionConfig } from 'payload'
import { headersWithCors } from 'payload'

export const VehicleRegistrationProcedure: CollectionConfig = {
  slug: 'vehicleregistrationprocedure',
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
    singular: 'Trámite de inscripción vehicular',
    plural: 'Trámites de inscripción vehicular',
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
      },
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
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startdate',
          label: 'Fecha de inicio',
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
              required: true,
              hasMany: false,
              admin: {
                width: '50%',
                allowCreate: false,
              },
            },
            {
              name: 'titlenumber',
              label: 'Número de título',
              type: 'text',
              required: false,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'registrationprocessor',
              label: 'Tramitador de inscripción',
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
              relationTo: 'expenseproceduresunarp',
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
          type: 'row',
          fields: [
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
              type: 'text',
              required: true,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'mediaexpenseproceduresunarp',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediaexpenseproceduresunarp',
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
          name: 'mediaprocedureregistration',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediaprocedureregistration',
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
            {
              name: 'licenseplate',
              label: 'Placa de rodaje vehicular',
              type: 'text',
              required: false,
              admin: {
                width: '50%',
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
                width: '100%',
                allowCreate: false,
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
          label: 'TIVE (Tarjeta de identificación vehicular electrónica',
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
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'update' && doc.status === 'Inscrito') {
          try {
            // Verificar que tenemos todos los datos necesarios
            if (!doc.vehicle || !doc.procedurefinish?.licenseplate) {
              throw new Error('Datos incompletos para crear procedimiento de placas')
            }

            const vehicleId = typeof doc.vehicle === 'object' ? doc.vehicle.id : doc.vehicle
            const licensePlateNumber = doc.procedurefinish.licenseplate
            const licensePlateUsageType = doc.procedurefinish.licensePlateUsageType.id

            // Crear un nuevo registro en licenseplateissuanceprocedure
            await req.payload.create({
              collection: 'licenseplateissuanceprocedure',
              data: {
                vehicleregistration: doc.id,
                optionsprocedure: doc.optionsprocedure,
                // status: 'Pendiente', // Estado inicial
                status:
                  doc.optionsprocedure === 'procedureprovider' ? 'Trámite en proceso' : 'Pendiente',
                // startdate: new Date().toISOString(), // Fecha actual como inicio
                startdate:
                  doc.optionsprocedure === 'procedureprovider' ? doc.procedurefinish.enddate : null,
              },
            })

            // Actualización única del vehículo con ambos campos
            await req.payload.update({
              collection: 'vehicle',
              id: vehicleId,
              data: {
                licensePlates: {
                  // licensePlateIssuanceProcedure: newLicensePlateProcedure.id,
                  licensePlatesNumber: licensePlateNumber,
                  licensePlateUsageType: licensePlateUsageType,
                },
              },
            })
          } catch (error) {
            console.error('Error al enviar placa al vehiculo', error)
          }
        }
      },
    ],
  },
  endpoints: [
    //endpoint para eliminar un archivo de inscripción
    // y eliminar el archivo físico asociado
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
            collection: 'vehicleregistrationprocedure',
            id,
            depth: 1,
            req,
          })

          if (!currentDoc) {
            return Response.json(
              { error: 'Trámite de inscripción no encontrada' },
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

          if (!fileToDelete?.mediaprocedureregistration) {
            return Response.json(
              { error: 'Archivo no encontrado en este trámite inscripción' },
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
            typeof fileToDelete.mediaprocedureregistration === 'string'
              ? fileToDelete.mediaprocedureregistration
              : fileToDelete.mediaprocedureregistration.id

          await req.payload.delete({
            collection: 'mediaprocedureregistration',
            id: mediaId,
            req,
          })

          // 5. Actualización eficiente del documento
          const updatedDoc = await req.payload.update({
            collection: 'vehicleregistrationprocedure',
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

    //endpoint para lista de registros de tramites
    {
      path: '/procedurelist',
      method: 'get',
      handler: async (req) => {
        try {
          const { payload } = req

          // 1. Obtener todos los vehículos en proceso de registro
          const vehiclesInProcess = await payload.find({
            collection: 'vehicleregistrationprocedure',
            where: {
              status: { equals: 'En proceso' },
            },
            depth: 1, // Solo necesitamos el ID del vehículo
            limit: 50,
          })

          // 2. Extraer IDs de vehículos a excluir
          const excludedVehicleIds = vehiclesInProcess.docs
            .map((doc) => (typeof doc.vehicle === 'object' ? doc.vehicle.id : doc.vehicle))
            .filter(Boolean)

          // 3. Obtener vehículos de inventario que NO están en proceso
          const inventoryVehicles = await payload.find({
            collection: 'inventory',
            where: {
              and: [
                { status: { in: ['En Stock', 'En Tránsito'] } },
                { vehicle: { not_in: excludedVehicleIds } },
                { 'vehicle.conditionvehicle.condition': { equals: 'Nuevo' } },
              ],
            },
            depth: 2, // Para poblar relaciones básicas
            limit: 1000,
          })

          // 4. Formatear respuesta simple
          return Response.json(
            {
              success: true,
              data: inventoryVehicles.docs.map((vehicle) => ({
                id: vehicle.id,
                brand: typeof vehicle.vehicle === 'object' ? vehicle.vehicle.brand : 'sin marca',
                model: typeof vehicle.vehicle === 'object' ? vehicle.vehicle.model : 'Sin modelo',
                version:
                  typeof vehicle.vehicle === 'object' ? vehicle.vehicle.version : 'Sin version',
                color: typeof vehicle.vehicle === 'object' ? vehicle.vehicle.color : 'Sin color',
                yearmodel:
                  typeof vehicle.vehicle === 'object' ? vehicle.vehicle.yearmodel : 'Sin modelo',
                vin: typeof vehicle.vehicle === 'object' ? vehicle.vehicle.vin : 'Sin chasis',
                motor: typeof vehicle.vehicle === 'object' ? vehicle.vehicle.motor : 'Sin motor',
                status: vehicle.status,
              })),
              count: inventoryVehicles.totalDocs,
            },
            {
              headers: headersWithCors({ headers: new Headers(), req }),
            },
          )
        } catch (error) {
          console.error('Error en /procedurelist:', error)
          return Response.json(
            {
              success: false,
              error: 'Error al obtener vehículos disponibles',
            },
            {
              status: 500,
              headers: headersWithCors({ headers: new Headers(), req }),
            },
          )
        }
      },
    },

    // Endpoint para eliminar un gasto específico de un gasto de inscripción
    // y eliminar el registro asociado al gasto si existe
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
            collection: 'vehicleregistrationprocedure',
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
          if (expenseToDelete.mediaexpenseproceduresunarp) {
            const mediaId =
              typeof expenseToDelete.mediaexpenseproceduresunarp === 'string'
                ? expenseToDelete.mediaexpenseproceduresunarp
                : expenseToDelete.mediaexpenseproceduresunarp.id

            await req.payload.delete({
              collection: 'mediaexpenseproceduresunarp',
              id: mediaId,
              req,
            })
          }

          // 5. Actualizar el documento eliminando el gasto
          const updatedDoc = await req.payload.update({
            collection: 'vehicleregistrationprocedure',
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
