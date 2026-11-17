import Link from 'next/link'
import type { Metadata } from 'next'
import { getPastEvents, getUpcomingEvents } from '@/lib/queries'
import { pageMeta } from '@/lib/metadata'
import type { EventDoc } from '@/lib/types'
import { populated } from '@/lib/types'
import { formatDate } from '@/lib/site'
import { PageHead, SectionHeader } from '@/components/site/SectionHeader'
import { DateBlock } from '@/components/site/DateBlock'
import { RichText } from '@/components/site/RichText'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMeta({
  title: 'Events',
  path: '/events',
  description: 'Where to see Slavic Sliders next, plus results from past events.',
})

function EventRow({ event, past }: { event: EventDoc; past?: boolean }) {
  const track = populated(event.track)
  return (
    <article className={`event-row${past ? ' past' : ''}`} aria-labelledby={`event-${event.id}`}>
      <DateBlock iso={event.date} />
      <div className="event-row-body">
        <time className="label muted" dateTime={event.date}>
          {formatDate(event.date, { weekday: 'short' })}
        </time>
        <h3 id={`event-${event.id}`}>{event.name}</h3>
        {track ? (
          <p className="muted" style={{ margin: '0 0 8px' }}>
            <Link href={`/tracks#${track.slug}`}>{track.name}</Link>
            {track.location ? ` · ${track.location}` : ''}
          </p>
        ) : null}
        {event.description ? <p style={{ margin: 0 }}>{event.description}</p> : null}
        {past && event.results ? (
          <div className="mt-md">
            <span className="label" style={{ color: 'var(--c-accent-text)' }}>Results</span>
            <RichText data={event.results} />
          </div>
        ) : null}
        {past ? (
          <p style={{ margin: '8px 0 0' }}>
            <Link href={`/gallery?event=${event.id}`} className="text-link">Photos &amp; videos</Link>
          </p>
        ) : null}
      </div>
    </article>
  )
}

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()])
  const upcomingIds = new Set(upcoming.map((e) => e.id))
  const pastOnly = past.filter((e) => !upcomingIds.has(e.id))

  return (
    <>
      <PageHead index={1} eyebrow="Schedule" title="Events" />
      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="Upcoming" title="Come watch" />
          {upcoming.length ? (
            <div className="event-list">
              {upcoming.map((e) => (
                <EventRow key={e.id} event={e} />
              ))}
            </div>
          ) : (
            <p className="empty-state">No upcoming events posted yet. Check back soon.</p>
          )}
        </div>
      </section>
      {pastOnly.length ? (
        <section className="section">
          <div className="container">
            <SectionHeader eyebrow="Past events" title="Results" />
            <div className="event-list">
              {pastOnly.map((e) => (
                <EventRow key={e.id} event={e} past />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
