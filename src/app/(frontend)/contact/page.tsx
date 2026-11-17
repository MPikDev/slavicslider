import type { Metadata } from 'next'
import { getSettings } from '@/lib/payload'
import { pageMeta } from '@/lib/metadata'
import { PageHead } from '@/components/site/SectionHeader'
import { InquiryForm } from '@/components/site/InquiryForm'
import { SocialLinks } from '@/components/site/SocialLinks'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMeta({
  title: 'Contact',
  path: '/contact',
  description: 'Get in touch with the Slavic Sliders drift team.',
})

export default async function ContactPage() {
  const settings = await getSettings()
  return (
    <>
      <PageHead index={1} eyebrow="Say hi" title="Contact" />
      <section className="section">
        <div className="container split split-wide-left">
          <div>
            <InquiryForm type="contact" renderedAt={Date.now()} />
          </div>
          <aside className="panel stack">
            <h2 style={{ fontSize: 26 }}>Find us</h2>
            {settings.city ? <p className="muted" style={{ margin: 0 }}>{settings.city}</p> : null}
            {settings.contactEmail ? (
              <p style={{ margin: 0 }}>
                <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
              </p>
            ) : null}
            <SocialLinks links={settings} who="Slavic Sliders" />
          </aside>
        </div>
      </section>
    </>
  )
}
