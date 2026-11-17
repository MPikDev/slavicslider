import Link from 'next/link'
import { Img } from './Img'
import type { SiteSettingsDoc } from '@/lib/types'
import { populated } from '@/lib/types'

export function StripeMark() {
  return (
    <span className="mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  )
}

/** Header/footer logo: uploaded logo from Site Settings, or the built-in wordmark. */
export function Brand({ settings }: { settings: SiteSettingsDoc }) {
  const logo = populated(settings.logo)
  return (
    <Link href="/" className="brand" aria-label="Slavic Sliders, home">
      {logo?.url ? (
        <Img media={logo} fill={false} alt="" sizes="200px" className="brand-logo" priority />
      ) : (
        <>
          <StripeMark />
          <span className="wordmark-text">SLAVIC SLIDERS</span>
        </>
      )}
    </Link>
  )
}
