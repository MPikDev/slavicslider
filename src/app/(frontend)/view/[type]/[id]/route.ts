/**
 * "Preview" button target for Cars, Parts and Build Log posts in the admin.
 * Finds the driver page that shows the item and redirects there.
 */
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

const go = (location: string) => new Response(null, { status: 302, headers: { Location: location, 'Cache-Control': 'no-store' } })

export async function GET(_req: Request, { params }: { params: Promise<{ type: string; id: string }> }) {
  const { type, id } = await params
  if (!/^\d+$/.test(id)) return go('/drivers')
  const payload = await getPayloadClient()

  try {
    let carId: number | string | undefined
    let hash = ''
    if (type === 'car') {
      carId = Number(id)
    } else if (type === 'part' || type === 'build-log') {
      const doc = (await payload.findByID({
        collection: type === 'part' ? 'parts' : 'build-log-posts',
        id: Number(id),
        depth: 0,
      })) as Record<string, any>
      carId = typeof doc.car === 'object' ? doc.car?.id : doc.car
      hash = type === 'part' ? '#parts' : '#build-log'
    }
    if (!carId) return go('/drivers')

    const car = (await payload.findByID({ collection: 'cars', id: carId, depth: 1 })) as Record<string, any>
    const slug = car?.driver?.slug
    return go(slug ? `/drivers/${slug}?car=${car.id}${hash}` : '/drivers')
  } catch {
    return go('/drivers')
  }
}
