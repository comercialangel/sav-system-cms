import type { CollectionConfig } from 'payload'

export const MediaTransferVoucher: CollectionConfig = {
  slug: 'mediatransfervoucher',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Transferencias de unidades vehiculares',
  },
  labels: {
    singular: 'Media (voucher para transferencia)',
    plural: 'Media (vouchers para transferencias)',
  },
  upload: {
    mimeTypes: ['*'],
    adminThumbnail: ({ doc }) =>
      `https://storage.cloud.google.com/mediasav/mediatransfervoucher/${doc.filename}`,
  },
  fields: [],
}
