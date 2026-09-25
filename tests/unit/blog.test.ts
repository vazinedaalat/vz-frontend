import { describe, expect, it } from 'vitest'
import { findBlogBySlug, mapBlogListItem } from '@/features/blog/lib/blog'
import { buildBlogListSeo, buildBlogPostSeo } from '@/features/blog/lib/seo'
import { MOCK_BLOG_POSTS } from '@/features/blog/constants/mock-posts'
import { resolveMarketingNavHref, isHashNavHref } from '@/features/home/lib/nav'
import {
  absoluteUrl,
  clampMetaDescription,
  faqPageJsonLd,
  titleWithBrand,
} from '@/lib/seo'

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

describe('seo helpers', () => {
  it('builds branded titles and clamps descriptions', () => {
    expect(titleWithBrand('بلاگ حقوقی')).toContain('وزین عدالت')
    expect(clampMetaDescription('الف'.repeat(200)).length).toBeLessThanOrEqual(160)
  })

  it('builds absolute blog URLs', () => {
    expect(absoluteUrl('/blog/foo')).toMatch(/\/blog\/foo$/)
  })

  it('builds list and post seo payloads with JSON-LD', () => {
    const list = buildBlogListSeo()
    expect(list.canonicalPath).toBe('/blog')
    expect(list.jsonLd.some((node) => node['@type'] === 'CollectionPage')).toBe(true)

    const post = MOCK_BLOG_POSTS[0]
    expect(post).toBeDefined()
    const detail = buildBlogPostSeo(post!)
    expect(detail.type).toBe('article')
    expect(detail.canonicalPath).toBe(`/blog/${post!.slug}`)
    expect(detail.jsonLd.some((node) => node['@type'] === 'BlogPosting')).toBe(true)
    expect(detail.jsonLd.some((node) => node['@type'] === 'FAQPage')).toBe(true)
    expect(faqPageJsonLd([])).toBeNull()
  })

  it('keeps mock posts SEO/GEO complete', () => {
    for (const post of MOCK_BLOG_POSTS) {
      expect(post.seoTitle?.length).toBeGreaterThan(10)
      expect(post.seoDescription?.length).toBeGreaterThan(40)
      expect(post.keyTakeaways?.length).toBeGreaterThanOrEqual(2)
      expect(post.faq?.length).toBeGreaterThanOrEqual(2)
      expect(post.coverImageAlt?.length).toBeGreaterThan(5)
    }
  })
})
