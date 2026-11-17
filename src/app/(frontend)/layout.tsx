import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Barlow, Barlow_Condensed, Russo_One } from 'next/font/google'

import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { getSettings } from '@/lib/payload'
import { pageMeta } from '@/lib/metadata'
import { siteUrl } from '@/lib/site'
import './styles.css'

// Content comes from the CMS, so always render fresh (edits show up immediately).
export const dynamic = 'force-dynamic'

const russo = Russo_One({ subsets: ['latin'], weight: '400', variable: '--font-russo', display: 'swap' })
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})
const barlow = Barlow({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-barlow', display: 'swap' })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const base = pageMeta({
    path: '/',
    description: settings.siteDescription || settings.tagline,
    image: settings.shareImage,
  })
  // Pages set their own canonical URL; don't let every page inherit "/"
  const { alternates: _alternates, ...rest } = base
  return {
    ...rest,
    metadataBase: new URL(siteUrl()),
    title: { default: 'Slavic Sliders', template: '%s | Slavic Sliders' },
    applicationName: 'Slavic Sliders',
  }
}

export const viewport: Viewport = {
  themeColor: '#0B0B0D',
  colorScheme: 'dark',
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings()
  return (
    <html lang="en" className={`${russo.variable} ${barlowCondensed.variable} ${barlow.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header settings={settings} />
        <main id="main">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
