import type { CollectionConfig } from 'payload'
import { contentAccess } from '../access'

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  labels: { singular: 'Sponsor', plural: 'Sponsors' },
  admin: {
    group: 'Sponsors',
    useAsTitle: 'name',
    defaultColumns: ['name', 'tier', 'order'],
    description: 'Companies that support the team. Title sponsors get the biggest logo.',
    preview: () => '/sponsors',
  },
  access: contentAccess,
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Company name' },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      admin: {
        description:
          'PNG with a see-through background works best (white logos are fine, they sit on a dark card). Turn off "Show in the Gallery" on the logo.',
      },
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website link',
      admin: { description: 'e.g. https://fifthwheelllc.com. Clicks are counted (see Inbox → Link Clicks).' },
      validate: (value: unknown) =>
        !value || (typeof value === 'string' && /^https?:\/\//i.test(value.trim()))
          ? true
          : 'The link should start with https://',
    },
    {
      name: 'tier',
      type: 'select',
      required: true,
      defaultValue: 'supporting',
      label: 'Sponsor level',
      options: [
        { label: 'Title sponsor', value: 'title' },
        { label: 'Gold', value: 'gold' },
        { label: 'Supporting', value: 'supporting' },
      ],
    },
    {
      name: 'blurb',
      type: 'textarea',
      label: 'One-line description',
      admin: { description: 'e.g. "Car transportation"' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display order',
      defaultValue: 10,
      admin: { position: 'sidebar', description: 'Lower numbers show first.' },
    },
  ],
}
