import type { CollectionConfig } from 'payload'
import { headersWithCors } from 'payload'

export const Vehicle: CollectionConfig = {
  slug: 'vehicle',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'vehicle',
    group: 'Unidades vehiculares',
  },
  labels: {
    singular: 'Vehículo',
    plural: 'Vehículos',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'purchaseReception',
          label: 'Recepción de Compra Asociada',
          type: 'relationship',
          relationTo: 'purchasereceptions',
          hasMany: false,
          admin: {
            readOnly: true, // Para evitar modificaciones manuales
            hidden: true, // Opcional: ocultar si no es relevante en la UI
            condition: (data) => !data?.purchaseReception, // Opcional: solo mostrar si no está establecido
          },
        },
        {
          name: 'brand',
          label: 'Marca',
          type: 'relationship',
          relationTo: 'brand',
          required: true,
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
          name: 'yearmanufacture',
          label: 'Año de fabricación',
          type: 'number',
          required: false,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'yearmodel',
          label: 'Año de modelo',
          type: 'number',
          required: true,
          admin: {
            width: '34%',
          },
        },
        {
          name: 'vin',
          label: 'Chasis',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'motor',
          label: 'Motor',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'cylindercapacity',
          label: 'Cilindrada',
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
            width: '33%',
            allowCreate: true,
          },
        },
        {
          name: 'transmission',
          label: 'Transmisión',
          type: 'relationship',
          relationTo: 'transmission',
          required: true,
          hasMany: false,
          admin: {
            width: '34%',
            allowCreate: true,
          },
        },
        {
          name: 'traction',
          label: 'Tracción',
          type: 'relationship',
          relationTo: 'traction',
          required: true,
          hasMany: false,
          admin: {
            width: '33%',
            allowCreate: true,
          },
        },
        {
          name: 'carbody',
          label: 'Carrocería',
          type: 'relationship',
          relationTo: 'carbody',
          required: true,
          hasMany: false,
          admin: {
            width: '33%',
            allowCreate: true,
          },
        },
        {
          name: 'category',
          label: 'Cartegoría',
          type: 'relationship',
          relationTo: 'category',
          required: true,
          hasMany: false,
          admin: {
            width: '34%',
            allowCreate: true,
          },
        },
        {
          name: 'seat',
          label: 'Asientos',
          type: 'number',
          required: true,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'rimnumber',
          label: 'Número de aro',
          type: 'number',
          required: true,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'typerim',
          label: 'Tipo de aro',
          type: 'relationship',
          relationTo: 'typerim',
          required: true,
          hasMany: false,
          admin: {
            width: '34%',
            allowCreate: true,
          },
        },
      ],
    },
    {
      name: 'referenceimage',
      label: 'Imagen referencial (Perfil vehicular)',
      type: 'upload',
      relationTo: 'mediareferenceimage',
      required: false,
    },
    {
      name: 'galleryfiles',
      label: 'Galería vehicular',
      type: 'array',
      required: false,
      labels: {
        singular: 'Imagen',
        plural: 'Imágenes',
      },
      fields: [
        {
          name: 'mediagallery',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'mediagallery',
          required: true,
        },
      ],
    },
    {
      name: 'vehicle',
      label: 'Vehículo',
      type: 'text',
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            interface AccountData {
              brand: string
              model: string
              vin: string
            }
            const typedata = data as AccountData

            if (typedata.brand && typedata.model && typedata.vin) {
              let brandName = ''
              let modelName = ''

              // Obtener el nombre de la compañía
              const brand = await req.payload.findByID({
                collection: 'brand',
                id: typedata.brand,
              })
              if (brand) {
                brandName = brand.brand || '' // Supongamos que 'name' es el campo en 'company'
              }
              // Obtener el tipo de banco
              const model = await req.payload.findByID({
                collection: 'model',
                id: typedata.model,
              })
              if (model) {
                modelName = model.model || '' // Ajusta según el campo real en 'typebank'
              }
              // Formatear la información combinada
              return `${brandName} ${modelName} - CH: ${typedata.vin}`
            }
          },
        ],
      },
      admin: {
        hidden: true, // Oculto en el admin panel ya que no se puede editar directamente
      },
    },
    {
      name: 'conditionvehicle',
      label: 'Condición vehicular',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'condition',
              label: 'Condición',
              type: 'select',
              required: true,
              admin: {
                width: '50%',
              },
              options: ['Nuevo', 'Usado'],
              defaultValue: 'Nuevo',
            },
            {
              name: 'mileage',
              label: 'Kilometraje',
              type: 'text',
              required: false,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'note',
          label: 'Notas (Opcional)',
          type: 'textarea',
          required: false,
        },
      ],
    },
    {
      name: 'equipmentbasic',
      label: 'Equipamiento vehicular básico',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'vehiclekey',
              label: 'Llaves de contacto',
              type: 'number',
              required: false,
              admin: {
                width: '33%',
              },
            },
          ],
        },
        {
          name: 'basicequipment',
          label: 'Equipamiento básico',
          type: 'relationship',
          relationTo: 'basicequipment',
          required: false,
          hasMany: true,
          admin: {
            allowCreate: true,
          },
        },
      ],
    },
    {
      name: 'internalequipment',
      label: 'Equipamiento vehicular interno',
      type: 'group',
      fields: [
        {
          name: 'internalequipment',
          label: 'Equipamiento interno (estándar de fábrica)',
          type: 'relationship',
          relationTo: 'internalequipment',
          required: false,
          hasMany: true,
          admin: {
            allowCreate: true,
          },
        },
        {
          name: 'internaladitional',
          label: 'Equipamiento interno (adicional)',
          type: 'array',
          required: false,
          labels: {
            singular: 'Equipamiento interno',
            plural: 'Equipamientos internos',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'internaldate',
                  label: 'Fecha',
                  type: 'date',
                  timezone: true,
                  required: true,
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'internalequipment',
                  label: 'Accesorio',
                  type: 'relationship',
                  relationTo: 'internalequipment',
                  required: true,
                  hasMany: false,
                  admin: {
                    width: '67%',
                    allowCreate: true,
                  },
                },
                {
                  name: 'typecurrencyinternal',
                  label: 'Tipo de moneda',
                  type: 'relationship',
                  relationTo: 'typecurrency',
                  required: true,
                  hasMany: false,
                  admin: {
                    width: '33%',
                    allowCreate: false,
                  },
                },
                {
                  name: 'exchangerateinternal',
                  label: 'Tipo de cambio',
                  type: 'number',
                  defaultValue: 1,
                  required: false,
                },
                {
                  name: 'internalvalue',
                  label: 'Valor',
                  type: 'number',
                  defaultValue: 0,
                  required: true,
                  admin: {
                    width: '34%',
                  },
                },
              ],
            },
            {
              name: 'mediainternalequipment',
              label: 'Archivo',
              type: 'upload',
              relationTo: 'mediaequipment',
              required: false,
            },
            {
              name: 'observationsinternal',
              label: 'Observaciones',
              type: 'textarea',
              required: false,
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'totalExpenseInUSD',
              label: 'Total USD',
              type: 'number',
              defaultValue: 0,
              required: true,
              admin: {
                width: '50%',
                readOnly: true,
              },
            },
            {
              name: 'totalExpenseInPEN',
              label: 'Total PEN',
              type: 'number',
              defaultValue: 0,
              required: true,
              admin: {
                width: '50%',
                readOnly: true,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'externalequipment',
      label: 'Equipamiento vehicular externo',
      type: 'group',
      fields: [
        {
          name: 'externalequipment',
          label: 'Equipamiento externo (estándar de fábrica)',
          type: 'relationship',
          relationTo: 'externalequipment',
          required: false,
          hasMany: true,
          admin: {
            allowCreate: true,
          },
        },
        {
          name: 'externaladitional',
          label: 'Equipamiento externo (adicional)',
          type: 'array',
          required: false,
          labels: {
            singular: 'Equipamiento externo',
            plural: 'Equipamientos externos',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'externaldate',
                  label: 'Fecha',
                  type: 'date',
                  required: true,
                  timezone: true,
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'externalequipment',
                  label: 'Accesorio',
                  type: 'relationship',
                  relationTo: 'externalequipment',
                  required: true,
                  hasMany: false,
                  admin: {
                    width: '67%',
                    allowCreate: true,
                  },
                },
                {
                  name: 'typecurrencyexternal',
                  label: 'Tipo de moneda',
                  type: 'relationship',
                  relationTo: 'typecurrency',
                  required: true,
                  hasMany: false,
                  admin: {
                    width: '33%',
                    allowCreate: false,
                  },
                },
                {
                  name: 'exchangerateexternal',
                  label: 'Tipo de cambio',
                  type: 'number',
                  defaultValue: 1,
                  required: false,
                },
                {
                  name: 'externalvalue',
                  label: 'Valor',
                  type: 'number',
                  defaultValue: 1,
                  required: true,
                  admin: {
                    width: '34%',
                  },
                },
              ],
            },
            {
              name: 'mediaexternalequipment',
              label: 'Archivo',
              type: 'upload',
              relationTo: 'mediaequipment',
              required: false,
            },
            {
              name: 'observationsexternal',
              label: 'Observaciones',
              type: 'textarea',
              required: false,
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'totalExpenseExUSD',
              label: 'Total USD',
              type: 'number',
              defaultValue: 0,
              required: true,
              admin: {
                width: '50%',
                readOnly: true,
              },
            },
            {
              name: 'totalExpenseExPEN',
              label: 'Total PEN',
              type: 'number',
              defaultValue: 0,
              required: true,
              admin: {
                width: '50%',
                readOnly: true,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'vehicleRegistration',
      label: 'Inscripción vehicular',
      type: 'group',
      fields: [
        {
          name: 'vehicleRegistrationProcedure',
          label: 'Tramite de inscripción vehicular',
          type: 'join',
          collection: 'vehicleregistrationprocedure',
          on: 'vehicle',
          hasMany: false,
          maxDepth: 2,
        },
        {
          name: 'vehicleTitleTransferProcedure',
          label: 'Transferencia de titularidad (Venta interna - Usado)',
          type: 'join',
          collection: 'vehicletitletransferprocedure',
          on: 'vehicle',
          hasMany: false,
          maxDepth: 2,
        },
      ],
    },
    {
      name: 'tive',
      label: 'TIVE (Tarjeta de identificación vehicular electrónica)',
      type: 'group',
      admin: {
        description:
          'Esta sección debe ser llenada unicamente cuando el vehículo tiene la condición de USADO',
      },
      fields: [
        {
          name: 'mediative',
          label: 'TIVE',
          type: 'upload',
          relationTo: 'mediative',
          required: false,
        },
      ],
    },
    {
      name: 'licensePlates',
      label: 'Placas de rodaje vehicular',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
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
        // {
        //   name: 'licensePlateIssuanceProcedure',
        //   label: 'Tramite para obtención de placas físicas',
        //   type: 'relationship',
        //   relationTo: 'licenseplateissuanceprocedure',
        //   required: false,
        //   hasMany: false,
        //   admin: {
        //     allowCreate: false,
        //     allowEdit: false,
        //   },
        // },
      ],
    },
    {
      name: 'procedureothers',
      label: 'Otros trámites de SUNARP Y AAP',
      type: 'group',
      fields: [
        {
          name: 'proceduresunarp',
          label: 'Tramites de sunarp',
          type: 'join',
          collection: 'proceduresunarp',
          on: 'vehicle',
          required: false,
          hasMany: true,
          maxDepth: 2,
        },
        {
          name: 'procedureaap',
          label: 'Tramite de AAP',
          type: 'join',
          collection: 'procedureaap',
          on: 'vehicle',
          required: false,
          hasMany: true,
          maxDepth: 2,
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
      name: 'assignmentgps',
      label: 'GPS asociados',
      type: 'join',
      collection: 'assignmentgps',
      on: 'vehicle',
      maxDepth: 2,
    },
    {
      name: 'expenseaditional',
      label: 'Gastos adicionales',
      type: 'join',
      collection: 'expenseaditionalvehicle',
      on: 'vehicle',
      maxDepth: 2,
    },
  ],

  hooks: {
    beforeChange: [
      async ({ req: { user, payload }, data, operation }) => {
        // 1. Manejo de createdBy y updatedBy
        if (user) {
          if (operation === 'create' && !data.createdBy) {
            data.createdBy = user.id
          }
          data.updatedBy = user.id
        }

        // 2. Cálculo de totalExpenseInUSD y totalExpenseInPEN (Equipamiento interno)
        let totalInUSD = 0
        let totalInPEN = 0
        if (
          (operation === 'create' || operation === 'update') &&
          data.internalequipment?.internaladitional &&
          Array.isArray(data.internalequipment.internaladitional)
        ) {
          for (const item of data.internalequipment.internaladitional) {
            if (item.typecurrencyinternal && item.internalvalue !== undefined) {
              try {
                const typeCurrency = await payload.findByID({
                  collection: 'typecurrency',
                  id: item.typecurrencyinternal,
                })

                const codeCurrency = typeCurrency?.codecurrency
                const internalValue = Number(item.internalvalue) || 0
                const exchangeRate = Number(item.exchangerateinternal) || 1

                if (codeCurrency === 'USD') {
                  totalInUSD += internalValue
                  totalInPEN += internalValue * exchangeRate
                } else if (codeCurrency === 'PEN') {
                  totalInPEN += internalValue
                  totalInUSD += internalValue / exchangeRate
                } else {
                  console.warn(`Moneda no soportada en internalequipment: ${codeCurrency}`)
                }
              } catch (error) {
                console.error('Error al obtener typecurrency para internalequipment:', error)
              }
            }
          }

          data.internalequipment = data.internalequipment || {}
          data.internalequipment.totalExpenseInUSD = Number(totalInUSD.toFixed(2))
          data.internalequipment.totalExpenseInPEN = Number(totalInPEN.toFixed(2))
        } else {
          data.internalequipment = data.internalequipment || {}
          data.internalequipment.totalExpenseInUSD = data.internalequipment.totalExpenseInUSD || 0
          data.internalequipment.totalExpenseInPEN = data.internalequipment.totalExpenseInPEN || 0
        }

        // 3. Cálculo de totalExpenseExUSD y totalExpenseExPEN (Equipamiento externo)
        let totalExUSD = 0
        let totalExPEN = 0
        if (
          (operation === 'create' || operation === 'update') &&
          data.externalequipment?.externaladitional &&
          Array.isArray(data.externalequipment.externaladitional)
        ) {
          for (const item of data.externalequipment.externaladitional) {
            if (item.typecurrencyexternal && item.externalvalue !== undefined) {
              try {
                const typeCurrency = await payload.findByID({
                  collection: 'typecurrency',
                  id: item.typecurrencyexternal,
                })

                const codeCurrency = typeCurrency?.codecurrency
                const externalValue = Number(item.externalvalue) || 0
                const exchangeRate = Number(item.exchangerateexternal) || 1

                if (codeCurrency === 'USD') {
                  totalExUSD += externalValue
                  totalExPEN += externalValue * exchangeRate
                } else if (codeCurrency === 'PEN') {
                  totalExPEN += externalValue
                  totalExUSD += externalValue / exchangeRate
                } else {
                  console.warn(`Moneda no soportada en externalequipment: ${codeCurrency}`)
                }
              } catch (error) {
                console.error('Error al obtener typecurrency para externalequipment:', error)
              }
            }
          }

          data.externalequipment = data.externalequipment || {}
          data.externalequipment.totalExpenseExUSD = Number(totalExUSD.toFixed(2))
          data.externalequipment.totalExpenseExPEN = Number(totalExPEN.toFixed(2))
        } else {
          data.externalequipment = data.externalequipment || {}
          data.externalequipment.totalExpenseExUSD = data.externalequipment.totalExpenseExUSD || 0
          data.externalequipment.totalExpenseExPEN = data.externalequipment.totalExpenseExPEN || 0
        }

        return data
      },
    ],
  },

  endpoints: [
    // Endpoint para eliminar un archivo de vehículo
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
            collection: 'vehicle',
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
          const fileToDelete = currentDoc.galleryfiles?.find((file) => file.id === fileArrayId)

          if (!fileToDelete?.mediagallery) {
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
            typeof fileToDelete.mediagallery === 'string'
              ? fileToDelete.mediagallery
              : fileToDelete.mediagallery.id

          await req.payload.delete({
            collection: 'mediagallery',
            id: mediaId,
            req,
          })

          // 5. Actualización eficiente del documento
          const updatedDoc = await req.payload.update({
            collection: 'vehicle',
            id,
            data: {
              galleryfiles: currentDoc.galleryfiles?.filter((file) => file.id !== fileArrayId),
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

    // Endpoint para obtener los totales combinados de equipamiento interno y externo
    {
      path: '/total-equipment/:vehicleId',
      method: 'get',
      handler: async (req) => {
        const { payload, routeParams } = req
        // const id = req.routeParams?.id as string
        const vehicleId = routeParams?.vehicleId as string

        try {
          // Validar que se proporcionó un vehicleId
          if (!vehicleId) {
            return Response.json({ error: 'El ID del vehículo es requerido' }, { status: 400 })
          }

          // Consultar el documento de Vehicle por ID
          const vehicle = await payload.findByID({
            collection: 'vehicle',
            id: vehicleId,
            depth: 1, // Profundidad suficiente para obtener los campos de internalequipment y externalequipment
          })

          // Verificar si el vehículo existe
          if (!vehicle) {
            return Response.json({ error: 'El ID del vehículo es requerido' }, { status: 400 })
          }

          // Extraer los totales (usar 0 si los campos no están definidos)
          const totalInUSD = Number(vehicle.internalequipment?.totalExpenseInUSD || 0)
          const totalInPEN = Number(vehicle.internalequipment?.totalExpenseInPEN || 0)
          const totalExUSD = Number(vehicle.externalequipment?.totalExpenseExUSD || 0)
          const totalExPEN = Number(vehicle.externalequipment?.totalExpenseExPEN || 0)

          // Calcular los totales combinados
          const totalEquipmentUSD = Number((totalInUSD + totalExUSD).toFixed(2))
          const totalEquipmentPEN = Number((totalInPEN + totalExPEN).toFixed(2))

          // Devolver la respuesta
          return Response.json(
            {
              equipmentAdditional: {
                totalUSD: totalEquipmentUSD,
                totalPEN: totalEquipmentPEN,
              },
            },
            {
              status: 200,
              headers: headersWithCors({
                headers: new Headers(),
                req,
              }),
            },
          )
        } catch (error) {
          console.error('Error en el endpoint /total-equipment:', error)
          return Response.json(
            { error: 'Error al calcular los totales' },
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

    // Endpoint para eliminar un registro de equipamiento vehicular interno
    {
      path: '/:id/remove-equipment/:equipmentId',
      method: 'delete',
      handler: async (req) => {
        try {
          // 1. Obtener parámetros de la ruta
          const id = req.routeParams?.id as string
          const equipmentId = req.routeParams?.equipmentId as string

          if (!id || !equipmentId) {
            return Response.json(
              { error: 'Se requieren los parámetros id y equipmentId' },
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
            collection: 'vehicle',
            id,
            depth: 1,
            req,
          })

          if (!currentDoc) {
            return Response.json(
              { error: 'Vehiculo no encontrado' },
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
          const equipmentToDelete = currentDoc.internalequipment.internaladitional?.find(
            (equipment) => equipment.id === equipmentId,
          )

          if (!equipmentToDelete) {
            return Response.json(
              { error: 'Equipamento no encontrado en este vehiculo' },
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
          if (equipmentToDelete.mediainternalequipment) {
            const mediaId =
              typeof equipmentToDelete.mediainternalequipment === 'string'
                ? equipmentToDelete.mediainternalequipment
                : equipmentToDelete.mediainternalequipment.id

            await req.payload.delete({
              collection: 'mediaequipment',
              id: mediaId,
              req,
            })
          }

          // 5. Actualizar el documento eliminando el gasto
          const updatedDoc = await req.payload.update({
            collection: 'vehicle',
            id,
            data: {
              internalequipment: {
                internaladitional: currentDoc.internalequipment.internaladitional?.filter(
                  (equipment) => equipment.id !== equipmentId,
                ),
              },
            },
            req,
          })

          // 6. Respuesta exitosa
          return Response.json(
            {
              success: true,
              message: 'Equipamiento eliminado exitosamente',
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
            { error: 'Error eliminando equipamiento', details: error },
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

    // Endpoint para eliminar un registro de equipamiento vehicular externo
    {
      path: '/:id/remove-equipment/:equipmentId',
      method: 'delete',
      handler: async (req) => {
        try {
          // 1. Obtener parámetros de la ruta
          const id = req.routeParams?.id as string
          const equipmentId = req.routeParams?.equipmentId as string

          if (!id || !equipmentId) {
            return Response.json(
              { error: 'Se requieren los parámetros id y equipmentId' },
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
            collection: 'vehicle',
            id,
            depth: 1,
            req,
          })

          if (!currentDoc) {
            return Response.json(
              { error: 'Vehiculo no encontrado' },
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
          const equipmentToDelete = currentDoc.externalequipment.externaladitional?.find(
            (equipment) => equipment.id === equipmentId,
          )

          if (!equipmentToDelete) {
            return Response.json(
              { error: 'Equipamento no encontrado en este vehiculo' },
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
          if (equipmentToDelete.mediaexternalequipment) {
            const mediaId =
              typeof equipmentToDelete.mediaexternalequipment === 'string'
                ? equipmentToDelete.mediaexternalequipment
                : equipmentToDelete.mediaexternalequipment.id

            await req.payload.delete({
              collection: 'mediaequipment',
              id: mediaId,
              req,
            })
          }

          // 5. Actualizar el documento eliminando el gasto
          const updatedDoc = await req.payload.update({
            collection: 'vehicle',
            id,
            data: {
              externalequipment: {
                externaladitional: currentDoc.externalequipment.externaladitional?.filter(
                  (equipment) => equipment.id !== equipmentId,
                ),
              },
            },
            req,
          })

          // 6. Respuesta exitosa
          return Response.json(
            {
              success: true,
              message: 'Equipamiento eliminado exitosamente',
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
            { error: 'Error eliminando equipamiento', details: error },
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
