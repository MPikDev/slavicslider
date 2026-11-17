import type { CollectionConfig } from 'payload'
import { isAdmin, isStaff } from '../access'

export const LinkClicks: CollectionConfig = {
  slug: 'link-clicks',
  labels: { singular: 'Link click', plural: 'Link Clicks' },
  admin: {
    group: 'Inbox',
    useAsTitle: 'label',
    defaultColumns: ['label', 'kind', 'page', 'createdAt'],
    description: 'Logged automatically when someone clicks a sponsor or store link. Use the report to show sponsors their traffic.',
    components: {
      beforeListTable: ['/components/admin/LinkClicksReport#LinkClicksReport'],
    },
  },
  access: {
    read: isStaff,
    create: () => false, // logged by the /go/ redirect route only
    update: () => false,
    delete: isAdmin,
  },
  defaultSort: '-createdAt',
  fields: [
    { name: 'label', type: 'text', label: 'Link', admin: { readOnly: true } },
    {
      name: 'kind',
      type: 'select',
      label: 'Type',
      options: [
        { label: 'Sponsor', value: 'sponsor' },
        { label: 'Store / affiliate', value: 'affiliate' },
      ],
      admin: { readOnly: true },
    },
    { name: 'targetId', type: 'text', index: true, admin: { readOnly: true } },
    { name: 'url', type: 'text', label: 'Destination', admin: { readOnly: true } },
    { name: 'page', type: 'text', label: 'Clicked from page', admin: { readOnly: true } },
  ],
}
