import type { Metadata } from 'next'
import type { MediaDoc, Rel } from './types'
import { populated } from './types'
import { SITE_NAME } from './site'

type PageMetaArgs = {
  title?: string
  description?: string | null
  path: string
  image?: Rel<MediaDoc>
}

/** Per-page SEO + Open Graph. Falls back to a generated share image with the page title. */
export const pageMeta = ({ title, description, path, image }: PageMetaArgs): Metadata => {
  const img = populated(image)
  const ogImage = img?.url
    ? { url: img.sizes?.card?.url || img.url, width: img.sizes?.card?.width || img.width || undefined, height: img.sizes?.card?.height || img.height || undefined, alt: img.alt || title || SITE_NAME }
    : { url: `/og?title=${encodeURIComponent(title || SITE_NAME)}`, width: 1200, height: 630, alt: title || SITE_NAME }
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  return {
    title: title ? { absolute: fullTitle } : { absolute: SITE_NAME },
    description: description || undefined,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: fullTitle,
      description: description || undefined,
      url: path,
      images: [ogImage],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description: description || undefined, images: [ogImage.url] },
  }
}
