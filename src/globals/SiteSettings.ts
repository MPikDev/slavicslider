import type { GlobalConfig } from 'payload'
import { anyone, hiddenFromEditors, isAdmin } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
    hidden: hiddenFromEditors,
    description: 'Logo, tagline, contact info and other site-wide settings.',
  },
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Team logo',
              admin: {
                description:
                  'Optional. Leave empty to use the built-in "SLAVIC SLIDERS" wordmark. A wide PNG with a see-through background works best.',
              },
            },
            {
              name: 'tagline',
              type: 'text',
              label: 'Tagline',
              defaultValue: '[PLACEHOLDER] Tagline: one short line about the team',
            },
            { name: 'city', type: 'text', label: 'Home city', defaultValue: '[PLACEHOLDER] City, ST' },
          ],
        },
        {
          label: 'Home page',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Big background photo',
              admin: { description: 'Wide action shot for the top of the home page.' },
            },
            {
              name: 'heroVideoUrl',
              type: 'text',
              label: 'Background YouTube video (optional)',
              admin: {
                description:
                  'Plays silently behind the title on desktop. The photo above is shown on phones and while it loads.',
              },
            },
          ],
        },
        {
          label: 'Contact & socials',
          fields: [
            { name: 'contactEmail', type: 'email', label: 'Contact email' },
            { name: 'instagram', type: 'text', label: 'Team Instagram link' },
            { name: 'tiktok', type: 'text', label: 'Team TikTok link' },
            { name: 'youtube', type: 'text', label: 'Team YouTube link' },
            { name: 'facebook', type: 'text', label: 'Team Facebook link' },
          ],
        },
        {
          label: 'Sponsor pitch',
          fields: [
            {
              name: 'pitchIntro',
              type: 'textarea',
              label: 'Why sponsor us (intro)',
              defaultValue:
                '[PLACEHOLDER] A few sentences on who the team is, where you compete, and what sponsors get.',
            },
            {
              name: 'stats',
              type: 'array',
              label: 'Stats',
              labels: { singular: 'Stat', plural: 'Stats' },
              maxRows: 6,
              admin: {
                description:
                  'Numbers shown on the Become a Sponsor page, e.g. "48K" / "Instagram followers". Only use real, current numbers.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'value', type: 'text', required: true, label: 'Number', admin: { width: '40%' } },
                    { name: 'label', type: 'text', required: true, label: 'What it counts', admin: { width: '60%' } },
                  ],
                },
              ],
            },
            {
              name: 'tiers',
              type: 'array',
              label: 'Sponsorship packages',
              maxRows: 4,
              admin: { description: 'What each sponsor level includes. Leave empty to hide this section.' },
              fields: [
                {
                  name: 'tier',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Title', value: 'title' },
                    { label: 'Gold', value: 'gold' },
                    { label: 'Supporting', value: 'supporting' },
                  ],
                },
                { name: 'price', type: 'text', label: 'Price (optional)', admin: { description: 'e.g. "Contact us" or "$500/season"' } },
                {
                  name: 'perks',
                  type: 'textarea',
                  label: 'What’s included',
                  admin: { description: 'One perk per line.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Pages & SEO',
          fields: [
            {
              name: 'showMerch',
              type: 'checkbox',
              label: 'Show the Merch page in the menu',
              defaultValue: false,
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              label: 'Search engine description',
              admin: { description: 'One or two sentences Google may show under the site name.' },
            },
            {
              name: 'shareImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Default share image',
              admin: {
                description: 'Shown when a link to the site is shared on social media (1200×630 works best).',
              },
            },
          ],
        },
      ],
    },
  ],
}
