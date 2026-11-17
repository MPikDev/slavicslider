'use client'
import Image from 'next/image'
import { useState } from 'react'
import type { MediaDoc } from '@/lib/types'
import { Lightbox } from './Lightbox'

/** Big car photo + thumbnail strip; tapping the big photo opens the lightbox. */
export function CarGallery({ images, carName }: { images: MediaDoc[]; carName: string }) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const current = images[active]

  if (!current?.url) {
    return (
      <div className="car-hero car-hero-empty stripes">
        <span className="label">Photo coming soon</span>
      </div>
    )
  }

  return (
    <div>
      <button type="button" className="car-hero" onClick={() => setLightbox(active)} aria-label={`Open photo viewer: ${current.alt || carName}`}>
        <Image
          src={current.url}
          alt={current.alt || carName}
          fill
          priority
          sizes="(min-width: 1000px) 60vw, 100vw"
          style={{ objectFit: 'cover', objectPosition: current.focalX != null ? `${current.focalX}% ${current.focalY}%` : undefined }}
        />
      </button>
      {images.length > 1 ? (
        <div className="thumbs" role="list" aria-label="More photos">
          {images.map((img, i) =>
            img.url ? (
              <button
                key={`${img.id}-${i}`}
                type="button"
                role="listitem"
                className="thumb"
                aria-current={i === active ? 'true' : undefined}
                aria-label={`Show photo ${i + 1}: ${img.alt || carName}`}
                onClick={() => setActive(i)}
              >
                <Image src={img.sizes?.thumbnail?.url || img.url} alt="" width={96} height={72} sizes="96px" />
              </button>
            ) : null,
          )}
        </div>
      ) : null}
      <Lightbox images={images} index={lightbox} onIndexChange={(i) => { setLightbox(i); if (i !== null) setActive(i) }} />
    </div>
  )
}
