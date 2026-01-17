import { APIError, type CollectionConfig } from 'payload'

export const SupplierGPS: CollectionConfig = {
  slug: 'suppliergps',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'namesupplier',
    group: "Adquisiciones de GPS y SIM's",
  },
  labels: {
    singular: 'Proveedor de GPS',
    plural: 'Proveedores de GPS',
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
        {
          name: 'namesupplier',
          label: 'Nombre completo o Razón social',
          type: 'text',
          required: true,
          admin: {
            width: '100%',
          },
        },
        {
          name: 'departamento',
          label: 'Departamento',
          type: 'relationship',
          relationTo: 'departamento',
          required: true,
          hasMany: false,
          admin: {
            width: '33%',
            allowCreate: false,
          },
        },
        {
          name: 'provincia',
          label: 'Provincia',
          type: 'relationship',
          relationTo: 'provincia',
          required: true,
          hasMany: false,
          admin: {
            width: '33%',
            allowCreate: false,
          },
        },
        {
          name: 'distrito',
          label: 'Distrito',
          type: 'relationship',
          relationTo: 'distrito',
          required: true,
          hasMany: false,
          admin: {
            width: '34%',
            allowCreate: false,
          },
        },
        {
          name: 'address',
          label: 'Dirección',
          type: 'text',
          required: true,
          admin: {
            width: '100%',
          },
        },
        {
          name: 'numbermovil',
          label: 'Número móvil',
          type: 'text',
          required: false,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'email',
          label: 'Correo electrónico',
          type: 'email',
          required: false,
          admin: {
            width: '50%',
          },
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

  hooks: {
    beforeDelete: [
      async ({ id, req }) => {
        // Aquí puedes agregar la lógica que necesites ejecutar después de eliminar un proveedor de GPS.
        // 1. Buscamos si hay dispositivos que apunten a este proveedor
        const relatedDevices = await req.payload.find({
          collection: 'devicegps', // Nombre de tu colección de dispositivos
          where: {
            suppliergps: {
              equals: id,
            },
          },
          limit: 1, // Solo necesitamos saber si existe al menos uno
          depth: 0, // Eficiencia: no traigas relaciones
        })

        // 2. Si encontramos alguno, lanzamos error y cancelamos el borrado
        if (relatedDevices.totalDocs > 0) {
          throw new APIError(
            'No se puede eliminar este proveedor porque tiene dispositivos GPS asociados. Desvincule los dispositivos primero.',
            400, // Bad Request
          )
        }
      },
    ],
  },
}
