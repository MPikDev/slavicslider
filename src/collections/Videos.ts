import type { CollectionConfig } from 'payload'
import { contentAccess } from '../access'
import { detectPlatform } from '../lib/video'

export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: { singular: 'Video', plural: 'Videos' },
  admin: {
    group: 'Photos & Videos',
    useAsTitle: 'title',
    defaultColumns: ['title', 'platform', 'date'],
    description:
      'Videos are NOT uploaded here. Post the video on YouTube or Instagram first, then paste its link.',
    preview: () => '/gallery?type=video',
  },
  access: contentAccess,
  defaultSort: '-date',
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.url) data.platform = detectPlatform(data.url)
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Video title',
      admin: { description: 'e.g. "Tandem runs at Evergreen, round 3"' },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'YouTube or Instagram link',
      admin: {
        description:
          'Paste the link from the Share button, e.g. https://youtu.be/abc123 or https://www.instagram.com/reel/abc123/',
      },
      validate: (value: unknown) => {
        if (!value || typeof value !== 'string') return 'Please paste a YouTube or Instagram link.'
        return detectPlatform(value) === 'other'
          ? 'That doesn’t look like a YouTube or Instagram video link. Use the Share → Copy link button on the video.'
          : true
      },
    },
    {
      name: 'platform',
      type: 'select',
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Instagram', value: 'instagram' },
        { label: 'Other', value: 'other' },
      ],
      admin: { hidden: true },
    },
    {
      name: 'date',
      type: 'date',
      label: 'Date filmed',
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'showInGallery',
      type: 'checkbox',
      label: 'Show in the Gallery',
      defaultValue: true,
    },
    {
      type: 'collapsible',
      label: 'Tags (helps people filter the gallery)',
      fields: [
        { name: 'tracks', type: 'relationship', relationTo: 'tracks', hasMany: true, label: 'Track(s)' },
        { name: 'drivers', type: 'relationship', relationTo: 'drivers', hasMany: true, label: 'Driver(s)' },
        { name: 'events', type: 'relationship', relationTo: 'events', hasMany: true, label: 'Event(s)' },
      ],
    },
  ],
}
