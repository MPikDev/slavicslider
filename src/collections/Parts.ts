import type { CollectionConfig } from 'payload'
import { contentAccess } from '../access'
import { affiliateSourceOptions } from '../lib/affiliates'

export const PART_CATEGORIES = [
  { label: 'Engine', value: 'engine' },
  { label: 'Drivetrain', value: 'drivetrain' },
  { label: 'Suspension', value: 'suspension' },
  { label: 'Steering / Angle Kit', value: 'steering' },
  { label: 'Wheels / Tires', value: 'wheels' },
  { label: 'Brakes', value: 'brakes' },
  { label: 'Aero / Body', value: 'aero' },
  { label: 'Interior / Safety', value: 'interior' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Other', value: 'other' },
]

export const Parts: CollectionConfig = {
  slug: 'parts',
  labels: { singular: 'Part', plural: 'Parts' },
  admin: {
    group: 'Team',
    useAsTitle: 'name',
    defaultColumns: ['name', 'car', 'category', 'brand'],
    description: 'Parts on each car. Add a store link to show a “Buy on Amazon” button.',
    // Opens the right driver page for this part (see src/app/(frontend)/view/[type]/[id]/route.ts)
    preview: (doc) => `/view/part/${doc?.id}`,
  },
  access: contentAccess,
  defaultSort: 'category',
  fields: [
    {
      name: 'car',
      type: 'relationship',
      relationTo: 'cars',
      required: true,
      label: 'Car',
      admin: { description: 'Which car is this part on?' },
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Part name', admin: { width: '50%', description: 'e.g. "Coilovers"' } },
        { name: 'brand', type: 'text', label: 'Brand', admin: { width: '50%', description: 'e.g. "BC Racing"' } },
      ],
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'other',
      label: 'Category',
      options: PART_CATEGORIES,
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes (optional)',
      admin: { description: 'e.g. "Spring rates 12k front / 8k rear"' },
    },
    {
      type: 'collapsible',
      label: 'Store link (optional)',
      fields: [
        {
          name: 'affiliateUrl',
          type: 'text',
          label: 'Store link',
          admin: {
            description:
              'Paste the Amazon link here (use the SiteStripe "Get link" button so it includes our Associates tag). Leave empty if there’s no link.',
          },
          validate: (value: unknown) => {
            if (!value) return true
            return typeof value === 'string' && /^https?:\/\//i.test(value.trim())
              ? true
              : 'The link should start with https://'
          },
        },
        {
          name: 'affiliateSource',
          type: 'select',
          label: 'Store',
          defaultValue: 'amazon',
          options: affiliateSourceOptions,
          admin: { description: 'Amazon for now. More stores can be added later.' },
        },
      ],
    },
  ],
}
