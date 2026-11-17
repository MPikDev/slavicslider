/**
 * Outbound link redirect: /go/part-12 or /go/sponsor-3
 * Logs the click (for the Link Clicks report), then sends the visitor on to the store/sponsor site.
 */
import { NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|whatsapp|discord|telegram|headless/i

const redirect = (location: string, status = 302) =>
  new Response(null, {
    status,
    headers: { Location: location, 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' },
  })

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const match = /^(part|sponsor)-(\d+)$/.exec(id)
  if (!match) return redirect('/')
  const [, kind, docId] = match

  const payload = await getPayloadClient()
  let url: string | null | undefined
  let label = ''

  try {
    if (kind === 'part') {
      const part = (await payload.findByID({ collection: 'parts', id: Number(docId), depth: 0 })) as Record<string, any>
      url = part?.affiliateUrl
      label = part?.brand ? `${part.brand} ${part.name}` : part?.name
    } else {
      const sponsor = (await payload.findByID({ collection: 'sponsors', id: Number(docId), depth: 0 })) as Record<string, any>
      url = sponsor?.website
      label = sponsor?.name
    }
  } catch {
    return redirect('/')
  }

  url = url?.trim()
  if (!url || !/^https?:\/\//i.test(url)) return redirect('/')

  // Log the click (skip obvious bots and link-preview crawlers)
  const ua = req.headers.get('user-agent') || ''
  if (!BOT.test(ua)) {
    let page = ''
    try {
      const ref = req.headers.get('referer')
      if (ref) page = new URL(ref).pathname
    } catch {
      /* ignore bad referer */
    }
    try {
      await payload.create({
        collection: 'link-clicks',
        data: {
          kind: kind === 'part' ? 'affiliate' : 'sponsor',
          targetId: `${kind}-${docId}`,
          label,
          url,
          page,
        },
        overrideAccess: true,
      })
    } catch (err) {
      payload.logger.error({ err }, 'Could not log link click')
    }
  }

  return redirect(url)
}
