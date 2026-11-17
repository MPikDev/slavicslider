import type { Metadata } from 'next'
import { getCurrentCarByDriver, getDrivers } from '@/lib/queries'
import { pageMeta } from '@/lib/metadata'
import { PageHead } from '@/components/site/SectionHeader'
import { DriverCard } from '@/components/site/DriverCard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMeta({
  title: 'Drivers',
  path: '/drivers',
  description: 'Meet the Slavic Sliders drift team: the drivers, their numbers and their cars.',
})

export default async function DriversPage() {
  const [drivers, carByDriver] = await Promise.all([getDrivers(), getCurrentCarByDriver()])
  return (
    <>
      <PageHead index={1} eyebrow="The team" title="Drivers" />
      <section className="section">
        <div className="container">
          {drivers.length ? (
            <div className="driver-grid">
              {drivers.map((d) => (
                <DriverCard key={d.id} driver={d} car={carByDriver.get(String(d.id))} />
              ))}
            </div>
          ) : (
            <p className="empty-state">Drivers coming soon.</p>
          )}
        </div>
      </section>
    </>
  )
}
