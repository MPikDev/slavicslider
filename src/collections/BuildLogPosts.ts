import type { CollectionConfig } from 'payload'
import { contentAccess } from '../access'

export const BuildLogPosts: CollectionConfig = {
  slug: 'build-log-posts',
  labels: { singular: 'Build log post', plural: 'Build log' },
  admin: {
    group: 'Team',
    useAsTitle: 'title',
    defaultColumns: ['title', 'car', 'date'],
    description: 'Updates on a car’s build: new parts, repairs, progress. Shows as a timeline on the car’s page.',
    // Opens the right driver page for this build-log (see src/app/(frontend)/view/[type]/[id]/route.ts)
    preview: (doc) => `/view/build-log/${doc?.id}`,
  },
  access: contentAccess,
  defaultSort: '-date',
  fields: [
    {
      name: 'car',
      type: 'relationship',
      relationTo: 'cars',
      required: true,
      label: 'Car',
    },
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Title', admin: { width: '65%', description: 'e.g. "New angle kit installed"' } },
        {
          name: 'date',
          type: 'date',
          required: true,
          label: 'Date',
          defaultValue: () => new Date().toISOString(),
          admin: { width: '35%', date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      label: 'What happened?',
    },
    {
      name: 'photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Photos',
    },
  ],
}
