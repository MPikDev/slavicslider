/**
 * Seed the site with placeholder content.
 *   Local:   npm run seed
 *   Docker:  docker compose exec app npm run seed
 * Skips if drivers already exist. Pass --force to seed anyway (adds duplicates).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '../payload.config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(dirname, '../..')

const P = (s: string) => `[PLACEHOLDER] ${s}`

/** Minimal Lexical rich-text value containing one paragraph. */
const richText = (text: string) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
      },
    ],
  },
})

const seed = async () => {
  const payload = await getPayload({ config })
  const log = (msg: string) => payload.logger.info(`[seed] ${msg}`)

  const { totalDocs } = await payload.count({ collection: 'drivers', overrideAccess: true })
  if (totalDocs > 0 && !process.argv.includes('--force')) {
    log('Drivers already exist, so seeding was skipped. Run with --force to seed anyway.')
    return
  }

  // ── Sponsor: Fifth Wheel LLC ───────────────────────────────────────────────
  const logoPath = path.resolve(projectRoot, 'seed/fifth-wheel-logo.png')
  let logoId: number | string | undefined
  if (fs.existsSync(logoPath)) {
    const logo = await payload.create({
      collection: 'media',
      data: { alt: 'Fifth Wheel LLC logo', showInGallery: false },
      filePath: logoPath,
      overrideAccess: true,
    })
    logoId = logo.id
  } else {
    log(`Logo not found at ${logoPath}; creating the sponsor without a logo.`)
  }

  await payload.create({
    collection: 'sponsors',
    data: {
      name: 'Fifth Wheel LLC',
      logo: logoId,
      website: 'https://fifthwheelllc.com',
      tier: 'title',
      blurb: 'Car transportation',
      order: 1,
    },
    overrideAccess: true,
  })
  log('Sponsor: Fifth Wheel LLC')

  // ── Track + event ──────────────────────────────────────────────────────────
  const track = await payload.create({
    collection: 'tracks',
    data: {
      name: P('Track name'),
      location: P('City, ST'),
      description: P('A sentence or two about the track: layout, what makes it fun, best corner.'),
    },
    overrideAccess: true,
  })

  const inThirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  inThirtyDays.setUTCHours(12, 0, 0, 0)
  await payload.create({
    collection: 'events',
    data: {
      name: P('Event name'),
      date: inThirtyDays.toISOString(),
      status: 'upcoming',
      track: track.id,
      description: P('Event details: times, tickets, which drivers are entered.'),
    },
    overrideAccess: true,
  })
  log('Track + upcoming event')

  // ── Drivers + current cars ─────────────────────────────────────────────────
  const lineup = [
    {
      make: 'Ford',
      model: 'Mustang',
      generation: 'SN95 New Edge',
      paint: { name: 'Mystichrome wrap', type: 'wrap', colors: ['#1E8C7A', '#2B4FD6', '#6A2FB8', '#1A1030'] },
    },
    { make: 'Ford', model: 'Mustang', generation: 'SN95', paint: { name: 'Navy', type: 'solid', colors: ['#1B2A5C'] } },
    { make: 'Nissan', model: '350Z', generation: '', paint: { name: 'Blue', type: 'solid', colors: ['#2F6FDE'] } },
    { make: 'Nissan', model: '350Z', generation: '', paint: { name: 'White', type: 'solid', colors: ['#F2F0EB'] } },
  ] as const

  const carIds: Array<number | string> = []
  for (const [i, car] of lineup.entries()) {
    const n = i + 1
    const driver = await payload.create({
      collection: 'drivers',
      data: {
        name: `[Driver ${n} name]`,
        nickname: P('Nickname'),
        carNumber: '[##]',
        bio: P('Short bio: how they got into drifting, favorite track, day job.'),
        order: n,
      },
      overrideAccess: true,
    })

    const created = await payload.create({
      collection: 'cars',
      data: {
        driver: driver.id,
        status: 'current',
        make: car.make,
        model: car.model,
        generation: car.generation || undefined,
        yearsOwned: P('Years owned'),
        description: P('About this car: how it was found, what the build is going for.'),
        specs: { engine: P('Engine'), power: P('Power'), transmission: P('Transmission') },
        paint: { name: car.paint.name, type: car.paint.type, colors: car.paint.colors.map((color) => ({ color })) },
      },
      overrideAccess: true,
    })
    carIds.push(created.id)

    // One placeholder past car on the first driver
    if (n === 1) {
      await payload.create({
        collection: 'cars',
        data: {
          driver: driver.id,
          status: 'past',
          make: P('Make'),
          model: P('Model'),
          yearsOwned: P('Years owned'),
          description: P('What happened to this car?'),
          paint: { name: P('Paint'), type: 'solid', colors: [{ color: '#8E8E99' }] },
        },
        overrideAccess: true,
      })
    }
    log(`Driver ${n} + car`)
  }

  // ── A few parts ────────────────────────────────────────────────────────────
  const linkNote = P('Replace the link with your Amazon Associates link (SiteStripe → Get link).')
  const parts = [
    { car: carIds[0], name: P('Coilovers'), category: 'suspension', affiliateUrl: 'https://www.amazon.com/s?k=drift+coilovers' },
    { car: carIds[0], name: P('Bucket seat'), category: 'interior', affiliateUrl: 'https://www.amazon.com/s?k=racing+bucket+seat' },
    { car: carIds[0], name: P('Angle kit'), category: 'steering' },
    { car: carIds[2], name: P('Steering wheel'), category: 'interior', affiliateUrl: 'https://www.amazon.com/s?k=quick+release+steering+wheel' },
    { car: carIds[2], name: P('Hydraulic handbrake'), category: 'brakes', affiliateUrl: 'https://www.amazon.com/s?k=hydraulic+handbrake' },
  ]
  for (const part of parts) {
    await payload.create({
      collection: 'parts',
      data: {
        ...part,
        brand: P('Brand'),
        notes: part.affiliateUrl ? linkNote : undefined,
        affiliateSource: 'amazon',
      },
      overrideAccess: true,
    })
  }
  log('Parts')

  log('Done! Open the site and the admin panel to see the placeholder content.')
}

try {
  await seed()
  process.exit(0)
} catch (err) {
  console.error(err)
  process.exit(1)
}
