import type { BlogPostApiListItem, BlogPostDetail, BlogPostSummary } from '../types'

export function mapBlogListItem(raw: BlogPostApiListItem): BlogPostSummary {
  return {
    id: raw.id,
    slug: (raw.slug?.trim() || raw.id).toLowerCase(),
    title: raw.title,
    excerpt: raw.excerpt,
    category: raw.category,
    readMinutes: raw.readMinutes,
    publishedAt: raw.publishedAt,
    ...(raw.coverImage ? { coverImage: raw.coverImage } : {}),
    ...(raw.authorName ? { authorName: raw.authorName } : {}),
  }
}

export function findBlogBySlug(posts: BlogPostDetail[], slug: string): BlogPostDetail | undefined {
  const key = slug.trim().toLowerCase()
  return posts.find((post) => post.slug === key || post.id === key)
}
