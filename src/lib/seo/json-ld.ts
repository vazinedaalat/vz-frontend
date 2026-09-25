import { absoluteUrl, SITE_SEO } from './site'

export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': `${absoluteUrl('/')}#organization`,
    name: SITE_SEO.name,
    url: absoluteUrl('/'),
    description: SITE_SEO.defaultDescription,
    inLanguage: SITE_SEO.language,
    areaServed: {
      '@type': 'Country',
      name: 'Iran',
    },
    ...(SITE_SEO.organizationSameAs.length
      ? { sameAs: [...SITE_SEO.organizationSameAs] }
      : {}),
  }
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${absoluteUrl('/')}#website`,
    name: SITE_SEO.name,
    url: absoluteUrl('/'),
    inLanguage: SITE_SEO.language,
    publisher: { '@id': `${absoluteUrl('/')}#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${absoluteUrl('/blog')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function collectionPageJsonLd(input: {
  name: string
  description: string
  path: string
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl(input.path)}#collection`,
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: SITE_SEO.language,
    isPartOf: { '@id': `${absoluteUrl('/')}#website` },
    about: { '@id': `${absoluteUrl('/')}#organization` },
  }
}

export function blogPostingJsonLd(input: {
  title: string
  description: string
  path: string
  imageUrl?: string
  datePublished: string
  dateModified?: string
  authorName: string
  authorRole?: string
  keywords?: string[]
  wordCount?: number
  articleSection?: string
}): Record<string, unknown> {
  const url = absoluteUrl(input.path)
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: input.title,
    description: input.description,
    url,
    inLanguage: SITE_SEO.language,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    articleSection: input.articleSection,
    keywords: input.keywords?.join(', '),
    wordCount: input.wordCount,
    image: input.imageUrl ? [input.imageUrl] : undefined,
    author: {
      '@type': 'Person',
      name: input.authorName,
      ...(input.authorRole ? { jobTitle: input.authorRole } : {}),
    },
    publisher: {
      '@id': `${absoluteUrl('/')}#organization`,
    },
    isPartOf: { '@id': `${absoluteUrl('/')}#website` },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '[data-seo-summary]', '[data-seo-takeaways]'],
    },
  }
}

export function faqPageJsonLd(
  faqs: { question: string; answer: string }[]
): Record<string, unknown> | null {
  if (faqs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
