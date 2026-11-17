import type { CollectionConfig } from 'payload'
import { contentAccess } from '../access'
import { slugField } from '../hooks/slugField'

const urlHelp = (site: string, example: string) => `Full link to the ${site} profile, e.g. ${example}`

export const Drivers: CollectionConfig = {
  slug: 'drivers',
  labels: { singular: 'Driver', plural: 'Drivers' },
  admin: {
    group: 'Team',
    useAsTitle: 'name',
    defaultColumns: ['name', 'carNumber', 'nickname', 'order'],
    description: 'Team drivers. Each driver gets their own page with their cars.',
    preview: (doc) => `/drivers/${doc?.slug ?? ''}`,
  },
  access: contentAccess,
  defaultSort: 'order',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Driver name',
          admin: { width: '50%' },
        },
        {
          name: 'nickname',
          type: 'text',
          label: 'Nickname (optional)',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'carNumber',
          type: 'text',
          label: 'Car number',
          admin: { width: '50%', description: 'The number on the car, e.g. 77' },
        },
        {
          name: 'yearsDrifting',
          type: 'number',
          label: 'Years drifting',
          min: 0,
          admin: { width: '50%', description: 'Just the number, e.g. 6' },
        },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Driver photo',
      admin: { description: 'A clear photo of the driver (helmet off works best). Tip: turn off "Show in the Gallery".' },
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Short bio',
      admin: { description: 'A few sentences: how they got into drifting, favorite track, etc.' },
    },
    {
      type: 'collapsible',
      label: 'Social media links',
      fields: [
        { name: 'instagram', type: 'text', label: 'Instagram link', admin: { description: urlHelp('Instagram', 'https://instagram.com/username') } },
        { name: 'tiktok', type: 'text', label: 'TikTok link', admin: { description: urlHelp('TikTok', 'https://tiktok.com/@username') } },
        { name: 'youtube', type: 'text', label: 'YouTube link', admin: { description: urlHelp('YouTube', 'https://youtube.com/@channel') } },
      ],
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display order',
      defaultValue: 10,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers show first on the website (1, 2, 3…).',
      },
    },
    slugField('name'),
  ],
}
