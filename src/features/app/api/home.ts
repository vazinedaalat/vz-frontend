import { assetUrl } from '@/lib/asset-url'
import { publicUrl } from '@/lib/public-url'
import { apiRequest } from '@/services/api'
import type { BlogCard, HomeHeroBannerSlide } from '../types'

/** Resolve banner image for SPA: uploads → API host, /images → frontend public. */
export function resolveHomeBannerImageSrc(src: string): string {
  if (!src) return ''
  if (/^https?:\/\//i.test(src)) return src
  if (src.startsWith('/uploads')) return assetUrl(src)
  return publicUrl(src)
}

export async function fetchHomeBanners() {
  const rows = await apiRequest<HomeHeroBannerSlide[]>({
    method: 'GET',
    url: '/home/banners',
  })
  return rows.map((item) => ({
    ...item,
    imageSrc: resolveHomeBannerImageSrc(item.imageSrc),
  }))
}

export function fetchHomeBlog() {
  return apiRequest<BlogCard[]>({ method: 'GET', url: '/home/blog' })
}
