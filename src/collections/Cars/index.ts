import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const Cars: CollectionConfig = {
  slug: 'cars',
  admin: {
    useAsTitle: 'title',
  },
  hooks: {
    afterRead: [
      ({ doc }) => {
        doc.doILikeIt = doc.title.includes('Asus')
        return doc
      },
    ],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'manufacturer',
      type: 'relationship',
      relationTo: 'manufacturers',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
