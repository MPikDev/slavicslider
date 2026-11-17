import Image from 'next/image'
import type { MediaDoc, Rel } from '@/lib/types'
import { populated } from '@/lib/types'

type Props = {
  media?: Rel<MediaDoc>
  alt?: string
  /** Responsive sizes hint, e.g. "(min-width: 1080px) 25vw, 50vw" */
  sizes?: string
  priority?: boolean
  /** fill = cover the (position: relative) parent. Otherwise render at natural aspect ratio. */
  fill?: boolean
  className?: string
}

/** Optimized image for an uploaded Photo. Renders nothing if there's no photo. */
export function Img({ media, alt, sizes = '100vw', priority, fill = true, className }: Props) {
  const m = populated(media)
  if (!m?.url) return null
  const unoptimized = m.mimeType === 'image/svg+xml'
  const altText = alt ?? m.alt ?? ''
  const objectPosition =
    typeof m.focalX === 'number' && typeof m.focalY === 'number' ? `${m.focalX}% ${m.focalY}%` : undefined

  if (fill) {
    return (
      <Image
        src={m.url}
        alt={altText}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        className={className}
        style={{ objectFit: 'cover', objectPosition }}
      />
    )
  }

  return (
    <Image
      src={m.url}
      alt={altText}
      width={m.width || 1200}
      height={m.height || 800}
      sizes={sizes}
      priority={priority}
      unoptimized={unoptimized}
      className={className}
    />
  )
}
