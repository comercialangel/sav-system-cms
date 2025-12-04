import type { CollectionConfig } from 'payload'
import { headersWithCors } from 'payload'

export const Buyer: CollectionConfig = {
  slug: 'buyer',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'fullname',
    group: 'Compradores (Clientes externos)',
  },
  labels: {
    singular: 'Comprador',
    plural: 'Compradores',
  },
  fields: [
    {
      name: 'mediabuyer',
      label: 'Foto',
      type: 'upload',
      relationTo: 'mediabuyer',
      required: false,
    },
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
      label: 'Nombre completo / Razón social',
      type: 'text',
      required: false,
    },
    {
      type: 'row',
      fields: [
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
      ],
    },
    {
      name: 'address',
      label: 'Dirección',
      type: 'text',
      required: true,
      admin: {
        width: '50%',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'numbermovil',
          label: 'Número móvil',
          type: 'text',
          required: true,
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
      name: 'activity',
      label: 'Activida/Ocupación',
      type: 'relationship',
      relationTo: 'activity',
      required: true,
      hasMany: false,
      admin: {
        allowCreate: true,
      },
    },
    {
      name: 'natural',
      label: 'Natural',
      type: 'group',
      admin: {
        description:
          'Completar información en esta sección si el comprador es PERSONA NATURAL, es decir, si el tipo de documento del comprador que se está registrando es un DNI',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'civilstatus',
              label: 'Estado civil',
              type: 'relationship',
              relationTo: 'civilstatus',
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
          name: 'spouse',
          label: 'Conyuge',
          type: 'group',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'dnispouse',
                  label: 'DNI',
                  type: 'number',
                  required: false,
                  admin: {
                    width: '30%',
                  },
                },
                {
                  name: 'fullnamespouse',
                  label: 'Nombre completo',
                  type: 'text',
                  required: false,
                  admin: {
                    width: '70%',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'juridical',
      label: 'Jurídico',
      type: 'group',
      admin: {
        description:
          'Completar información en esta sección si el comprador es PERSONA JURÍDICA, es decir, si el tipo de documento del comprador que se está registrando es un RUC',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'statuscontributor',
              label: 'Estado de contribuidor',
              type: 'select',
              required: false,
              admin: {
                width: '50%',
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
            },
            {
              name: 'conditioncontributor',
              label: 'Condición de contribuidor',
              type: 'select',
              required: false,
              admin: {
                width: '50%',
              },
              options: [
                {
                  label: 'Habido',
                  value: 'habido',
                },
                {
                  label: 'No habido',
                  value: 'no habido',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'contacts',
      label: 'Contactos',
      type: 'array',
      labels: {
        singular: 'Contacto',
        plural: 'Contactos',
      },
      fields: [
        {
          name: 'fullnamecontact',
          label: 'Nombre completo',
          type: 'text',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'numbermovil',
              label: 'Número móvil',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'relation',
              label: 'Relación',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
              },
            },
          ],
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
    {
      name: 'rating',
      label: 'Valoración',
      type: 'select',
      required: true,
      admin: {
        position: 'sidebar',
      },
      options: ['Excelente', 'Bueno', 'Regular', 'Malo', 'Muy malo', 'Ninguno'],
      defaultValue: 'Ninguno',
    },
  ],
  endpoints: [
    // Endpoint para eliminar un constacto específico de un cliente -
    {
      path: '/:id/remove-contact/:contactId',
      method: 'delete',
      handler: async (req) => {
        try {
          // 1. Obtener parámetros de la ruta
          const id = req.routeParams?.id as string
          const contactId = req.routeParams?.contactId as string

          if (!id || !contactId) {
            return Response.json(
              { error: 'Se requieren los parámetros id y contactId' },
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
            collection: 'buyer',
            id,
            depth: 1,
            req,
          })

          if (!currentDoc) {
            return Response.json(
              { error: 'Contacto no encontrado' },
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
          const contactToDelete = currentDoc.contacts?.find((contact) => contact.id === contactId)

          if (!contactToDelete) {
            return Response.json(
              { error: 'Contacto no encontrado en este cliente' },
              {
                status: 404,
                headers: headersWithCors({
                  headers: new Headers(),
                  req,
                }),
              },
            )
          }

          // 5. Actualizar el documento eliminando el gasto
          const updatedDoc = await req.payload.update({
            collection: 'buyer',
            id,
            data: {
              contacts: currentDoc.contacts?.filter((contact) => contact.id !== contactId),
            },
            req,
          })

          // 6. Respuesta exitosa
          return Response.json(
            {
              success: true,
              message: 'Contact eliminado exitosamente',
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
            { error: 'Error eliminando contacto', details: error },
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
