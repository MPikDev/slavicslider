import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

/** Renders rich text written in the admin editor. */
export function RichText({ data }: { data: any }) {
  if (!data?.root?.children?.length) return null
  return (
    <div className="prose">
      <LexicalRichText data={data} />
    </div>
  )
}
