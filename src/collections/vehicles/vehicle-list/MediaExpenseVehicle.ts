import type { CollectionConfig } from 'payload'

export const MediaExpenseVehicle: CollectionConfig = {
  slug: 'mediaexpensevehicle',
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Unidades vehiculares',
  },
  labels: {
    singular: 'Media (Voucher de gasto vehicular adicional)',
    plural: 'Media (Voucheres de gastos vehiculares adicionales)',
  },
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediaexpensevehicle/${doc.filename}`,
  },
  fields: [],
}
