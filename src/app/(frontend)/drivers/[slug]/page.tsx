import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getBuildLog, getCarsForDriver, getDriverBySlug, getPartsForCar, parseId } from '@/lib/queries'
import { pageMeta } from '@/lib/metadata'
import type { CarDoc, MediaDoc, PartDoc } from '@/lib/types'
import { populated } from '@/lib/types'
import { formatDate, goHref, OUTBOUND_REL, PART_CATEGORY_LABELS } from '@/lib/site'
import { getAffiliate } from '@/lib/affiliates'
import { Img } from '@/components/site/Img'
import { PaintSwatch } from '@/components/site/PaintSwatch'
import { CarGallery } from '@/components/site/CarGallery'
import { carName } from '@/components/site/DriverCard'
import { SocialLinks } from '@/components/site/SocialLinks'
import { SectionHeader } from '@/components/site/SectionHeader'
import { RichText } from '@/components/site/RichText'
import { MediaGrid } from '@/components/site/MediaGrid'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ car?: string; tab?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const driver = await getDriverBySlug(slug)
  if (!driver) return { title: 'Driver not found' }
  const cars = await getCarsForDriver(driver.id)
  const current = cars.find((c) => c.status !== 'past')
  const title = `${driver.carNumber ? `#${driver.carNumber} ` : ''}${driver.name}`
  return pageMeta({
    title,
    path: `/drivers/${slug}`,
    description: driver.bio?.slice(0, 160) || (current ? `${driver.name} drives a ${carName(current)}.` : undefined),
    image: current?.coverPhoto || driver.photo,
  })
}

const PAINT_TYPE: Record<string, string> = { solid: 'Solid', colorShift: 'Color-shift', wrap: 'Wrap' }

export default async function DriverPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { car: carParam, tab } = await searchParams
  const driver = await getDriverBySlug(slug)
  if (!driver) notFound()

  const cars = await getCarsForDriver(driver.id)
  const currentCars = cars.filter((c) => c.status !== 'past')
  const pastCars = cars.filter((c) => c.status === 'past')

  const requestedId = parseId(carParam)
  const requested = requestedId ? cars.find((c) => Number(c.id) === requestedId) : undefined
  const showPastGrid = tab === 'past' && !requested
  const selected: CarDoc | undefined = requested || (showPastGrid ? undefined : currentCars[0] || pastCars[0])
  const activeTab = showPastGrid || selected?.status === 'past' ? 'past' : 'current'

  const [parts, buildLog] = selected ? await Promise.all([getPartsForCar(selected.id), getBuildLog(selected.id)]) : [[], []]
  const photo = populated(driver.photo)
  const base = `/drivers/${driver.slug}`

  return (
    <>
      {/* Driver header */}
      <section className="container driver-hero">
        {driver.carNumber ? (
          <div className="driver-number-big" aria-hidden="true">
            {driver.carNumber}
          </div>
        ) : null}
        {photo?.url ? (
          <div className="driver-hero-photo">
            <Img media={photo} sizes="280px" priority />
          </div>
        ) : null}
        <div>
          <span className="eyebrow">
            <Link href="/drivers">Drivers</Link> / {driver.carNumber ? `Car ${driver.carNumber}` : 'Driver'}
          </span>
          <h1>{driver.name}</h1>
          {driver.nickname ? <p className="label" style={{ color: 'var(--c-accent-text)', fontSize: 18 }}>“{driver.nickname}”</p> : null}
          <div className="driver-facts label">
            {driver.yearsDrifting ? <span>{driver.yearsDrifting} years drifting</span> : null}
            {currentCars[0] ? <span>{carName(currentCars[0])}</span> : null}
          </div>
          {driver.bio ? <p className="muted" style={{ maxWidth: 640 }}>{driver.bio}</p> : null}
          <SocialLinks links={driver} who={driver.name} />
        </div>
      </section>

      <div className="container">
        {/* Tabs */}
        <nav className="tabs" aria-label="Cars">
          <Link href={base} aria-current={activeTab === 'current' ? 'page' : undefined} scroll={false}>
            Current car{currentCars.length > 1 ? 's' : ''}
          </Link>
          <Link href={`${base}?tab=past`} aria-current={activeTab === 'past' ? 'page' : undefined} scroll={false}>
            Past cars ({pastCars.length})
          </Link>
        </nav>

        {showPastGrid ? (
          <PastCarsGrid cars={pastCars} base={base} />
        ) : selected ? (
          <>
            {activeTab === 'current' && currentCars.length > 1 ? (
              <div className="car-switcher" aria-label="Choose a car">
                {currentCars.map((c) => (
                  <Link key={c.id} href={`${base}?car=${c.id}`} aria-current={c.id === selected.id ? 'true' : undefined} scroll={false}>
                    <PaintSwatch paint={c.paint} />
                    {carName(c)}
                  </Link>
                ))}
              </div>
            ) : null}
            {activeTab === 'past' ? (
              <p style={{ marginTop: -12, marginBottom: 24 }}>
                <Link href={`${base}?tab=past`} className="text-link">
                  Back to past cars
                </Link>
              </p>
            ) : null}
            <CarDetail car={selected} parts={parts} />
            {buildLog.length ? (
              <section className="section" id="build-log" aria-labelledby="build-log-title">
                <SectionHeader eyebrow="Build log" title="The build" id="build-log-title" />
                <ol className="timeline">
                  {buildLog.map((post) => {
                    const photos = (post.photos || []).map((p) => populated(p)).filter((p): p is MediaDoc => Boolean(p?.url))
                    return (
                      <li key={post.id}>
                        <time className="label muted" dateTime={post.date || undefined}>
                          {formatDate(post.date)}
                        </time>
                        <h3>{post.title}</h3>
                        <RichText data={post.content} />
                        {photos.length ? (
                          <div className="timeline-photos">
                            <MediaGrid items={photos.map((m) => ({ kind: 'photo', key: `bl-${post.id}-${m.id}`, media: m }))} />
                          </div>
                        ) : null}
                      </li>
                    )
                  })}
                </ol>
              </section>
            ) : null}
          </>
        ) : (
          <p className="empty-state">No cars added yet.</p>
        )}

        {/* Past cars teaser under the current car */}
        {!showPastGrid && activeTab === 'current' && pastCars.length ? (
          <section className="section" aria-labelledby="past-title">
            <SectionHeader eyebrow="Garage history" title="Past cars" id="past-title" />
            <PastCarsGrid cars={pastCars} base={base} />
          </section>
        ) : null}
      </div>
    </>
  )
}

