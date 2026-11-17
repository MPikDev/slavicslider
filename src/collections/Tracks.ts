import type { CollectionConfig } from 'payload'
import { contentAccess } from '../access'
import { slugField } from '../hooks/slugField'

export const Tracks: CollectionConfig = {
  slug: 'tracks',
  labels: { singular: 'Track', plural: 'Tracks' },
  admin: {
    group: 'Racing',
    useAsTitle: 'name',
    defaultColumns: ['name', 'location'],
    description:
      'Tracks the team has drifted at. To show photos/videos on a track, tag them with the track when you upload them.',
    preview: (doc) => `/tracks#${doc?.slug ?? ''}`,
  },
  access: contentAccess,
  defaultSort: 'name',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Track name', admin: { width: '50%' } },
        { name: 'location', type: 'text', label: 'City, State', admin: { width: '50%', description: 'e.g. Monroe, WA' } },
      ],
    },
    { name: 'photo', type: 'upload', relationTo: 'media', label: 'Track photo' },
    { name: 'description', type: 'textarea', label: 'About this track' },
    slugField('name'),
  ],
}
