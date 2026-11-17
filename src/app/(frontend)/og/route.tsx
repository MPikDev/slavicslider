/** Generated share image (1200×630) used when a page has no photo of its own: /og?title=Drivers */
import { ImageResponse } from 'next/og'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = (searchParams.get('title') || 'Slavic Sliders').slice(0, 60).toUpperCase()
  const showSubtitle = title !== 'SLAVIC SLIDERS'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0B0B0D',
          color: '#F2F0EB',
          padding: 72,
          borderBottom: '16px solid #1F63E0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ width: 44, height: 8, background: '#F2F0EB' }} />
            <div style={{ width: 56, height: 8, background: '#1F63E0' }} />
            <div style={{ width: 44, height: 8, background: '#F2F0EB' }} />
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: 2 }}>SLAVIC SLIDERS</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 28, color: '#7AAEFF', letterSpacing: 4, fontWeight: 700 }}>
            {showSubtitle ? 'DRIFT TEAM' : ''}
          </div>
          <div style={{ fontSize: 112, fontWeight: 800, lineHeight: 1, letterSpacing: -1 }}>{title}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { 'Cache-Control': 'public, max-age=86400' } },
  )
}
