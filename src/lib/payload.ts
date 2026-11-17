import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { SiteSettingsDoc } from './types'

export const getPayloadClient = () => getPayload({ config })

/** Site Settings global, cached per request. */
export const getSettings = cache(async (): Promise<SiteSettingsDoc> => {
  try {
    const payload = await getPayloadClient()
    return (await payload.findGlobal({ slug: 'site-settings', depth: 1 })) as unknown as SiteSettingsDoc
  } catch (err) {
    console.error('Could not load Site Settings', err)
    return {}
  }
})
