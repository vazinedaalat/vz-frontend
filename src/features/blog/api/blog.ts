import { env } from '@/config/env'
import { assetUrl } from '@/lib/asset-url'
import { publicUrl } from '@/lib/public-url'
import { apiRequest } from '@/services/api'
import { MOCK_BLOG_POSTS } from '../constants/mock-posts'
import { findBlogBySlug, mapBlogListItem } from '../lib/blog'
import type { BlogPostApiListItem, BlogPostDetail, BlogPostSummary } from '../types'

/**
 * Prefer live Nest API when mock flag is off.
 * Marketing blog is public — works without login.
 */
export const isBlogMockEnabled = env.VITE_APP_ENV !== 'production' && env.VITE_USE_MOCK

export function resolveBlogCoverUrl(src: string | null | undefined): string | undefined {
  if (!src) return undefined
  if (/^https?:\/\//i.test(src)) return src
  if (src.startsWith('/uploads')) return assetUrl(src)
  if (src.startsWith('/images')) return publicUrl(src)
  return assetUrl(src)
}

export function getMockBlogSummaries(): BlogPostSummary[] {
  return MOCK_BLOG_POSTS.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    readMinutes: post.readMinutes,
    publishedAt: post.publishedAt,
    coverImage: post.coverImage,
    authorName: post.authorName,
  }))
}

export function getMockBlogBySlug(slug: string): BlogPostDetail | undefined {
  return findBlogBySlug([...MOCK_BLOG_POSTS], slug)
}

function mapDetail(raw: BlogPostApiListItem & Partial<BlogPostDetail>): BlogPostDetail {
  const summary = mapBlogListItem(raw)
  const faq = Array.isArray(raw.faq)
    ? raw.faq.filter((item) => item?.question?.trim() && item?.answer?.trim())
    : undefined
  const keyTakeaways = Array.isArray(raw.keyTakeaways)
    ? raw.keyTakeaways.map((item) => item.trim()).filter(Boolean)
    : undefined
  const keywords = Array.isArray(raw.keywords)
    ? raw.keywords.map((item) => item.trim()).filter(Boolean)
    : undefined

  return {
    ...summary,
    coverImage: resolveBlogCoverUrl(summary.coverImage) ?? summary.coverImage,
    authorName: raw.authorName?.trim() || 'وزین عدالت',
    authorRole: raw.authorRole ?? undefined,
    bodyHtml: raw.bodyHtml?.trim() || undefined,
    body:
      Array.isArray(raw.body) && raw.body.length > 0
        ? raw.body
        : [{ type: 'paragraph', text: raw.excerpt }],
    ...(raw.seoTitle?.trim() ? { seoTitle: raw.seoTitle.trim() } : {}),
    ...(raw.seoDescription?.trim() ? { seoDescription: raw.seoDescription.trim() } : {}),
    ...(keywords?.length ? { keywords } : {}),
    ...(raw.updatedAt?.trim() ? { updatedAt: raw.updatedAt.trim() } : {}),
    ...(raw.coverImageAlt?.trim() ? { coverImageAlt: raw.coverImageAlt.trim() } : {}),
    ...(keyTakeaways?.length ? { keyTakeaways } : {}),
    ...(faq?.length ? { faq } : {}),
  }
}

/** Marketing list + homepage strip — `GET /blog` (public). */
export async function fetchBlogList(): Promise<BlogPostSummary[]> {
  if (isBlogMockEnabled) return getMockBlogSummaries()
  const rows = await apiRequest<BlogPostApiListItem[]>({ method: 'GET', url: '/blog' })
  return rows.map((row) => {
    const item = mapBlogListItem(row)
    return {
      ...item,
      coverImage: resolveBlogCoverUrl(item.coverImage) ?? item.coverImage,
    }
  })
}

/** Full post — `GET /blog/:slug` (public). */
export async function fetchBlogBySlug(slug: string): Promise<BlogPostDetail | null> {
  if (isBlogMockEnabled) return getMockBlogBySlug(slug) ?? null

  try {
    const detail = await apiRequest<BlogPostApiListItem & BlogPostDetail>({
      method: 'GET',
      url: `/blog/${encodeURIComponent(slug)}`,
    })
    return mapDetail(detail)
  } catch {
    return null
  }
}
