import type { Field, FieldHook } from 'payload'
import { slugify } from '../lib/slugify'

/**
 * A hidden, auto-generated URL slug built from another field (e.g. the driver's name).
 * Editors never see or touch it. Duplicates get "-2", "-3"… appended.
 */
export const slugField = (from: string): Field => {
  const generate: FieldHook = async ({ value, data, originalDoc, req, collection }) => {
    const source = (data?.[from] ?? originalDoc?.[from]) as string | undefined
    const sourceChanged = data?.[from] !== undefined && data?.[from] !== originalDoc?.[from]
    if (value && !sourceChanged) return value
    if (originalDoc?.slug && !sourceChanged) return originalDoc.slug
    if (!source) return value

    const base = slugify(String(source)) || 'item'
    if (!collection) return base

    let candidate = base
    for (let n = 2; n < 100; n++) {
      const { totalDocs } = await req.payload.count({
        collection: collection.slug as any,
        where: {
          and: [
            { slug: { equals: candidate } },
            ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
          ],
        },
        overrideAccess: true,
        req,
      })
      if (totalDocs === 0) return candidate
      candidate = `${base}-${n}`
    }
    return `${base}-${Date.now()}`
  }

  return {
    name: 'slug',
    type: 'text',
    index: true,
    admin: { hidden: true },
    hooks: { beforeValidate: [generate] },
  }
}
