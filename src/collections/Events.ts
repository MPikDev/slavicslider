import type { CollectionConfig } from 'payload'
import { contentAccess } from '../access'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events' },
  admin: {
    group: 'Racing',
    useAsTitle: 'name',
    defaultColumns: ['name', 'date', 'track', 'status'],
    description: 'Competitions, practice days and meets. The next upcoming one is shown on the home page.',
    preview: () => '/events',
  },
  access: contentAccess,
  defaultSort: '-date',
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Event name', admin: { description: 'e.g. "Pro-Am Round 2"' } },
    {
      type: 'row',
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          label: 'Date',
          admin: { width: '50%', date: { pickerAppearance: 'dayOnly', displayFormat: 'MMM d, yyyy' } },
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'upcoming',
          label: 'Status',
          options: [
            { label: 'Upcoming', value: 'upcoming' },
            { label: 'Past (done)', value: 'past' },
          ],
          admin: { width: '50%', description: 'Switch to "Past" after the event and add results below.' },
        },
      ],
    },
    { name: 'track', type: 'relationship', relationTo: 'tracks', label: 'Track' },
    { name: 'description', type: 'textarea', label: 'Details', admin: { description: 'Times, tickets, what to expect…' } },
    {
      name: 'results',
      type: 'richText',
      label: 'Results',
      admin: { description: 'How did it go? Placements, highlights.' },
    },
  ],
}
