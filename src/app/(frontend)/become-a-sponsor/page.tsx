import type { Metadata } from 'next'
import { getSettings } from '@/lib/payload'
import { getSponsors } from '@/lib/queries'
import { pageMeta } from '@/lib/metadata'
import { TIER_LABELS } from '@/lib/site'
import { PageHead, SectionHeader } from '@/components/site/SectionHeader'
import { InquiryForm } from '@/components/site/InquiryForm'
import { SponsorCard } from '@/components/site/Sponsors'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMeta({
  title: 'Become a sponsor',
  path: '/become-a-sponsor',
  description: 'Put your brand on the Slavic Sliders drift cars. Sponsorship packages and contact form.',
})

export default async function BecomeASponsorPage() {
  const [settings, sponsors] = await Promise.all([getSettings(), getSponsors()])
  const stats = settings.stats || []
  const tiers = settings.tiers || []
  const order = ['title', 'gold', 'supporting']
  const sortedTiers = [...tiers].sort((a, b) => order.indexOf(a.tier) - order.indexOf(b.tier))
  let n = 0

  return (
    <>
      <PageHead index={1} eyebrow="Partner with us" title="Become a sponsor" />

      <section className="section">
        <div className="container">
          <SectionHeader index={++n} eyebrow="Why sponsor us" title="Get seen sideways" />
          {settings.pitchIntro ? (
            <div className="prose" style={{ marginBottom: 32 }}>
              {settings.pitchIntro.split(/\n{2,}/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          ) : null}
          {stats.length ? (
            <div className="stats-grid">
              {stats.map((s) => (
                <div className="stat" key={s.id || s.label}>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label label muted">{s.label}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {sortedTiers.length ? (
        <section className="section">
          <div className="container">
            <SectionHeader index={++n} eyebrow="Packages" title="Sponsor levels" />
            <div className="tier-cards">
              {sortedTiers.map((t) => (
                <div key={t.id || t.tier} className={`tier-card${t.tier === 'title' ? ' tier-card-title' : ''}`}>
                  <span className="badge">{TIER_LABELS[t.tier]}</span>
                  <h3>{t.price || TIER_LABELS[t.tier]}</h3>
                  {t.perks ? (
                    <ul>
                      {t.perks
                        .split('\n')
                        .map((l) => l.trim())
                        .filter(Boolean)
                        .map((perk) => (
                          <li key={perk}>{perk}</li>
                        ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section" id="inquiry">
        <div className="container split split-wide-left">
          <div>
            <SectionHeader index={++n} eyebrow="Get in touch" title="Let’s talk" />
            <InquiryForm
              type="sponsorship"
              renderedAt={Date.now()}
              tierOptions={order.map((v) => ({ value: v, label: TIER_LABELS[v] }))}
            />
          </div>
          {sponsors.length ? (
            <aside aria-labelledby="current-sponsors">
              <h2 id="current-sponsors" className="label muted" style={{ marginBottom: 16, marginTop: 8 }}>
                In good company
              </h2>
              <div className="sponsor-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {sponsors.slice(0, 6).map((s) => (
                  <SponsorCard key={s.id} sponsor={s} />
                ))}
              </div>
            </aside>
          ) : null}
        </div>
      </section>
    </>
  )
}
