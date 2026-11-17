import Link from 'next/link'
import type { Metadata } from 'next'
import { getDrivers, getEventsList, getGalleryItems, getTracks, parseId } from '@/lib/queries'
import { pageMeta } from '@/lib/metadata'
import { formatDate } from '@/lib/site'
import { PageHead } from '@/components/site/SectionHeader'
import { MediaGrid } from '@/components/site/MediaGrid'
import { AutoSubmitSelect } from '@/components/site/AutoSubmitSelect'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMeta({
  title: 'Gallery',
  path: '/gallery',
  description: 'Photos and videos of Slavic Sliders drifting, filterable by track, driver and event.',
})

type Props = { searchParams: Promise<{ track?: string; driver?: string; event?: string; type?: string }> }

export default async function GalleryPage({ searchParams }: Props) {
  const sp = await searchParams
  const type: 'photo' | 'video' | null = sp.type === 'photo' || sp.type === 'video' ? sp.type : null
  const filter = { track: parseId(sp.track), driver: parseId(sp.driver), event: parseId(sp.event), type }

  const [items, tracks, drivers, events] = await Promise.all([
    getGalleryItems(filter),
    getTracks(),
    getDrivers(),
    getEventsList(),
  ])
  const filtered = Boolean(filter.track || filter.driver || filter.event || filter.type)

  return (
    <>
      <PageHead index={1} eyebrow="Photos & video" title="Gallery" />
      <section className="container">
        <form method="get" action="/gallery" className="filter-bar" role="search" aria-label="Filter the gallery">
          <div>
            <label htmlFor="f-type" className="label muted">Show</label>
            <AutoSubmitSelect id="f-type" name="type" defaultValue={type || ''}>
              <option value="">Photos &amp; videos</option>
              <option value="photo">Photos only</option>
              <option value="video">Videos only</option>
            </AutoSubmitSelect>
          </div>
          <div>
            <label htmlFor="f-track" className="label muted">Track</label>
            <AutoSubmitSelect id="f-track" name="track" defaultValue={filter.track ? String(filter.track) : ''}>
              <option value="">All tracks</option>
              {tracks.map((t) => (
                <option key={t.id} value={String(t.id)}>{t.name}</option>
              ))}
            </AutoSubmitSelect>
          </div>
          <div>
            <label htmlFor="f-driver" className="label muted">Driver</label>
            <AutoSubmitSelect id="f-driver" name="driver" defaultValue={filter.driver ? String(filter.driver) : ''}>
              <option value="">All drivers</option>
              {drivers.map((d) => (
                <option key={d.id} value={String(d.id)}>{d.name}</option>
              ))}
            </AutoSubmitSelect>
          </div>
          <div>
            <label htmlFor="f-event" className="label muted">Event</label>
            <AutoSubmitSelect id="f-event" name="event" defaultValue={filter.event ? String(filter.event) : ''}>
              <option value="">All events</option>
              {events.map((e) => (
                <option key={e.id} value={String(e.id)}>
                  {e.name} ({formatDate(e.date, { day: undefined })})
                </option>
              ))}
            </AutoSubmitSelect>
          </div>
          <div className="filter-actions">
            <button type="submit" className="btn btn-primary btn-sm">Filter</button>
            {filtered ? (
              <Link href="/gallery" className="text-link" style={{ minHeight: 44 }}>Clear</Link>
            ) : null}
          </div>
        </form>
        <p className="caption" aria-live="polite">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </p>
        <MediaGrid items={items} columns4 />
      </section>
    </>
  )
}
