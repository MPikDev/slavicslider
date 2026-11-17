import type { CollectionConfig } from 'payload'
import { contentAccess } from '../access'

const HEX = /^#[0-9a-fA-F]{6}$/

const countRows = (value: unknown): number =>
  Array.isArray(value) ? value.length : typeof value === 'number' ? value : 0

/** Builds the display name used in dropdowns, e.g. "2002 Ford Mustang SN95 New Edge" */
const buildTitle = (d: Record<string, unknown>): string => {
  const base = [d.year, d.make, d.model, d.generation].filter(Boolean).join(' ')
  return d.nickname ? `${base} “${d.nickname}”` : base || 'Untitled car'
}

export const Cars: CollectionConfig = {
  slug: 'cars',
  labels: { singular: 'Car', plural: 'Cars' },
  admin: {
    group: 'Team',
    useAsTitle: 'title',
    defaultColumns: ['title', 'driver', 'status'],
    description: 'Every car a driver owns or has owned. Set Status to "Past" when a car is sold or retired.',
    // Opens the right driver page for this car (see src/app/(frontend)/view/[type]/[id]/route.ts)
    preview: (doc) => `/view/car/${doc?.id}`,
  },
  access: contentAccess,
  defaultSort: 'driver',
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        data.title = buildTitle({ ...(originalDoc || {}), ...data })
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'driver',
      type: 'relationship',
      relationTo: 'drivers',
      required: true,
      label: 'Driver',
      admin: { description: 'Whose car is this?' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'current',
      label: 'Status',
      options: [
        { label: 'Current car', value: 'current' },
        { label: 'Past car (sold / retired)', value: 'past' },
      ],
      admin: { position: 'sidebar', description: 'Past cars show in black & white on the driver’s page.' },
    },
    {
      name: 'yearsOwned',
      type: 'text',
      label: 'Years owned',
      admin: { position: 'sidebar', description: 'e.g. 2021–present or 2017–2020' },
    },
    {
      type: 'row',
      fields: [
        { name: 'year', type: 'number', label: 'Year', admin: { width: '20%', description: 'e.g. 2002' } },
        { name: 'make', type: 'text', label: 'Make', required: true, admin: { width: '25%', description: 'e.g. Ford' } },
        { name: 'model', type: 'text', label: 'Model', required: true, admin: { width: '25%', description: 'e.g. Mustang' } },
        {
          name: 'generation',
          type: 'text',
          label: 'Generation / trim',
          admin: { width: '30%', description: 'e.g. SN95 New Edge' },
        },
      ],
    },
    {
      name: 'nickname',
      type: 'text',
      label: 'Car nickname (optional)',
    },
    {
      name: 'coverPhoto',
      type: 'upload',
      relationTo: 'media',
      label: 'Main photo',
      admin: { description: 'The big photo at the top of the car’s page. Landscape (sideways) photos look best.' },
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'More photos',
      admin: { description: 'Extra photos shown as a strip under the main photo. Drag to reorder.' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'About this car',
    },
    {
      name: 'specs',
      type: 'group',
      label: 'Specs',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'engine', type: 'text', label: 'Engine', admin: { width: '33%', description: 'e.g. 4.6L 2V, turbo' } },
            { name: 'power', type: 'text', label: 'Power', admin: { width: '33%', description: 'e.g. 420 whp' } },
            { name: 'transmission', type: 'text', label: 'Transmission', admin: { width: '33%', description: 'e.g. T56 6-speed' } },
          ],
        },
      ],
    },
    {
      name: 'paint',
      type: 'group',
      label: 'Paint / wrap',
      admin: { description: 'Shows as a little color dot next to the car name.' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Paint name',
              admin: { width: '50%', description: 'e.g. "Mystichrome wrap" or "Navy"' },
            },
            {
              name: 'type',
              type: 'select',
              label: 'Paint type',
              defaultValue: 'solid',
              required: true,
              options: [
                { label: 'Solid (one color)', value: 'solid' },
                { label: 'Color-shift (2–4 colors)', value: 'colorShift' },
                { label: 'Wrap (2–4 colors)', value: 'wrap' },
              ],
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'colors',
          type: 'array',
          label: 'Colors',
          labels: { singular: 'Color', plural: 'Colors' },
          minRows: 1,
          maxRows: 4,
          admin: {
            description: 'Solid: add exactly 1 color. Color-shift or Wrap: add 2 to 4 colors, in order.',
            initCollapsed: false,
          },
          validate: (value: unknown, { siblingData }: { siblingData?: Record<string, unknown> }) => {
            const n = countRows(value)
            const type = siblingData?.type ?? 'solid'
            if (type === 'solid' && n !== 1) return 'A solid paint needs exactly 1 color.'
            if (type !== 'solid' && (n < 2 || n > 4)) return 'Color-shift and wrap paints need 2 to 4 colors.'
            return true
          },
          fields: [
            {
              name: 'color',
              type: 'text',
              required: true,
              label: 'Color',
              admin: {
                components: { Field: '/components/admin/ColorField#ColorField' },
              },
              validate: (value: unknown) =>
                typeof value === 'string' && HEX.test(value) ? true : 'Pick a color (format like #1F63E0).',
            },
          ],
        },
      ],
    },
  ],
}
