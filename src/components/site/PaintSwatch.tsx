import type { PaintDoc } from '@/lib/types'

/** CSS background for a paint: flat color, or a gradient for color-shift / wraps. */
export const paintBackground = (paint?: PaintDoc | null): string | undefined => {
  const colors = (paint?.colors || []).map((c) => c?.color).filter((c): c is string => Boolean(c))
  if (!colors.length) return undefined
  if (colors.length === 1 || paint?.type === 'solid') return colors[0]
  return `linear-gradient(135deg, ${colors.join(', ')})`
}

export function PaintSwatch({ paint, large }: { paint?: PaintDoc | null; large?: boolean }) {
  const bg = paintBackground(paint)
  if (!bg) return null
  return <span className={`swatch${large ? ' swatch-lg' : ''}`} style={{ background: bg }} aria-hidden="true" />
}
