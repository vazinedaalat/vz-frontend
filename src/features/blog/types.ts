/** Blog content models for marketing site + app home cards. */

export interface BlogFaqItem {
  question: string
  answer: string
}

export interface BlogPostSummary {
  id: string
  /** URL segment — prefer slug; fall back to id until Nest provides slug. */
  slug: string
  title: string
  excerpt: string
  category: string
  readMinutes: number
  /** ISO date or Persian label from API. */
  publishedAt: string
  coverImage?: string
  authorName?: string
}

export type BlogBodyBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }

export interface BlogPostDetail extends BlogPostSummary {
  authorName: string
  authorRole?: string
  /** Legacy / mock structured blocks. Prefer `bodyHtml` when present. */
  body: BlogBodyBlock[]
  /** Sanitized rich HTML from admin TipTap (headings, lists, emphasis, spacing). */
  bodyHtml?: string
  /** SEO overrides — fall back to title / excerpt when absent. */
  seoTitle?: string
  seoDescription?: string
  keywords?: string[]
  /** ISO date when content was last revised. */
  updatedAt?: string
  /** Accessible cover description (Persian). */
  coverImageAlt?: string
  /** GEO: scannable bullets shown near the top of the article. */
  keyTakeaways?: string[]
  /** GEO + FAQPage schema — also rendered in the article. */
  faq?: BlogFaqItem[]
}

/** Raw list/detail payload from Nest `GET /blog` / `GET /blog/:slug`. */
export interface BlogPostApiListItem {
  id: string
  slug?: string
  title: string
  excerpt: string
  category: string
  readMinutes: number
  publishedAt: string
  coverImage?: string | null
  authorName?: string | null
  authorRole?: string | null
  bodyHtml?: string
  body?: BlogBodyBlock[]
  seoTitle?: string | null
  seoDescription?: string | null
  keywords?: string[] | null
  updatedAt?: string | null
  coverImageAlt?: string | null
  keyTakeaways?: string[] | null
  faq?: BlogFaqItem[] | null
}
