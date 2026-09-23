import { describe, expect, it } from 'vitest'
import { findBlogBySlug, mapBlogListItem } from '@/features/blog/lib/blog'
import { MOCK_BLOG_POSTS } from '@/features/blog/constants/mock-posts'
import { resolveMarketingNavHref, isHashNavHref } from '@/features/home/lib/nav'

describe('mapBlogListItem', () => {
  it('falls back slug to id when missing', () => {
    const mapped = mapBlogListItem({
      id: 'abc-1',
      title: 'عنوان',
      excerpt: 'چکیده',
      category: 'راهنما',
      readMinutes: 3,
      publishedAt: '2025-01-01T00:00:00.000Z',
    })
    expect(mapped.slug).toBe('abc-1')
  })

  it('normalizes slug to lowercase', () => {
    const mapped = mapBlogListItem({
      id: '1',
      slug: 'Hello-World',
      title: 'ت',
      excerpt: 'چ',
      category: 'ک',
      readMinutes: 1,
      publishedAt: '2025-01-01',
    })
    expect(mapped.slug).toBe('hello-world')
  })
})

describe('findBlogBySlug', () => {
  it('finds by slug or id', () => {
    const posts = [...MOCK_BLOG_POSTS]
    expect(findBlogBySlug(posts, 'ezharnameh-vs-dadkhast')?.id).toBe('blog-1')
    expect(findBlogBySlug(posts, 'blog-1')?.slug).toBe('ezharnameh-vs-dadkhast')
  })
})

describe('marketing nav helpers', () => {
  it('keeps hash on home and prefixes elsewhere', () => {
    expect(isHashNavHref('#about')).toBe(true)
    expect(isHashNavHref('/blog')).toBe(false)
    expect(resolveMarketingNavHref('#about', '/')).toBe('#about')
    expect(resolveMarketingNavHref('#about', '/blog')).toBe('/#about')
    expect(resolveMarketingNavHref('/blog', '/')).toBe('/blog')
  })
})
