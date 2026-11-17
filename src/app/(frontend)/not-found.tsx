import Link from 'next/link'
import { SectionHeader } from '@/components/site/SectionHeader'

export default function NotFound() {
  return (
    <section className="section">
      <div className="container coming-soon">
        <SectionHeader eyebrow="404" title="Spun out" as="h1" />
        <p className="muted">That page doesn’t exist (or it got moved).</p>
        <div className="btn-row">
          <Link href="/" className="btn btn-primary">Back to home</Link>
          <Link href="/drivers" className="btn btn-secondary">Meet the drivers</Link>
        </div>
      </div>
    </section>
  )
}
