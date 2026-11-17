import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'
import { contentAccess } from '../access'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Photo', plural: 'Photos' },
  admin: {
    group: 'Photos & Videos',
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'showInGallery'],
    description:
      'Every photo on the website. Drag photos in (or tap to pick from your phone). Big photos are shrunk automatically.',
    listSearchableFields: ['alt', 'caption', 'filename'],
  },
  access: contentAccess,
  defaultSort: '-createdAt',
  upload: {
    staticDir: process.env.MEDIA_DIR || path.resolve(dirname, '../../media'),
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml'],
    // Shrink huge phone/camera photos and store them as compressed WebP
    resizeOptions: { width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true },
    formatOptions: { format: 'webp', options: { quality: 82 } },
    imageSizes: [
      { name: 'thumbnail', width: 480, height: 480, position: 'centre' },
      { name: 'card', width: 1080 },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Describe the photo',
      required: true,
      admin: {
        description:
          'A short description for people using screen readers and for Google, e.g. "Blue 350Z drifting at the hairpin, tire smoke".',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption (optional)',
      admin: { description: 'Shown under the photo in the gallery.' },
    },
    {
      name: 'showInGallery',
      type: 'checkbox',
      label: 'Show in the Gallery',
      defaultValue: true,
      admin: { description: 'Turn OFF for logos, headshots and graphics that shouldn’t appear in the photo gallery.' },
    },
    {
      type: 'collapsible',
      label: 'Tags (helps people filter the gallery)',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'tracks',
          type: 'relationship',
          relationTo: 'tracks',
          hasMany: true,
          label: 'Track(s)',
          admin: { description: 'Where was this taken?' },
        },
        {
          name: 'drivers',
          type: 'relationship',
          relationTo: 'drivers',
          hasMany: true,
          label: 'Driver(s)',
          admin: { description: 'Who is in the photo?' },
        },
        {
          name: 'events',
          type: 'relationship',
          relationTo: 'events',
          hasMany: true,
          label: 'Event(s)',
        },
      ],
    },
  ],
}
