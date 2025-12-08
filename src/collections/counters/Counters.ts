// src/collections/Counters.ts
import type { CollectionConfig } from 'payload'

export const Counters: CollectionConfig = {
  slug: 'counters',
  access: {
    read: () => true, // nadie necesita verla
    create: () => true,
    update: () => false,
    delete: () => false,
  },
  admin: {
    hidden: true, // nunca aparece en el admin
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      unique: true, // importante
      required: true,
      index: true, // para que las búsquedas sean rápidas
    },
    {
      name: 'value',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
    },
  ],
}
