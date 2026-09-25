export interface DocumentMetaInput {
  title: string
  description: string
  /** Pathname starting with `/`, e.g. `/blog/foo`. */
  canonicalPath: string
  /** Absolute or site-relative image URL. */
  imageUrl?: string
  imageAlt?: string
  type?: 'website' | 'article'
  robots?: string
  keywords?: string[]
  publishedTime?: string
  modifiedTime?: string
  author?: string
  /** JSON-LD graph nodes (objects). */
  jsonLd?: Record<string, unknown>[]
}

const ATTR = 'data-vz-seo'
const JSON_LD_ATTR = 'data-vz-jsonld'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"][${ATTR}]`
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    el.setAttribute(ATTR, '1')
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  const selector = `link[rel="${rel}"][${ATTR}]`
  let el = document.head.querySelector(selector) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    el.setAttribute(ATTR, '1')
    document.head.appendChild(el)
  }
  el.href = href
}

function clearManaged() {
  document.head.querySelectorAll(`[${ATTR}]`).forEach((node) => node.remove())
  document.head.querySelectorAll(`script[${JSON_LD_ATTR}]`).forEach((node) => node.remove())
}

function upsertJsonLd(nodes: Record<string, unknown>[]) {
  document.head.querySelectorAll(`script[${JSON_LD_ATTR}]`).forEach((node) => node.remove())
  nodes.forEach((node, index) => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute(JSON_LD_ATTR, String(index))
    script.text = JSON.stringify(node)
    document.head.appendChild(script)
  })
}

/** Apply SEO head tags; returns cleanup that restores defaults when unmounting. */
export function applyDocumentMeta(
  input: DocumentMetaInput,
  resolveAbsoluteUrl: (path: string) => string
): () => void {
  const title = input.title.trim()
  const description = input.description.trim()
  const canonical = resolveAbsoluteUrl(input.canonicalPath)
  const image = input.imageUrl
    ? /^https?:\/\//i.test(input.imageUrl)
      ? input.imageUrl
      : resolveAbsoluteUrl(input.imageUrl)
    : undefined

  document.title = title

  upsertMeta('name', 'description', description)
  upsertMeta('name', 'robots', input.robots ?? 'index, follow, max-image-preview:large')
  upsertMeta('name', 'googlebot', input.robots ?? 'index, follow, max-image-preview:large')
  if (input.keywords?.length) {
    upsertMeta('name', 'keywords', input.keywords.join(', '))
  }
  if (input.author) {
    upsertMeta('name', 'author', input.author)
  }

  upsertLink('canonical', canonical)

  const ogType = input.type ?? 'website'
  upsertMeta('property', 'og:type', ogType)
  upsertMeta('property', 'og:locale', 'fa_IR')
  upsertMeta('property', 'og:site_name', 'وزین عدالت')
  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:url', canonical)
  if (image) {
    upsertMeta('property', 'og:image', image)
    if (input.imageAlt) upsertMeta('property', 'og:image:alt', input.imageAlt)
  }
  if (input.publishedTime) {
    upsertMeta('property', 'article:published_time', input.publishedTime)
  }
  if (input.modifiedTime) {
    upsertMeta('property', 'article:modified_time', input.modifiedTime)
  }
  if (input.author) {
    upsertMeta('property', 'article:author', input.author)
  }

  upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:description', description)
  if (image) upsertMeta('name', 'twitter:image', image)

  if (input.jsonLd?.length) {
    upsertJsonLd(input.jsonLd)
  }

  return () => {
    clearManaged()
  }
}
