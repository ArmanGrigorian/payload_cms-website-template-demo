// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { en } from '@payloadcms/translations/languages/en'
import { ru } from '@payloadcms/translations/languages/ru'

import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import sharp from 'sharp' // sharp-import
import { fileURLToPath } from 'url'

import { defaultLexical } from '@/fields/defaultLexical'
import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Cars } from './collections/Cars'
import { Categories } from './collections/Categories'
import { Manufacturers } from './collections/Manufacturers'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Products } from './collections/Products'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({
        blocks: [
          {
            slug: 'carHighlight',
            fields: [
              {
                name: 'car',
                type: 'relationship',
                relationTo: 'cars',
              },
              {
                name: 'type',
                type: 'radio',
                defaultValue: 'image',
                options: [
                  {
                    label: 'Image',
                    value: 'image',
                  },
                  {
                    label: 'Video',
                    value: 'video',
                  },
                ],
              },
              {
                name: 'description',
                type: 'richText',
                label: 'Description',
                editor: defaultLexical,
              },
            ],
          },
        ],
        inlineBlocks: [
          {
            slug: 'carPice',
            admin: {
              components: {
                Label: './components/ui/CarPriceLabel',
              },
            },
            fields: [
              {
                name: 'car',
                type: 'relationship',
                relationTo: 'cars',
              },
              {
                name: 'description',
                type: 'richText',
                label: 'Description',
                editor: defaultLexical,
              },
            ],
          },
        ],
      }),
    ],
  }),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  collections: [Pages, Posts, Media, Manufacturers, Categories, Users, Products, Cars],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
  localization: {
    locales: [
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'Russian',
        code: 'ru',
      },
      {
        label: 'Armenian',
        code: 'hy',
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: {
      en,
      ru,
    },
  },
})
