import {
  absoluteUrl,
  blogPostingJsonLd,
  breadcrumbJsonLd,
  clampMetaDescription,
  collectionPageJsonLd,
  faqPageJsonLd,
  organizationJsonLd,
  titleWithBrand,
  websiteJsonLd,
} from '@/lib/seo'
import type { BlogPostDetail } from '../types'

const BLOG_LIST_DESCRIPTION =
  'مقالات کاربردی حقوقی وزین عدالت درباره اظهارنامه، دادخواست، سامانه ثنا، مشاوره آنلاین و پیگیری پرونده — راهنمای شفاف برای موکلان.'

export function buildBlogListSeo() {
  const title = titleWithBrand('بلاگ حقوقی')
  const description = clampMetaDescription(BLOG_LIST_DESCRIPTION)
  return {
    title,
    description,
    canonicalPath: '/blog',
    type: 'website' as const,
    jsonLd: [
      organizationJsonLd(),
      websiteJsonLd(),
      collectionPageJsonLd({
        name: 'بلاگ حقوقی وزین عدالت',
        description,
        path: '/blog',
      }),
      breadcrumbJsonLd([
        { name: 'خانه', path: '/' },
        { name: 'بلاگ', path: '/blog' },
      ]),
    ],
  }
}

function estimateWordCount(post: BlogPostDetail): number {
  if (post.bodyHtml?.trim()) {
    const text = post.bodyHtml.replace(/<[^>]+>/g, ' ')
    return text.trim().split(/\s+/).filter(Boolean).length
  }
  const fromBlocks = post.body
    .flatMap((block) => {
      if (block.type === 'list') return block.items
      return [block.text]
    })
    .join(' ')
  return fromBlocks.trim().split(/\s+/).filter(Boolean).length
}

export function buildBlogPostSeo(post: BlogPostDetail) {
  const path = `/blog/${post.slug}`
  const title = titleWithBrand(post.seoTitle?.trim() || post.title)
  const description = clampMetaDescription(post.seoDescription?.trim() || post.excerpt)
  const imageUrl = post.coverImage
    ? /^https?:\/\//i.test(post.coverImage)
      ? post.coverImage
      : absoluteUrl(post.coverImage)
    : undefined
  const faqs = post.faq ?? []
  const faqLd = faqPageJsonLd(faqs)

  const jsonLd: Record<string, unknown>[] = [
    organizationJsonLd(),
    websiteJsonLd(),
    blogPostingJsonLd({
      title: post.seoTitle?.trim() || post.title,
      description,
      path,
      imageUrl,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      authorName: post.authorName,
      authorRole: post.authorRole,
      keywords: post.keywords,
      wordCount: estimateWordCount(post),
      articleSection: post.category,
    }),
    breadcrumbJsonLd([
      { name: 'خانه', path: '/' },
      { name: 'بلاگ', path: '/blog' },
      { name: post.title, path },
    ]),
  ]
  if (faqLd) jsonLd.push(faqLd)

  return {
    title,
    description,
    canonicalPath: path,
    type: 'article' as const,
    imageUrl,
    imageAlt: post.coverImageAlt ?? post.title,
    keywords: post.keywords,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt ?? post.publishedAt,
    author: post.authorName,
    jsonLd,
  }
}

export function buildBlogNotFoundSeo(slug: string) {
  return {
    title: titleWithBrand('مطلب پیدا نشد'),
    description: clampMetaDescription(
      'این مطلب بلاگ در وزین عدالت پیدا نشد یا حذف شده است. از فهرست مطالب حقوقی دیدن کنید.'
    ),
    canonicalPath: slug ? `/blog/${slug}` : '/blog',
    robots: 'noindex, follow',
    type: 'website' as const,
    jsonLd: [organizationJsonLd()],
  }
}
