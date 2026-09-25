import { env } from '@/config/env'

/** Public marketing site identity for SEO / GEO. */
export const SITE_SEO = {
  name: env.VITE_APP_NAME,
  locale: 'fa_IR',
  language: 'fa',
  defaultTitle: 'وزین عدالت | خدمات حقوقی و قضایی تخصصی',
  defaultDescription:
    'وزین عدالت؛ مشاوره حقوقی، لایحه‌نویسی، تنظیم دادخواست، قرارداد و پیگیری پرونده آنلاین با وکلای پایه یک دادگستری.',
  twitterHandle: undefined as string | undefined,
  organizationSameAs: [] as string[],
} as const

/**
 * Absolute origin for canonical / OG / JSON-LD.
 * Prefer `VITE_SITE_URL`; fall back to browser origin at runtime.
 */
export function getSiteOrigin(): string {
  const configured = env.VITE_SITE_URL?.replace(/\/$/, '')
  if (configured) return configured
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return 'https://vazinedalat.ir'
}

/** Vite base path without trailing slash (`""` or `"/vz-frontend"`). */
export function getBasePath(): string {
  const base = import.meta.env.BASE_URL || '/'
  if (!base || base === '/') return ''
  return base.endsWith('/') ? base.slice(0, -1) : base
}

/** Build absolute URL for a site path like `/blog/foo`. */
export function absoluteUrl(pathname: string): string {
  const origin = getSiteOrigin()
  const basePath = getBasePath()
  let path = pathname.startsWith('/') ? pathname : `/${pathname}`
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  if (path === '/') {
    return basePath ? `${origin}${basePath}/` : `${origin}/`
  }
  return `${origin}${basePath}${path}`
}

export function titleWithBrand(pageTitle: string): string {
  const trimmed = pageTitle.trim()
  if (!trimmed) return SITE_SEO.defaultTitle
  if (trimmed.includes(SITE_SEO.name)) return trimmed
  return `${trimmed} | ${SITE_SEO.name}`
}

export function clampMetaDescription(text: string, max = 160): string {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length <= max) return normalized
  const slice = normalized.slice(0, max - 1)
  const lastSpace = slice.lastIndexOf(' ')
  return `${(lastSpace > 80 ? slice.slice(0, lastSpace) : slice).trim()}…`
}
