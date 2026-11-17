import type { SiteSettingsDoc } from '@/lib/types'
import { Brand } from './Wordmark'
import { NavLinks, type NavItem } from './NavLinks'

export function Header({ settings }: { settings: SiteSettingsDoc }) {
  const items: NavItem[] = [
    { href: '/drivers', label: 'Drivers' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/tracks', label: 'Tracks' },
    { href: '/events', label: 'Events' },
    { href: '/sponsors', label: 'Sponsors' },
    ...(settings.showMerch ? [{ href: '/merch', label: 'Merch' }] : []),
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="site-header">
      <div className="container" style={{ position: 'relative' }}>
        <Brand settings={settings} />
        <NavLinks items={items} />
      </div>
    </header>
  )
}
