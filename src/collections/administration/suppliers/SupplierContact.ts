import type { CollectionConfig } from 'payload'

export const SupplierContact: CollectionConfig = {
  slug: 'suppliercontact',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'namesuppliercontact',
    group: 'Proveedores vehiculares',
  },
  labels: {
    singular: 'Contacto de proveedor',
    plural: 'Contactos de proveedores',
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
          name: 'namesuppliercontact',
          label: 'Nombre completo',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'jobposition',
          label: 'Puesto de trabajo',
          type: 'text',
          required: true,
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
              const currentSupplierContact = supplier.suppliercontact ?? []

              // Agregar el ID de la nueva dirección al array
              const updatedSupplierContact = [...currentSupplierContact, doc.id]

              // Actualizar el campo `addresses` en la colección `supplier`
              await payload.update({
                collection: 'supplier',
                id: supplierId,
                data: {
                  suppliercontact: updatedSupplierContact,
                },
              })

              console.log(`Contacto agregado al proveedor ${supplierId}.`)
            }
          }
        }
      },
    ],

    afterDelete: [
      async ({ doc, req }) => {
        const { payload } = req

        // Obtener el ID del proveedor asociado a la dirección m
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
            const currentsuppliercontact = supplier.suppliercontact ?? []

            // Filtrar el array de direcciones para eliminar el ID de la dirección eliminada
            const updatedsuppliercontact = currentsuppliercontact.filter(
              (contactId) => contactId !== doc.id,
            )

            // Actualizar el campo `addresses` en la colección `supplier`
            await payload.update({
              collection: 'supplier',
              id: supplierId,
              data: {
                suppliercontact: updatedsuppliercontact,
              },
            })

            console.log(`Contacto eliminado del proveedor ${supplierId}.`)
          }
        }
      },
    ],
  },
}
