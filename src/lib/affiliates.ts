/**
 * Affiliate stores. To add another store later (e.g. eBay), add an entry here;
 * it will show up in the "Store" dropdown on Parts and get its own button text.
 */
export const AFFILIATE_SOURCES = {
  amazon: {
    label: 'Amazon',
    button: 'Buy on Amazon',
    disclosure: 'As an Amazon Associate we earn from qualifying purchases.',
  },
} as const

export type AffiliateSource = keyof typeof AFFILIATE_SOURCES

export const affiliateSourceOptions = Object.entries(AFFILIATE_SOURCES).map(([value, s]) => ({
  label: s.label,
  value,
}))

export const getAffiliate = (source?: string | null) =>
  AFFILIATE_SOURCES[(source as AffiliateSource) || 'amazon'] ?? AFFILIATE_SOURCES.amazon
