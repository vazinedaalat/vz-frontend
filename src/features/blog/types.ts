/** Blog content models for marketing site + app home cards. */

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
}

/** Raw list payload from Nest `GET /home/blog` / `GET /blog`. */
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
}
