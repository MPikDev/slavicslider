type Links = { instagram?: string | null; tiktok?: string | null; youtube?: string | null; facebook?: string | null }

const LABELS: Array<[keyof Links, string]> = [
  ['instagram', 'Instagram'],
  ['tiktok', 'TikTok'],
  ['youtube', 'YouTube'],
  ['facebook', 'Facebook'],
]

/** Social links as small outline buttons. `who` is used in the accessible label. */
export function SocialLinks({ links, who }: { links: Links; who: string }) {
  const present = LABELS.filter(([key]) => Boolean(links[key]))
  if (!present.length) return null
  return (
    <div className="social-links">
      {present.map(([key, label]) => (
        <a
          key={key}
          href={links[key] as string}
          className="btn btn-secondary btn-sm"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${who} on ${label} (opens in a new tab)`}
        >
          {label}
        </a>
      ))}
    </div>
  )
}

export function SocialList({ links, who }: { links: Links; who: string }) {
  const present = LABELS.filter(([key]) => Boolean(links[key]))
  if (!present.length) return null
  return (
    <ul className="footer-links">
      {present.map(([key, label]) => (
        <li key={key}>
          <a href={links[key] as string} target="_blank" rel="noopener noreferrer" aria-label={`${who} on ${label} (opens in a new tab)`}>
            {label}
          </a>
        </li>
      ))}
    </ul>
  )
}
