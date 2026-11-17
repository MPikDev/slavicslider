import Link from 'next/link'
import type { SiteSettingsDoc } from '@/lib/types'
import { AFFILIATE_SOURCES } from '@/lib/affiliates'
import { Brand } from './Wordmark'
import { SocialList } from './SocialLinks'

export function Footer({ settings }: { settings: SiteSettingsDoc }) {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-stripe" aria-hidden="true" />
        <div className="footer-grid">
          <div className="stack-sm">
            <Brand settings={settings} />
            {settings.tagline ? <p className="muted">{settings.tagline}</p> : null}
            {settings.city ? <p className="caption">{settings.city}</p> : null}
            {settings.contactEmail ? (
              <p>
                <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
              </p>
            ) : null}
          </div>
          <div>
            <h2>Explore</h2>
            <ul className="footer-links">
              <li><Link href="/drivers">Drivers</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/tracks">Tracks</Link></li>
              <li><Link href="/events">Events</Link></li>
              <li><Link href="/sponsors">Sponsors</Link></li>
              <li><Link href="/become-a-sponsor">Become a sponsor</Link></li>
              {settings.showMerch ? <li><Link href="/merch">Merch</Link></li> : null}
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h2>Follow</h2>
            <SocialList links={settings} who="Slavic Sliders" />
          </div>
        </div>
        <div className="footer-bottom caption">
          <span>© {year} Slavic Sliders</span>
          <span>{AFFILIATE_SOURCES.amazon.disclosure}</span>
        </div>
      </div>
    </footer>
  )
}
