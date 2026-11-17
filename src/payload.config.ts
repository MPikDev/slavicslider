import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Drivers } from './collections/Drivers'
import { Cars } from './collections/Cars'
import { Parts } from './collections/Parts'
import { BuildLogPosts } from './collections/BuildLogPosts'
import { Media } from './collections/Media'
import { Videos } from './collections/Videos'
import { Tracks } from './collections/Tracks'
import { Events } from './collections/Events'
import { Sponsors } from './collections/Sponsors'
import { Inquiries } from './collections/Inquiries'
import { LinkClicks } from './collections/LinkClicks'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const smtpPort = Number(process.env.SMTP_PORT || 587)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' · Slavic Sliders admin',
    },
    dateFormat: 'MMM d, yyyy',
  },
  // Sidebar order in the admin panel
  collections: [
    Drivers,
    Cars,
    Parts,
    BuildLogPosts,
    Media,
    Videos,
    Tracks,
    Events,
    Sponsors,
    Inquiries,
    LinkClicks,
    Users,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  upload: {
    limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB per photo (they get shrunk after upload)
  },
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'website@example.com',
        defaultFromName: process.env.SMTP_FROM_NAME || 'Slavic Sliders Website',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
        },
      })
    : undefined,
  telemetry: false,
})
