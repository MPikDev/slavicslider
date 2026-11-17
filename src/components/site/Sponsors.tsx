import Link from 'next/link'
import type { SponsorDoc } from '@/lib/types'
import { populated } from '@/lib/types'
import { goHref, OUTBOUND_REL, TIER_LABELS } from '@/lib/site'
import { Img } from './Img'

const linkProps = (s: SponsorDoc) =>
  s.website
    ? {
        href: goHref('sponsor', s.id),
        target: '_blank',
        rel: OUTBOUND_REL,
        'aria-label': `${s.name} website (opens in a new tab)`,
      }
    : null

function Logo({ sponsor, sizes }: { sponsor: SponsorDoc; sizes: string }) {
  const logo = populated(sponsor.logo)
  return logo?.url ? (
    <Img media={logo} fill={false} alt={`${sponsor.name} logo`} sizes={sizes} />
  ) : (
    <span className="sponsor-name-fallback">{sponsor.name}</span>
  )
}

/** Big featured card for a Title sponsor. */
export function SponsorFeature({ sponsor }: { sponsor: SponsorDoc }) {
  const lp = linkProps(sponsor)
  const inner = (
    <>
      <div className="sponsor-feature-logo">
        <Logo sponsor={sponsor} sizes="(min-width: 768px) 50vw, 90vw" />
      </div>
      <div className="sponsor-feature-body">
        <span className="badge">{TIER_LABELS.title}</span>
        <h3>{sponsor.name}</h3>
        {sponsor.blurb ? <p className="muted" style={{ margin: 0 }}>{sponsor.blurb}</p> : null}
        {lp ? <span className="text-link" style={{ marginTop: 8 }}>Visit website</span> : null}
      </div>
    </>
  )
  return lp ? (
    <a className="sponsor-feature" {...lp}>
      {inner}
    </a>
  ) : (
    <div className="sponsor-feature">{inner}</div>
  )
}

export function SponsorCard({ sponsor }: { sponsor: SponsorDoc }) {
  const lp = linkProps(sponsor)
  const inner = (
    <>
      <div className="sponsor-card-logo">
        <Logo sponsor={sponsor} sizes="(min-width: 768px) 25vw, 45vw" />
      </div>
      <div className="sponsor-card-body">
        <strong>{sponsor.name}</strong>
        {sponsor.blurb ? <span className="caption">{sponsor.blurb}</span> : null}
      </div>
    </>
  )
  return lp ? (
    <a className="sponsor-card" {...lp}>
      {inner}
    </a>
  ) : (
    <div className="sponsor-card">{inner}</div>
  )
}

export function SponsorCta() {
  return (
    <Link href="/become-a-sponsor" className="sponsor-cta">
      <strong>Your logo here</strong>
      <span>Become a sponsor →</span>
    </Link>
  )
}
