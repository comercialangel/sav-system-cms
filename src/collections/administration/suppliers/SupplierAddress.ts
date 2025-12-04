import type { CollectionConfig } from 'payload'

export const SupplierAddress: CollectionConfig = {
  slug: 'supplieraddress',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'address',
    group: 'Proveedores vehiculares',
  },
  labels: {
    singular: 'Sede de proveedor',
    plural: 'Sedes de proveedores',
  },
  fields: [
    {
      name: 'supplier',
      label: 'Proveedor',
      type: 'relationship',
      relationTo: 'supplier',
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
          name: 'sede',
          label: 'Nombre de sede',
          type: 'text',
          required: true,
          admin: {
            width: '30%',
          },
        },
        {
          name: 'address',
          label: 'Dirección de sede',
          type: 'text',
          required: true,
          admin: {
            width: '70%',
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
    afterChange: [
      async ({ doc, req, operation }) => {
        const { payload } = req

        // Solo manejar la operación de creación
        if (operation === 'create') {
          // Obtener el ID del proveedor asociado a la dirección
          const supplierId = typeof doc.supplier === 'object' ? doc.supplier.id : doc.supplier

          if (supplierId) {
            // Obtener el proveedor actual
            const supplier = await payload.findByID({
              collection: 'supplier',
              id: supplierId,
            })

            if (supplier) {
              // Obtener el array actual de direcciones (o inicializarlo si está vacío)
              const currentAddresses = supplier.addresses ?? []

              // Agregar el ID de la nueva dirección al array
              const updatedAddresses = [...currentAddresses, doc.id]

              // Actualizar el campo `addresses` en la colección `supplier`
              await payload.update({
                collection: 'supplier',
                id: supplierId,
                data: {
                  addresses: updatedAddresses,
                },
              })

              console.log(`Dirección agregada al proveedor ${supplierId}.`)
            }
          }
        }
      },
    ],

    afterDelete: [
      async ({ doc, req }) => {
        const { payload } = req

        // Obtener el ID del proveedor asociado a la dirección
        const supplierId =
          typeof doc.supplier === 'object'
            ? doc.supplier.id // Si es un objeto, extraer el ID
            : doc.supplier // Si ya es un ID, usarlo directamente

        if (supplierId) {
          // Obtener el proveedor actual
          const supplier = await payload.findByID({
            collection: 'supplier',
            id: supplierId,
          })

          if (supplier) {
            // Obtener el array actual de direcciones (o inicializarlo si está vacío)
            const currentAddresses = supplier.addresses ?? []

            // Filtrar el array de direcciones para eliminar el ID de la dirección eliminada
            const updatedAddresses = currentAddresses.filter((addressId) => addressId !== doc.id)

            // Actualizar el campo `addresses` en la colección `supplier`
            await payload.update({
              collection: 'supplier',
              id: supplierId,
              data: {
                addresses: updatedAddresses,
              },
            })

            console.log(`Dirección eliminada del proveedor ${supplierId}.`)
          }
        }
      },
    ],
  },
}
