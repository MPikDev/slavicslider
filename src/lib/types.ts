/**
 * Lightweight shapes of the CMS documents used by the website.
 * (Run `npm run generate:types` for the full generated types in src/payload-types.ts.)
 */
export type ID = number | string

export interface MediaDoc {
  id: ID
  url?: string | null
  alt?: string | null
  caption?: string | null
  width?: number | null
  height?: number | null
  mimeType?: string | null
  filename?: string | null
  focalX?: number | null
  focalY?: number | null
  createdAt?: string
  showInGallery?: boolean | null
  sizes?: Record<string, { url?: string | null; width?: number | null; height?: number | null } | undefined>
}

export type Rel<T> = T | ID | null | undefined

export interface PaintDoc {
  name?: string | null
  type?: 'solid' | 'colorShift' | 'wrap' | null
  colors?: Array<{ color?: string | null; id?: string | null }> | null
}

export interface DriverDoc {
  id: ID
  name: string
  nickname?: string | null
  carNumber?: string | null
  yearsDrifting?: number | null
  photo?: Rel<MediaDoc>
  bio?: string | null
  instagram?: string | null
  tiktok?: string | null
  youtube?: string | null
  order?: number | null
  slug?: string | null
}

export interface CarDoc {
  id: ID
  title?: string | null
  driver?: Rel<DriverDoc>
  status?: 'current' | 'past' | null
  yearsOwned?: string | null
  year?: number | null
  make?: string | null
  model?: string | null
  generation?: string | null
  nickname?: string | null
  coverPhoto?: Rel<MediaDoc>
  gallery?: Array<Rel<MediaDoc>> | null
  description?: string | null
  specs?: { engine?: string | null; power?: string | null; transmission?: string | null } | null
  paint?: PaintDoc | null
}

export interface PartDoc {
  id: ID
  car?: Rel<CarDoc>
  name: string
  brand?: string | null
  category?: string | null
  notes?: string | null
  affiliateUrl?: string | null
  affiliateSource?: string | null
}

export interface BuildLogDoc {
  id: ID
  car?: Rel<CarDoc>
  title: string
  date?: string | null
  content?: any
  photos?: Array<Rel<MediaDoc>> | null
}

export interface SponsorDoc {
  id: ID
  name: string
  logo?: Rel<MediaDoc>
  website?: string | null
  tier?: 'title' | 'gold' | 'supporting' | null
  blurb?: string | null
}

export interface TrackDoc {
  id: ID
  name: string
  location?: string | null
  photo?: Rel<MediaDoc>
  description?: string | null
  slug?: string | null
}

export interface EventDoc {
  id: ID
  name: string
  date: string
  status?: 'upcoming' | 'past' | null
  track?: Rel<TrackDoc>
  description?: string | null
  results?: any
}

export interface VideoDoc {
  id: ID
  title: string
  url: string
  platform?: 'youtube' | 'instagram' | 'other' | null
  date?: string | null
}

export interface SiteSettingsDoc {
  logo?: Rel<MediaDoc>
  tagline?: string | null
  city?: string | null
  heroImage?: Rel<MediaDoc>
  heroVideoUrl?: string | null
  contactEmail?: string | null
  instagram?: string | null
  tiktok?: string | null
  youtube?: string | null
  facebook?: string | null
  pitchIntro?: string | null
  stats?: Array<{ value: string; label: string; id?: string }> | null
  tiers?: Array<{ tier: 'title' | 'gold' | 'supporting'; price?: string | null; perks?: string | null; id?: string }> | null
  showMerch?: boolean | null
  siteDescription?: string | null
  shareImage?: Rel<MediaDoc>
}

/** Returns the populated document, or null if the relation is just an ID / empty. */
export const populated = <T extends { id: ID }>(rel: Rel<T>): T | null =>
  rel && typeof rel === 'object' ? (rel as T) : null
