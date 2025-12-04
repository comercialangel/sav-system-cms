import type { CollectionConfig } from 'payload'
import { headersWithCors } from 'payload'

export const PriceLists: CollectionConfig = {
  slug: 'pricelists',
  labels: {
    singular: 'Lista de Precios',
    plural: 'Listas de Precios',
  },
  admin: {
    group: 'Ventas vehiculares',
    useAsTitle: 'displayName',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'displayName',
      label: 'Nombre de la Lista',
      type: 'text',
      admin: { hidden: true },
      hooks: {
        beforeValidate: [
          async ({ data, req }) => {
            const currency = await req.payload.findByID({
              collection: 'typecurrency',
              id: typeof data?.currency === 'object' ? data.currency.id : data?.currency,
            })
            return `${data?.pricelistName} - (${currency.codecurrency})`
          },
        ],
      },
    },
    {
      name: 'vehicle',
      label: 'Vehículo',
      type: 'relationship',
      relationTo: 'vehicle',
      required: true,
      index: true,
      admin: {
        description: 'Vehículo al que se aplica el precio.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'validityDate',
          label: 'Fecha de Validez',
          type: 'date',
          required: false,
          admin: {
            width: '50%',
            description: 'Fecha hasta la cual el precio es válido (opcional).',
          },
        },
        {
          name: 'pricelistName',
          label: 'Nombre de la Lista',
          type: 'text',
          required: true,
          defaultValue: 'Precio público',
          admin: {
            width: '50%',
            description: 'Ej. "Retail", "Mayorista", "Promoción".',
          },
        },
        {
          name: 'currency',
          label: 'Moneda',
          type: 'relationship',
          relationTo: 'typecurrency',
          required: true,
          admin: {
            width: '33%',
            readOnly: true,
            description: 'Moneda del precio',
          },
        },
        {
          name: 'price',
          label: 'Precio',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            width: '33%',
            // readOnly: true,
            description: 'Precio del vehículo en la moneda seleccionada, redondeado a 2 decimales.',
          },
          hooks: {
            beforeChange: [({ data }) => parseFloat((data?.price || 0).toFixed(2))],
          },
        },
        {
          name: 'exchangeRate',
          label: 'Tasa de Cambio a USD',
          type: 'number',
          required: true,
          min: 0,
          defaultValue: 0,
          admin: {
            width: '34%',
            description:
              'Tasa de cambio a USD (ej. 0.27 para PEN, 1 para USD). Ingresar manualmente o vía API externa.',
          },
        },
      ],
    },
    {
      name: 'notes',
      label: 'Notas',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Notas sobre esta lista de precios.',
      },
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { label: 'Activo', value: 'active' },
        { label: 'Inactivo', value: 'inactive' },
      ],
      defaultValue: 'active',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'createdBy',
      label: 'Creado por',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'updatedBy',
      label: 'Actualizado por',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req: { user }, data, originalDoc }) => {
        if (user) {
          if (!originalDoc?.createdBy) data.createdBy = user.id
          data.updatedBy = user.id
        }
        return data
      },
    ],
  },

  endpoints: [
    {
      path: '/vehicle/:vehicleId',
      method: 'get',
      handler: async (req) => {
        const { payload, routeParams } = req
        const vehicleId = routeParams?.vehicleId as string
        const currentDate = new Date() // Fecha actual: 2025-10-11T19:18:00-05:00

        try {
          // Validar que se proporcionó un vehicleId
          if (!vehicleId) {
            return Response.json({ error: 'El ID del vehículo es requerido' }, { status: 400 })
          }

          // Consultar el vehículo para verificar si existe
          const vehicle = await payload.findByID({
            collection: 'vehicle',
            id: vehicleId,
            depth: 0,
          })

          if (!vehicle) {
            return Response.json({ error: 'Vehículo no encontrado' }, { status: 404 })
          }

          // Consultar los precios en pricelists para el vehículo
          const priceLists = await payload.find({
            collection: 'pricelists',
            where: {
              and: [
                { vehicle: { equals: vehicleId } },
                { status: { equals: 'active' } },
                {
                  or: [
                    { validityDate: { greater_than_equal: currentDate.toISOString() } },
                    { validityDate: { exists: false } },
                  ],
                },
              ],
            },
            depth: 1, // Poblar lista de precios
          })

          // Mapear los resultados para devolver solo los campos necesarios
          const formattedPrices = priceLists.docs.map((price) => ({
            id: price.id,
            pricelistName: price.displayName, // Cambiado de typePrice a pricelistName
            currency: {
              id:
                typeof price.currency === 'object' && price.currency?.id
                  ? price.currency.id
                  : price.currency || '',
              codecurrency:
                typeof price.currency === 'object'
                  ? price.currency.codecurrency
                  : price.currency || 'USD',
              symbol: typeof price.currency === 'object' ? price.currency.symbol : '',
              typecurrency: typeof price.currency === 'object' ? price.currency.typecurrency : '',
            },
            price: Number(price.price) || 0,
            validityDate: price.validityDate || null,
            exchangeRate: Number(price.exchangeRate) || 0,
            notes: price.notes || null,
          }))

          // Devolver la respuesta
          return Response.json(
            {
              prices: formattedPrices,
              total: priceLists.totalDocs,
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
          console.error('Error en el endpoint /pricelists/vehicle:', error)
          return Response.json(
            { error: 'Error al obtener los precios del vehículo' },
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
