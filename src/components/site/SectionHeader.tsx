import type { ReactNode } from 'react'
import { pad2 } from '@/lib/site'

type Props = {
  index?: number
  eyebrow: string
  title: string
  as?: 'h1' | 'h2'
  id?: string
  action?: ReactNode
}

/** Numbered eyebrow ("01 / The team") above a big uppercase title. */
export function SectionHeader({ index, eyebrow, title, as: Tag = 'h2', id, action }: Props) {
  return (
    <div className="section-head">
      <div>
        <span className="eyebrow">{index !== undefined ? `${pad2(index)} / ${eyebrow}` : eyebrow}</span>
        <Tag className="section-title" id={id}>
          {title}
        </Tag>
      </div>
      {action}
    </div>
  )
}

/** Header block at the top of inner pages. */
export function PageHead({ index, eyebrow, title, intro }: { index?: number; eyebrow: string; title: string; intro?: ReactNode }) {
  return (
    <div className="page-head">
      <div className="container">
        <SectionHeader index={index} eyebrow={eyebrow} title={title} as="h1" />
        {intro ? <div>{intro}</div> : null}
      </div>
    </div>
  )
}
