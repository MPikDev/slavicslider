'use client'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import type { MediaDoc } from '@/lib/types'
import { getInstagramEmbed, getYouTubeId, youTubeEmbed, youTubeThumb } from '@/lib/video'
import { Lightbox } from './Lightbox'

export type GridItem =
  | { kind: 'photo'; key: string; media: MediaDoc }
  | { kind: 'video'; key: string; title: string; url: string }

/** A video that only loads the YouTube/Instagram player after it's clicked (keeps pages fast). */
export function VideoTile({ title, url, wide }: { title: string; url: string; wide?: boolean }) {
  const [playing, setPlaying] = useState(false)
  const ytId = getYouTubeId(url)
  const igEmbed = ytId ? null : getInstagramEmbed(url)
  const src = ytId ? youTubeEmbed(ytId, { autoplay: true }) : igEmbed
  const cls = `media-tile${wide ? ' media-tile-wide' : ''}`

  if (playing && src) {
    return (
      <div className={cls} style={{ cursor: 'default', aspectRatio: igEmbed ? '4 / 5' : undefined }}>
        <div className="video-frame">
          <iframe
            src={src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    )
  }

  if (!src) {
    return (
      <a className={cls} href={url} target="_blank" rel="noopener noreferrer">
        <span className="tile-label">{title} (opens in a new tab)</span>
      </a>
    )
  }

  return (
    <button type="button" className={cls} onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`}>
      {ytId ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={youTubeThumb(ytId)} alt="" loading="lazy" />
      ) : null}
      <span className="platform-tag">{ytId ? 'YouTube' : 'Instagram'}</span>
      <span className="play-badge" aria-hidden="true" />
      <span className="tile-label">{title}</span>
    </button>
  )
}

/** Mixed grid of photos (open in a lightbox) and videos (play in place). */
export function MediaGrid({ items, columns4 }: { items: GridItem[]; columns4?: boolean }) {
  const photos = useMemo(
    () => items.filter((i): i is Extract<GridItem, { kind: 'photo' }> => i.kind === 'photo').map((i) => i.media),
    [items],
  )
  const [open, setOpen] = useState<number | null>(null)

  if (!items.length) return <p className="empty-state">No photos or videos yet.</p>

  let photoIndex = -1
  return (
    <>
      <div className={`media-grid${columns4 ? ' media-grid-4' : ''}`}>
        {items.map((item) => {
          if (item.kind === 'video') return <VideoTile key={item.key} title={item.title} url={item.url} />
          photoIndex += 1
          const idx = photoIndex
          const m = item.media
          if (!m.url) return null
          return (
            <button
              key={item.key}
              type="button"
              className="media-tile"
              onClick={() => setOpen(idx)}
              aria-label={`Open photo: ${m.alt || 'photo'}`}
            >
              <Image
                src={m.sizes?.card?.url || m.url}
                alt={m.alt || ''}
                fill
                sizes="(min-width: 1080px) 25vw, (min-width: 768px) 33vw, 50vw"
                unoptimized={m.mimeType === 'image/svg+xml'}
                style={{ objectFit: 'cover', objectPosition: m.focalX != null ? `${m.focalX}% ${m.focalY}%` : undefined }}
              />
              {m.caption ? <span className="tile-label">{m.caption}</span> : null}
            </button>
          )
        })}
      </div>
      <Lightbox images={photos} index={open} onIndexChange={setOpen} />
    </>
  )
}
