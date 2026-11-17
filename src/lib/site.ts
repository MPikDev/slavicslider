export const SITE_NAME = 'Slavic Sliders'

export const siteUrl = (): string =>
  (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

export const formatDate = (iso?: string | null, opts: Intl.DateTimeFormatOptions = {}) =>
  iso
    ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC', ...opts })
    : ''

export const pad2 = (n: number) => String(n).padStart(2, '0')

/** Link through the click-logging redirect. */
export const goHref = (kind: 'part' | 'sponsor', id: string | number) => `/go/${kind}-${id}`

export const OUTBOUND_REL = 'sponsored nofollow noopener'

export const PART_CATEGORY_LABELS: Record<string, string> = {
  engine: 'Engine',
  drivetrain: 'Drivetrain',
  suspension: 'Suspension',
  steering: 'Steering / Angle Kit',
  wheels: 'Wheels / Tires',
  brakes: 'Brakes',
  aero: 'Aero / Body',
  interior: 'Interior / Safety',
  electronics: 'Electronics',
  other: 'Other',
}

export const TIER_LABELS: Record<string, string> = {
  title: 'Title sponsor',
  gold: 'Gold',
  supporting: 'Supporting',
}
