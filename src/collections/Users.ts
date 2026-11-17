import type { CollectionConfig } from 'payload'
import { hiddenFromEditors, isAdmin, isAdminField, isAdminOrSelf } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Team login', plural: 'Team logins' },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 30, // stay logged in for 30 days
    maxLoginAttempts: 10,
    lockTime: 10 * 60 * 1000,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Settings',
    hidden: hiddenFromEditors,
    description: 'People who can log in to this admin panel. Admins can change everything; Editors manage website content.',
  },
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
    admin: () => true,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // The very first account created is always an Admin.
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true, req })
          if (totalDocs === 0) data.role = 'admin'
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Admin (everything, including logins and site settings)', value: 'admin' },
        { label: 'Editor (drivers, cars, photos, events, sponsors…)', value: 'editor' },
      ],
      access: {
        create: isAdminField,
        update: isAdminField,
      },
      admin: {
        description: 'Editors can add and change website content but cannot manage logins or Site Settings.',
      },
    },
  ],
}
