import Link from 'next/link'
import type { Metadata } from 'next'
import { getSettings } from '@/lib/payload'
import { getCurrentCarByDriver, getDrivers, getGalleryItems, getSponsors, getTracks, getUpcomingEvents } from '@/lib/queries'
import { pageMeta } from '@/lib/metadata'
import { pad2 } from '@/lib/site'
import { getYouTubeId, youTubeEmbed } from '@/lib/video'
import { SectionHeader } from '@/components/site/SectionHeader'
import { DriverCard } from '@/components/site/DriverCard'
import { EventBanner } from '@/components/site/DateBlock'
import { MediaGrid } from '@/components/site/MediaGrid'
import { SponsorCard, SponsorCta, SponsorFeature } from '@/components/site/Sponsors'
import { Img } from '@/components/site/Img'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  return pageMeta({ path: '/', description: s.siteDescription || s.tagline, image: s.shareImage || s.heroImage })
}

export default async function HomePage() {
  const [settings, drivers, carByDriver, upcoming, media, tracks, sponsors] = await Promise.all([
    getSettings(),
    getDrivers(),
    getCurrentCarByDriver(),
    getUpcomingEvents(1),
    getGalleryItems({ limit: 6 }),
    getTracks(),
    getSponsors(),
  ])

  const nextEvent = upcoming[0]
  const heroVideoId = getYouTubeId(settings.heroVideoUrl)
  const titleSponsors = sponsors.filter((s) => s.tier === 'title')
  const otherSponsors = sponsors.filter((s) => s.tier !== 'title')
  let n = 0
  const num = () => ++n

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-media">
          <Img media={settings.heroImage} alt="" priority sizes="100vw" />
        </div>
        {heroVideoId ? (
          <div className="hero-video" aria-hidden="true">
            <iframe src={youTubeEmbed(heroVideoId, { background: true })} title="" tabIndex={-1} allow="autoplay; encrypted-media" />
          </div>
        ) : null}
        <div className="hero-overlay" aria-hidden="true" />
        <div className="container hero-content">
          <span className="hero-stripe" aria-hidden="true" />
          {settings.city ? <p className="label hero-meta">{settings.city}</p> : null}
          <h1 className="hero-title" id="hero-title">
            Slavic
            <br />
            Sliders
          </h1>
          {settings.tagline ? <p className="hero-tagline">{settings.tagline}</p> : null}
          <div className="btn-row">
            <Link href="/drivers" className="btn btn-primary">
              Meet the drivers
            </Link>
            <Link href="/gallery?type=video" className="btn btn-secondary">
              Watch us slide
            </Link>
          </div>
        </div>
      </section>

      {/* ── Drivers ── */}
      <section className="section" aria-labelledby="team-title">
        <div className="container">
          <SectionHeader
            index={num()}
            eyebrow="The team"
            title="Drivers"
            id="team-title"
            action={<Link href="/drivers" className="text-link">All drivers</Link>}
          />
          {drivers.length ? (
            <div className="driver-grid">
              {drivers.map((d) => (
                <DriverCard key={d.id} driver={d} car={carByDriver.get(String(d.id))} />
              ))}
            </div>
          ) : (
            <p className="empty-state">Drivers coming soon.</p>
          )}
        </div>
      </section>

      {/* ── Next event ── */}
      {nextEvent ? (
        <section className="section" aria-label="Next event">
          <div className="container">
            <EventBanner event={nextEvent} />
          </div>
        </section>
      ) : null}

      {/* ── Photos & video ── */}
      <section className="section" aria-labelledby="media-title">
        <div className="container">
          <SectionHeader
            index={num()}
            eyebrow="Photos & video"
            title="From the track"
            id="media-title"
            action={<Link href="/gallery" className="text-link">Full gallery</Link>}
          />
          <MediaGrid items={media} />
        </div>
      </section>

      {/* ── Tracks ── */}
      {tracks.length ? (
        <section className="section" aria-labelledby="tracks-title">
          <div className="container">
            <SectionHeader
              index={num()}
              eyebrow="Where we slide"
              title="Tracks"
              id="tracks-title"
              action={<Link href="/tracks" className="text-link">All tracks</Link>}
            />
            <ol className="track-list">
              {tracks.slice(0, 8).map((t, i) => (
                <li key={t.id}>
                  <Link href={`/tracks#${t.slug}`}>
                    <span className="track-num" aria-hidden="true">{pad2(i + 1)}</span>
                    <span className="track-name">{t.name}</span>
                    <span className="caption">{t.location}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* ── Sponsors ── */}
      <section className="section" aria-labelledby="sponsors-title">
        <div className="container">
          <SectionHeader
            index={num()}
            eyebrow="Our partners"
            title="Sponsors"
            id="sponsors-title"
            action={<Link href="/sponsors" className="text-link">All sponsors</Link>}
          />
          {titleSponsors.map((s) => (
            <div key={s.id} style={{ marginBottom: 12 }}>
              <SponsorFeature sponsor={s} />
            </div>
          ))}
          <div className="sponsor-grid sponsor-grid-sm">
            {otherSponsors.map((s) => (
              <SponsorCard key={s.id} sponsor={s} />
            ))}
            <SponsorCta />
          </div>
        </div>
      </section>

    </>
  )
}
