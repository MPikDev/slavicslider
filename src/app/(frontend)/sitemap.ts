import type { MetadataRoute } from 'next'
import { getDrivers } from '@/lib/queries'
import { getSettings } from '@/lib/payload'
import { siteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const [drivers, settings] = await Promise.all([getDrivers().catch(() => []), getSettings()])
  const pages = ['', '/drivers', '/gallery', '/tracks', '/events', '/sponsors', '/become-a-sponsor', '/contact']
  if (settings.showMerch) pages.push('/merch')
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7 })),
    ...drivers.map((d) => ({ url: `${base}/drivers/${d.slug}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
  ]
}
