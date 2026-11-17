'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export type NavItem = { href: string; label: string }

const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname() || '/'
  const [open, setOpen] = useState(false)

  // Close the mobile menu after navigating
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const current = (href: string) => (isActive(pathname, href) ? 'page' : undefined)

  return (
    <>
      <nav className="nav" aria-label="Main">
        {items.map((item) => (
          <Link key={item.href} href={item.href} aria-current={current(item.href)}>
            {item.label}
          </Link>
        ))}
        <Link href="/become-a-sponsor" className="btn btn-primary btn-sm" aria-current={current('/become-a-sponsor')}>
          Become a sponsor
        </Link>
      </nav>

      <button
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="menu-toggle-bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        {open ? 'Close' : 'Menu'}
      </button>

      <div id="mobile-menu" className="mobile-panel" hidden={!open} style={{ position: 'absolute', left: 0, right: 0, top: '100%' }}>
        <nav aria-label="Main (mobile)">
          <ul>
            {[{ href: '/', label: 'Home' }, ...items].map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={current(item.href)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/become-a-sponsor" className="btn btn-primary">
            Become a sponsor
          </Link>
        </nav>
      </div>
    </>
  )
}
