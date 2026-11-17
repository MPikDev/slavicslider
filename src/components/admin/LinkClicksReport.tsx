/**
 * "Clicks per link, last 30 days" summary shown above the Link Clicks list in the admin.
 * Server component: runs on the server and queries the database directly.
 */
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

type Row = { label: string; kind: string; url: string; clicks: number; last: string }

const cell: React.CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid var(--theme-elevation-100)',
  textAlign: 'left',
  verticalAlign: 'top',
}

export async function LinkClicksReport() {
  const payload = await getPayload({ config })
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const { docs } = await payload.find({
    collection: 'link-clicks',
    where: { createdAt: { greater_than_equal: since.toISOString() } },
    depth: 0,
    limit: 0,
    pagination: false,
    overrideAccess: true,
  })

  const byLink = new Map<string, Row>()
  for (const d of docs as Array<Record<string, any>>) {
    const key = `${d.kind}:${d.targetId}`
    const row = byLink.get(key) ?? { label: d.label || d.url, kind: d.kind, url: d.url, clicks: 0, last: d.createdAt }
    row.clicks += 1
    if (d.createdAt > row.last) row.last = d.createdAt
    byLink.set(key, row)
  }
  const rows = [...byLink.values()].sort((a, b) => b.clicks - a.clicks)
  const sponsorTotal = rows.filter((r) => r.kind === 'sponsor').reduce((s, r) => s + r.clicks, 0)
  const storeTotal = rows.filter((r) => r.kind === 'affiliate').reduce((s, r) => s + r.clicks, 0)

  return (
    <div style={{ margin: '8px 0 32px', border: '1px solid var(--theme-elevation-150)', padding: 20 }}>
      <h2 style={{ margin: '0 0 4px' }}>Clicks per link: last 30 days</h2>
      <p style={{ margin: '0 0 16px', color: 'var(--theme-elevation-600)' }}>
        {docs.length} total clicks · {sponsorTotal} on sponsor links · {storeTotal} on store links. Screenshot this to
        show sponsors how much traffic the site sends them.
      </p>
      {rows.length === 0 ? (
        <p>No clicks yet in the last 30 days.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={cell}>Link</th>
                <th style={cell}>Type</th>
                <th style={{ ...cell, textAlign: 'right' }}>Clicks</th>
                <th style={cell}>Last click</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.kind}-${r.label}-${r.url}`}>
                  <td style={cell}>
                    <strong>{r.label}</strong>
                    <div style={{ fontSize: 12, color: 'var(--theme-elevation-500)', wordBreak: 'break-all' }}>{r.url}</div>
                  </td>
                  <td style={cell}>{r.kind === 'sponsor' ? 'Sponsor' : 'Store'}</td>
                  <td style={{ ...cell, textAlign: 'right', fontWeight: 700 }}>{r.clicks}</td>
                  <td style={cell}>{new Date(r.last).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
