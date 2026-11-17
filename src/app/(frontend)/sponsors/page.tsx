import Link from 'next/link'
import type { Metadata } from 'next'
import { getSponsors } from '@/lib/queries'
import { pageMeta } from '@/lib/metadata'
import { PageHead } from '@/components/site/SectionHeader'
import { SponsorCard, SponsorCta, SponsorFeature } from '@/components/site/Sponsors'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMeta({
  title: 'Sponsors',
  path: '/sponsors',
  description: 'The companies that keep Slavic Sliders on track.',
})

export default async function SponsorsPage() {
  const sponsors = await getSponsors()
  const title = sponsors.filter((s) => s.tier === 'title')
  const gold = sponsors.filter((s) => s.tier === 'gold')
  const supporting = sponsors.filter((s) => s.tier !== 'title' && s.tier !== 'gold')

  return (
    <>
      <PageHead
        index={1}
        eyebrow="Our partners"
        title="Sponsors"
        intro={<p>These companies keep the tires smoking. Show them some love.</p>}
      />
      <section className="section">
        <div className="container">
          {title.length ? (
            <>
              <h2 className="tier-heading label">Title sponsor{title.length > 1 ? 's' : ''}</h2>
              <div className="stack">
                {title.map((s) => (
                  <SponsorFeature key={s.id} sponsor={s} />
                ))}
              </div>
            </>
          ) : null}

          {gold.length ? (
            <>
              <h2 className="tier-heading label">Gold</h2>
              <div className="sponsor-grid">
                {gold.map((s) => (
                  <SponsorCard key={s.id} sponsor={s} />
                ))}
              </div>
            </>
          ) : null}

          <h2 className="tier-heading label">Supporting</h2>
          <div className="sponsor-grid sponsor-grid-sm">
            {supporting.map((s) => (
              <SponsorCard key={s.id} sponsor={s} />
            ))}
            <SponsorCta />
          </div>

          <div className="panel mt-lg" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: 28 }}>Want your logo on our cars?</h2>
              <p className="muted" style={{ margin: '8px 0 0' }}>See what we offer and send us a note.</p>
            </div>
            <Link href="/become-a-sponsor" className="btn btn-primary">
              Become a sponsor
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
