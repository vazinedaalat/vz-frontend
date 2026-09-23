/** Helpers for marketing SiteHeader / SiteFooter nav across home + inner pages. */

export function isHashNavHref(href: string): boolean {
  return href.startsWith('#')
}

/** Hash links stay local on `/`; from other routes they become `/#section`. */
export function resolveMarketingNavHref(href: string, pathname: string): string {
  if (!isHashNavHref(href)) return href
  if (pathname === '/' || pathname === '') return href
  return `/${href}`
}

export function marketingNavSectionId(href: string): string | null {
  return isHashNavHref(href) ? href.slice(1) : null
}
