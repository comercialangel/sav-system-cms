import type { CollectionConfig } from 'payload'

export const DeviceGPS: CollectionConfig = {
  slug: 'devicegps',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'sku',
    group: "Adquisiciones de GPS y SIM's",
  },
  labels: {
    singular: 'Dispositivo GPS',
    plural: 'Dispositivos GPS',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'dateacquisition',
          label: 'Fecha de adquisición',
          type: 'date',
          required: true,
          timezone: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'suppliergps',
          label: 'Proveedor',
          type: 'relationship',
          relationTo: 'suppliergps',
          required: false,
          hasMany: false,
          admin: {
            width: '50%',
            allowCreate: true,
          },
        },
        {
          name: 'typegps', //Sinotrack, Hunter, Amy By Hunter, etc
          label: 'Tipo de GPS',
          type: 'relationship',
          relationTo: 'typegps',
          required: true,
          hasMany: false,
          admin: {
            width: '100%',
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
            width: '33%',
            allowCreate: false,
          },
        },
        {
          name: 'exchangerate',
          label: 'Tipo de cambio',
          type: 'number',
          required: false,
          defaultValue: 1,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'pricepurchase',
          label: 'Precio de compra',
          type: 'number',
          defaultValue: 0,
          required: true,
          admin: {
            width: '34%',
          },
        },
        {
          name: 'typesino',
          label: 'Tipo de sino',
          type: 'relationship',
          relationTo: 'typesino',
          required: false,
          hasMany: false,
          admin: {
            width: '33%',
            allowCreate: true,
          },
        },
        {
          name: 'devicecode',
          label: 'ID (Código)',
          type: 'text',
          required: false,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'imei',
          label: 'IMEI',
          type: 'text',
          required: false,
          admin: {
            width: '34%',
          },
          hooks: {
            beforeValidate: [
              ({ data }) => {
                const typedata = data as { typegps?: { typegps: string } | string; imei?: string }
                const typegpsValue =
                  typeof typedata.typegps === 'string'
                    ? typedata.typegps
                    : typedata.typegps?.typegps

                if (typegpsValue === 'Sinotrack') {
                  if (!typedata.imei) {
                    throw new Error('El campo IMEI es obligatorio para dispositivos Sinotrack')
                  }
                  // Validar formato del IMEI (15 dígitos)
                  if (!/^\d{15}$/.test(typedata.imei)) {
                    throw new Error('El IMEI debe contener exactamente 15 dígitos')
                  }
                }
                if (typegpsValue !== 'Sinotrack' && typedata.imei) {
                  return null
                }
                return typedata.imei
              },
            ],
          },
        },
      ],
    },
    {
      name: 'totalExpenseUSD',
      label: 'Total USD',
      type: 'number',
      defaultValue: 0,
      required: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'totalExpensePEN',
      label: 'Total PEN',
      type: 'number',
      defaultValue: 0,
      required: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'observations',
      label: 'Observaciones',
      type: 'textarea',
      required: false,
    },
    {
      name: 'sku',
      label: 'SKU',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          async ({ data, req, operation }) => {
            interface AccountData {
              typegps: string
              devicecode?: string
            }
            const typedata = data as AccountData

            if (typedata.typegps) {
              // Obtener el nombre del tipo de GPS
              const typegps = await req.payload.findByID({
                collection: 'typegps',
                id: typedata.typegps,
              })

              let prefix = ''
              let sku = ''
              if (typegps && typegps.typegps) {
                switch (typegps.typegps.toLowerCase()) {
                  case 'hunter':
                    prefix = 'HUN'
                    // Contar dispositivos existentes con prefijo HUN
                    const hunterDevices = await req.payload.find({
                      collection: 'devicegps',
                      where: {
                        typegps: { equals: typedata.typegps }, // Filtrar por typegps específico
                      },
                    })
                    const hunterCount = hunterDevices.totalDocs + (operation === 'create' ? 1 : 0)
                    sku = `${prefix}-${String(hunterCount).padStart(5, '0')}`.toUpperCase()
                    break
                  case 'sinotrack':
                    prefix = 'SINO'
                    if (!typedata.devicecode) {
                      throw new Error(
                        'El campo ID (Código) es obligatorio para generar el SKU de Sinotrack',
                      )
                    }
                    sku = `${prefix}-${typedata.devicecode}`.toUpperCase()
                    break
                  case 'amy by hunter':
                    prefix = 'AMY'
                    // Contar dispositivos existentes con prefijo AMY
                    const amyDevices = await req.payload.find({
                      collection: 'devicegps',
                      where: {
                        typegps: { equals: typedata.typegps }, // Filtrar por typegps específico
                      },
                    })
                    const amyCount = amyDevices.totalDocs + (operation === 'create' ? 1 : 0)
                    sku = `${prefix}-${String(amyCount).padStart(5, '0')}`.toUpperCase()
                    break
                  default:
                    prefix = 'GPS'
                    const defaultDevices = await req.payload.find({
                      collection: 'devicegps',
                      where: {
                        typegps: { equals: typedata.typegps }, // Filtrar por typegps específico
                      },
                    })
                    const defaultCount = defaultDevices.totalDocs + (operation === 'create' ? 1 : 0)
                    sku = `${prefix}-${String(defaultCount).padStart(5, '0')}`.toUpperCase()
                }
              }
              return sku
            }
            throw new Error('Tipo de GPS es requerido para generar el SKU')
          },
        ],
      },
    },
    {
      name: 'cancellation',
      label: 'Cancelación de dipositivo',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'cancellationdate',
              label: 'Fecha de cancelación',
              type: 'date',
              required: false,
              admin: {
                width: '33%',
              },
            },
            {
              name: 'motivecancellationgps',
              label: 'Motivo de cancelación',
              type: 'relationship',
              relationTo: 'motivecancellationdevice',
              required: false,
              hasMany: false,
              admin: {
                width: '67%',
                allowCreate: true,
              },
            },
          ],
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
      options: [
        {
          label: 'Disponible',
          value: 'disponible',
        },
        {
          label: 'Asignado',
          value: 'asignado',
        },
        {
          label: 'En uso',
          value: 'en uso',
        },
        {
          label: 'Uso finalizado',
          value: 'uso finalizado',
        },
      ],
      defaultValue: 'disponible',
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
      async ({ req: { user, payload }, data, operation }) => {
        // 1. Manejo de createdBy y updatedBy
        if (user) {
          if (operation === 'create' && !data.createdBy) {
            data.createdBy = user.id
          }
          data.updatedBy = user.id
        }

        // 2. Validar typecurrency en creación
        if (operation === 'create' && !data.typecurrency) {
          throw new Error('El campo typecurrency es requerido para crear un dispositivo GPS')
        }

        // 3. Cálculo de totalExpenseUSD y totalExpensePEN
        if (
          (operation === 'create' || operation === 'update') &&
          data.typecurrency &&
          data.pricepurchase !== undefined
        ) {
          try {
            const typeCurrency = await payload.findByID({
              collection: 'typecurrency',
              id: data.typecurrency,
            })

            const codeCurrency = typeCurrency?.codecurrency
            const pricePurchase = Number(data.pricepurchase) || 0
            const exchangeRate = Number(data.exchangerate) || 1

            let totalUSD = 0
            let totalPEN = 0

            if (codeCurrency === 'USD') {
              totalUSD = pricePurchase
              totalPEN = pricePurchase * exchangeRate
            } else if (codeCurrency === 'PEN') {
              totalPEN = pricePurchase
              totalUSD = pricePurchase / exchangeRate
            } else {
              console.warn(`Moneda no soportada en DeviceGPS: ${codeCurrency}`)
            }

            data.totalExpenseUSD = Number(totalUSD.toFixed(2))
            data.totalExpensePEN = Number(totalPEN.toFixed(2))
          } catch (error) {
            console.error('Error al obtener typecurrency en DeviceGPS:', error)
            data.totalExpenseUSD = data.totalExpenseUSD || 0
            data.totalExpensePEN = data.totalExpensePEN || 0
          }
        } else {
          data.totalExpenseUSD = data.totalExpenseUSD || 0
          data.totalExpensePEN = data.totalExpensePEN || 0
        }

        return data
      },
    ],
  },
}
