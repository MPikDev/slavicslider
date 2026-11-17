import Link from 'next/link'
import type { Metadata } from 'next'
import { getSettings } from '@/lib/payload'
import { pageMeta } from '@/lib/metadata'
import { SectionHeader } from '@/components/site/SectionHeader'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    ...pageMeta({ title: 'Merch', path: '/merch', description: 'Slavic Sliders merch is coming soon.' }),
    // Keep it out of search results until the page is switched on in Site Settings
    robots: settings.showMerch ? undefined : { index: false, follow: false },
  }
}

export default function MerchPage() {
  return (
    <section className="section">
      <div className="container coming-soon">
        <SectionHeader eyebrow="Merch" title="Coming soon" as="h1" />
        <p className="muted" style={{ maxWidth: 560 }}>
          Shirts, stickers and more are on the way. Follow us on social to hear when they drop.
        </p>
        <div className="btn-row">
          <Link href="/contact" className="btn btn-secondary">
            Get notified
          </Link>
        </div>
      </div>
    </section>
  )
}
