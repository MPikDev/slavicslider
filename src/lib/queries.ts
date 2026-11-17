import type { Where } from 'payload'
import { getPayloadClient } from './payload'
import type { BuildLogDoc, CarDoc, DriverDoc, EventDoc, ID, MediaDoc, PartDoc, SponsorDoc, TrackDoc, VideoDoc } from './types'
import type { GridItem } from '@/components/site/MediaGrid'

/** Turns "12" into 12 (Postgres IDs are numbers); returns null for anything else. */
export const parseId = (v?: string | string[] | null): number | null => {
  const s = Array.isArray(v) ? v[0] : v
  return s && /^\d+$/.test(s) ? Number(s) : null
}

const idOf = (rel: unknown): ID | null =>
  rel && typeof rel === 'object' ? ((rel as { id: ID }).id ?? null) : ((rel as ID) ?? null)

export async function getDrivers(): Promise<DriverDoc[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'drivers', sort: 'order', depth: 1, limit: 100 })
  return docs as unknown as DriverDoc[]
}

export async function getDriverBySlug(slug: string): Promise<DriverDoc | null> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'drivers', where: { slug: { equals: slug } }, depth: 1, limit: 1 })
  return (docs[0] as unknown as DriverDoc) ?? null
}

/** Map of driver ID → that driver's (first) current car. */
export async function getCurrentCarByDriver(): Promise<Map<string, CarDoc>> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'cars',
    where: { status: { equals: 'current' } },
    depth: 1,
    limit: 200,
    sort: 'createdAt',
  })
  const map = new Map<string, CarDoc>()
  for (const car of docs as unknown as CarDoc[]) {
    const key = String(idOf(car.driver))
    if (!map.has(key)) map.set(key, car)
  }
  return map
}

export async function getCarsForDriver(driverId: ID): Promise<CarDoc[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'cars',
    where: { driver: { equals: driverId } },
    depth: 1,
    limit: 100,
    sort: 'createdAt',
  })
  return docs as unknown as CarDoc[]
}

export async function getCar(id: ID): Promise<CarDoc | null> {
  const payload = await getPayloadClient()
  try {
    return (await payload.findByID({ collection: 'cars', id, depth: 1 })) as unknown as CarDoc
  } catch {
    return null
  }
}

export async function getPartsForCar(carId: ID): Promise<PartDoc[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'parts', where: { car: { equals: carId } }, depth: 0, limit: 500, sort: 'name' })
  return docs as unknown as PartDoc[]
}

export async function getBuildLog(carId: ID): Promise<BuildLogDoc[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'build-log-posts',
    where: { car: { equals: carId } },
    depth: 1,
    limit: 200,
    sort: '-date',
  })
  return docs as unknown as BuildLogDoc[]
}

export async function getSponsors(): Promise<SponsorDoc[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'sponsors', sort: 'order', depth: 1, limit: 200 })
  return docs as unknown as SponsorDoc[]
}

export async function getTracks(): Promise<TrackDoc[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'tracks', sort: 'name', depth: 1, limit: 200 })
  return docs as unknown as TrackDoc[]
}

const startOfTodayUTC = () => {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  return d.toISOString()
}

export async function getUpcomingEvents(limit = 50): Promise<EventDoc[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'events',
    where: { and: [{ status: { equals: 'upcoming' } }, { date: { greater_than_equal: startOfTodayUTC() } }] },
    sort: 'date',
    depth: 1,
    limit,
  })
  return docs as unknown as EventDoc[]
}

/** Events marked Past, or whose date has already gone by. */
export async function getPastEvents(limit = 100): Promise<EventDoc[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'events',
    where: { or: [{ status: { equals: 'past' } }, { date: { less_than: startOfTodayUTC() } }] },
    sort: '-date',
    depth: 1,
    limit,
  })
  return docs as unknown as EventDoc[]
}

export async function getEventsList(): Promise<EventDoc[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'events', sort: '-date', depth: 0, limit: 200 })
  return docs as unknown as EventDoc[]
}

export type GalleryFilter = {
  track?: number | null
  driver?: number | null
  event?: number | null
  type?: 'photo' | 'video' | null
  limit?: number
}

/** Photos + videos for the gallery (and other grids), newest first. */
export async function getGalleryItems(filter: GalleryFilter = {}): Promise<GridItem[]> {
  const payload = await getPayloadClient()
  const limit = filter.limit ?? 120

  const tagWhere: Where[] = []
  if (filter.track) tagWhere.push({ tracks: { in: [filter.track] } })
  if (filter.driver) tagWhere.push({ drivers: { in: [filter.driver] } })
  if (filter.event) tagWhere.push({ events: { in: [filter.event] } })
  const where: Where = {
    and: [{ or: [{ showInGallery: { equals: true } }, { showInGallery: { exists: false } }] }, ...tagWhere],
  }

  const [photos, videos] = await Promise.all([
    filter.type === 'video'
      ? Promise.resolve({ docs: [] as unknown[] })
      : payload.find({ collection: 'media', where, sort: '-createdAt', depth: 0, limit }),
    filter.type === 'photo'
      ? Promise.resolve({ docs: [] as unknown[] })
      : payload.find({ collection: 'videos', where, sort: '-date', depth: 0, limit }),
  ])

  const items: Array<GridItem & { at: string }> = [
    ...(photos.docs as MediaDoc[]).map((m) => ({
      kind: 'photo' as const,
      key: `p-${m.id}`,
      media: m,
      at: m.createdAt || '',
    })),
    ...(videos.docs as Array<VideoDoc & { createdAt?: string }>).map((v) => ({
      kind: 'video' as const,
      key: `v-${v.id}`,
      title: v.title,
      url: v.url,
      at: v.date || v.createdAt || '',
    })),
  ]

  return items
    .sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0))
    .slice(0, limit)
    .map(({ at: _at, ...rest }) => rest as GridItem)
}
