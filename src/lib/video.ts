export type VideoPlatform = 'youtube' | 'instagram' | 'other'

export const getYouTubeId = (url?: string | null): string | null => {
  if (!url) return null
  try {
    const u = new URL(url.trim())
    const host = u.hostname.replace(/^www\.|^m\./, '')
    if (host === 'youtu.be') return u.pathname.slice(1).split('/')[0] || null
    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const v = u.searchParams.get('v')
      if (v) return v
      const m = u.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{6,})/)
      if (m) return m[1]
    }
  } catch {
    /* not a URL */
  }
  return null
}

export const getInstagramEmbed = (url?: string | null): string | null => {
  if (!url) return null
  try {
    const u = new URL(url.trim())
    if (!u.hostname.replace(/^www\./, '').endsWith('instagram.com')) return null
    const m = u.pathname.match(/^\/(p|reel|reels|tv)\/([\w-]+)/)
    if (!m) return null
    const kind = m[1] === 'reels' ? 'reel' : m[1]
    return `https://www.instagram.com/${kind}/${m[2]}/embed`
  } catch {
    return null
  }
}

export const detectPlatform = (url?: string | null): VideoPlatform => {
  if (getYouTubeId(url)) return 'youtube'
  if (getInstagramEmbed(url)) return 'instagram'
  return 'other'
}

export const youTubeThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

export const youTubeEmbed = (id: string, opts: { autoplay?: boolean; background?: boolean } = {}) => {
  const p = new URLSearchParams({ rel: '0', modestbranding: '1', playsinline: '1' })
  if (opts.autoplay || opts.background) p.set('autoplay', '1')
  if (opts.background) {
    p.set('mute', '1')
    p.set('loop', '1')
    p.set('playlist', id)
    p.set('controls', '0')
    p.set('disablekb', '1')
  }
  return `https://www.youtube-nocookie.com/embed/${id}?${p.toString()}`
}
