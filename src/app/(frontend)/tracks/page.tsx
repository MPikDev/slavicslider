import Link from 'next/link'
import type { Metadata } from 'next'
import { getGalleryItems, getTracks } from '@/lib/queries'
import { pageMeta } from '@/lib/metadata'
import { pad2 } from '@/lib/site'
import { PageHead } from '@/components/site/SectionHeader'
import { Img } from '@/components/site/Img'
import { MediaGrid } from '@/components/site/MediaGrid'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMeta({
  title: 'Tracks',
  path: '/tracks',
  description: 'Every track Slavic Sliders has drifted at, with photos and videos from each.',
})

export default async function TracksPage() {
  const tracks = await getTracks()
  const media = await Promise.all(tracks.map((t) => getGalleryItems({ track: Number(t.id), limit: 8 })))

  return (
    <>
      <PageHead index={1} eyebrow="Where we slide" title="Tracks" />
      <div className="container">
        {tracks.length ? (
          tracks.map((t, i) => (
            <section key={t.id} id={t.slug || undefined} className="track-block" aria-labelledby={`track-${t.id}`}>
              <div className="track-block-head">
                <div>
                  <span className="eyebrow">{pad2(i + 1)} / {t.location || 'Track'}</span>
                  <h2 className="section-title" id={`track-${t.id}`}>{t.name}</h2>
                  {t.description ? <p className="muted mt-md">{t.description}</p> : null}
                  {media[i].length ? (
                    <Link href={`/gallery?track=${t.id}`} className="text-link">
                      All photos &amp; videos from here
                    </Link>
                  ) : null}
                </div>
                <div className="track-photo">
                  <Img media={t.photo} sizes="(min-width: 900px) 50vw, 100vw" />
                </div>
              </div>
              {media[i].length ? <MediaGrid items={media[i]} columns4 /> : null}
            </section>
          ))
        ) : (
          <p className="empty-state mt-lg">Tracks coming soon.</p>
        )}
      </div>
    </>
  )
}
