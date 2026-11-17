'use client'
import Image from 'next/image'
import { useCallback, useEffect, useRef } from 'react'
import type { MediaDoc } from '@/lib/types'

type Props = {
  images: MediaDoc[]
  index: number | null
  onIndexChange: (i: number | null) => void
}

/** Full-screen photo viewer using the native <dialog> element (Esc closes, focus is trapped). */
export function Lightbox({ images, index, onIndexChange }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const open = index !== null && images[index]

  useEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    if (open && !dlg.open) dlg.showModal()
    if (!open && dlg.open) dlg.close()
  }, [open])

  const go = useCallback(
    (delta: number) => {
      if (index === null || !images.length) return
      onIndexChange((index + delta + images.length) % images.length)
    },
    [index, images.length, onIndexChange],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go])

  const img = index !== null ? images[index] : null

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label="Photo viewer"
      onClose={() => onIndexChange(null)}
      onClick={(e) => {
        if (e.target === e.currentTarget) onIndexChange(null)
      }}
    >
      {img?.url ? (
        <div className="lightbox-inner">
          <button type="button" className="lightbox-btn lightbox-close" onClick={() => onIndexChange(null)} autoFocus>
            Close
          </button>
          <div className="lightbox-stage">
            <Image
              src={img.url}
              alt={img.alt || ''}
              fill
              sizes="100vw"
              unoptimized={img.mimeType === 'image/svg+xml'}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="lightbox-bar">
            <button type="button" className="lightbox-btn" onClick={() => go(-1)} disabled={images.length < 2} aria-label="Previous photo">
              ←
            </button>
            <span className="caption" aria-live="polite">
              {img.caption || img.alt} · {(index ?? 0) + 1} / {images.length}
            </span>
            <button type="button" className="lightbox-btn" onClick={() => go(1)} disabled={images.length < 2} aria-label="Next photo">
              →
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  )
}
