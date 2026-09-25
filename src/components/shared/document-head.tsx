import { useEffect } from 'react'
import { applyDocumentMeta, type DocumentMetaInput } from '@/lib/seo/document-meta'
import { absoluteUrl } from '@/lib/seo/site'

type DocumentHeadProps = Omit<DocumentMetaInput, 'jsonLd'> & {
  jsonLd?: Record<string, unknown>[]
}

/** Declarative document head for marketing/blog routes (SPA-friendly). */
export function DocumentHead({
  title,
  description,
  canonicalPath,
  imageUrl,
  imageAlt,
  type,
  robots,
  keywords,
  publishedTime,
  modifiedTime,
  author,
  jsonLd,
}: DocumentHeadProps) {
  const keywordsKey = keywords?.join('|') ?? ''
  const jsonLdKey = jsonLd?.length ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    return applyDocumentMeta(
      {
        title,
        description,
        canonicalPath,
        imageUrl,
        imageAlt,
        type,
        robots,
        keywords,
        publishedTime,
        modifiedTime,
        author,
        jsonLd,
      },
      absoluteUrl
    )
  }, [
    title,
    description,
    canonicalPath,
    imageUrl,
    imageAlt,
    type,
    robots,
    keywordsKey,
    publishedTime,
    modifiedTime,
    author,
    jsonLdKey,
    keywords,
    jsonLd,
  ])

  return null
}
