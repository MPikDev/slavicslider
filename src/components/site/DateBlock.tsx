import Link from 'next/link'
import type { EventDoc } from '@/lib/types'
import { populated } from '@/lib/types'
import { formatDate } from '@/lib/site'

export function DateBlock({ iso }: { iso: string }) {
  const d = new Date(iso)
  const month = d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
  const day = d.toLocaleDateString('en-US', { day: 'numeric', timeZone: 'UTC' })
  const year = d.toLocaleDateString('en-US', { year: 'numeric', timeZone: 'UTC' })
  return (
    <div className="date-block" aria-hidden="true">
      <span className="month">{month}</span>
      <span className="day">{day}</span>
      <span className="year">{year}</span>
    </div>
  )
}

/** "Next up" banner on the home page. */
export function EventBanner({ event }: { event: EventDoc }) {
  const track = populated(event.track)
  return (
    <div className="event-banner">
      <DateBlock iso={event.date} />
      <div className="event-banner-body">
        <span className="eyebrow" style={{ margin: 0 }}>
          Next up · <span className="visually-hidden">{formatDate(event.date)}</span>
        </span>
        <h3>{event.name}</h3>
        {track ? (
          <span className="muted">
            {track.name}
            {track.location ? ` · ${track.location}` : ''}
          </span>
        ) : null}
      </div>
      <Link href="/events" className="btn btn-primary">
        Event details
      </Link>
    </div>
  )
}