function PastCarsGrid({ cars, base }: { cars: CarDoc[]; base: string }) {
  if (!cars.length) return <p className="empty-state">No past cars yet.</p>
  return (
    <div className="past-grid">
      {cars.map((c) => (
        <Link key={c.id} href={`${base}?car=${c.id}`} className="driver-card past-card">
          <div className="driver-card-media">
            <Img media={c.coverPhoto} sizes="(min-width: 1000px) 33vw, (min-width: 600px) 50vw, 100vw" />
          </div>
          <div className="driver-card-body">
            <h3 className="driver-card-name" style={{ fontSize: 20 }}>{carName(c)}</h3>
            <span className="car-line">
              <PaintSwatch paint={c.paint} />
              {c.paint?.name || ''}
              {c.yearsOwned ? ` · ${c.yearsOwned}` : ''}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

function CarDetail({ car, parts }: { car: CarDoc; parts: PartDoc[] }) {
  const images = [car.coverPhoto, ...(car.gallery || [])]
    .map((m) => populated(m))
    .filter((m): m is MediaDoc => Boolean(m?.url))
  const name = carName(car)
  const specs = [
    ['Engine', car.specs?.engine],
    ['Power', car.specs?.power],
    ['Transmission', car.specs?.transmission],
    ['Years owned', car.yearsOwned],
  ].filter(([, v]) => Boolean(v)) as Array<[string, string]>

  // Group parts by category, in the category order used in the admin
  const groups = Object.keys(PART_CATEGORY_LABELS)
    .map((key) => ({ key, label: PART_CATEGORY_LABELS[key], parts: parts.filter((p) => (p.category || 'other') === key) }))
    .filter((g) => g.parts.length)
  const affiliateSources = [...new Set(parts.filter((p) => p.affiliateUrl).map((p) => p.affiliateSource || 'amazon'))]

  return (
    <div className="car-detail">
      <div>
        <CarGallery images={images} carName={name} />
      </div>
      <div>
        <span className="eyebrow">{car.status === 'past' ? 'Past car' : 'Current car'}</span>
        <h2 className="car-title">
          {name}
        </h2>
        {car.paint?.name || car.paint?.colors?.length ? (
          <p className="paint-line">
            <PaintSwatch paint={car.paint} large />
            <span>
              {car.paint?.name}
              {car.paint?.type ? <span className="caption"> · {PAINT_TYPE[car.paint.type] || ''}</span> : null}
            </span>
          </p>
        ) : null}
        {car.description ? <p className="muted">{car.description}</p> : null}
        {specs.length ? (
          <dl className="specs-grid">
            {specs.map(([label, value]) => (
              <div className="spec" key={label}>
                <dt className="label">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {groups.length ? (
        <section id="parts" aria-labelledby="parts-title" style={{ gridColumn: '1 / -1' }}>
          <SectionHeader eyebrow="What’s on it" title="Parts list" id="parts-title" />
          {affiliateSources.length ? (
            <p className="disclosure">{affiliateSources.map((s) => getAffiliate(s).disclosure).join(' ')}</p>
          ) : null}
          <div className="split">
            {[groups.filter((_, i) => i % 2 === 0), groups.filter((_, i) => i % 2 === 1)].map((col, ci) => (
              <div key={ci}>
                {col.map((g) => (
                  <div className="parts-group" key={g.key}>
                    <h3>{g.label}</h3>
                    <ul className="parts-list">
                      {g.parts.map((p) => (
                        <li className="part" key={p.id}>
                          <div>
                            <div className="part-name">{p.name}</div>
                            {p.brand || p.notes ? (
                              <div className="part-meta">{[p.brand, p.notes].filter(Boolean).join(' · ')}</div>
                            ) : null}
                          </div>
                          {p.affiliateUrl ? (
                            <a
                              href={goHref('part', p.id)}
                              className="btn btn-primary btn-sm"
                              target="_blank"
                              rel={OUTBOUND_REL}
                              aria-label={`${getAffiliate(p.affiliateSource).button}: ${p.name} (opens in a new tab)`}
                            >
                              {getAffiliate(p.affiliateSource).button}
                            </a>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
