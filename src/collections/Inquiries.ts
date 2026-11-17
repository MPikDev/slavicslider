import type { CollectionConfig } from 'payload'
import { isAdmin, isStaff } from '../access'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Inquiry', plural: 'Inquiries' },
  admin: {
    group: 'Inbox',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'email', 'status', 'createdAt'],
    description: 'Messages sent from the Contact and Become a Sponsor forms.',
  },
  access: {
    read: isStaff,
    create: () => false, // only the website forms can create these
    update: isStaff,
    delete: isAdmin,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          label: 'Form',
          options: [
            { label: 'Contact', value: 'contact' },
            { label: 'Sponsorship', value: 'sponsorship' },
          ],
          admin: { readOnly: true, width: '50%' },
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'new',
          label: 'Status',
          options: [
            { label: 'New', value: 'new' },
            { label: 'Replied', value: 'replied' },
            { label: 'Closed', value: 'closed' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'name', type: 'text', required: true, admin: { readOnly: true } },
    { name: 'email', type: 'email', required: true, admin: { readOnly: true } },
    { name: 'phone', type: 'text', admin: { readOnly: true } },
    { name: 'company', type: 'text', label: 'Company', admin: { readOnly: true } },
    { name: 'tierInterest', type: 'text', label: 'Interested in tier', admin: { readOnly: true } },
    { name: 'message', type: 'textarea', admin: { readOnly: true } },
  ],
}
