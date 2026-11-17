import Link from 'next/link'
import type { CarDoc, DriverDoc } from '@/lib/types'
import { populated } from '@/lib/types'
import { Img } from './Img'
import { PaintSwatch } from './PaintSwatch'

export const carName = (car?: CarDoc | null) =>
  car ? car.title || [car.year, car.make, car.model, car.generation].filter(Boolean).join(' ') : ''

/** Driver card: car photo with the big number, driver name, car + paint swatch. */
export function DriverCard({ driver, car }: { driver: DriverDoc; car?: CarDoc | null }) {
  const photo = populated(car?.coverPhoto) || populated(driver.photo)
  return (
    <Link href={`/drivers/${driver.slug}`} className="driver-card">
      <div className="driver-card-media">
        {driver.carNumber ? (
          <span className="car-number" aria-hidden="true">
            {driver.carNumber}
          </span>
        ) : null}
        <Img media={photo} alt={photo?.alt || ''} sizes="(min-width: 1080px) 25vw, (min-width: 600px) 50vw, 100vw" />
      </div>
      <div className="driver-card-body">
        <h3 className="driver-card-name">
          {driver.carNumber ? <span className="visually-hidden">Car {driver.carNumber}: </span> : null}
          {driver.name}
        </h3>
        {driver.nickname ? <span className="label driver-card-nick">{driver.nickname}</span> : null}
        {car ? (
          <span className="car-line">
            <PaintSwatch paint={car.paint} />
            <span>
              {carName(car)}
              {car.paint?.name ? <span className="visually-hidden">, paint: {car.paint.name}</span> : null}
            </span>
          </span>
        ) : null}
      </div>
    </Link>
  )
}
