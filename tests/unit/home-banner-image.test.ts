import { describe, expect, it } from 'vitest'
import { resolveHomeBannerImageSrc } from '@/features/app/api/home'

describe('resolveHomeBannerImageSrc', () => {
  it('keeps absolute http URLs', () => {
    expect(resolveHomeBannerImageSrc('https://cdn.example/b.jpg')).toBe(
      'https://cdn.example/b.jpg',
    )
  })

  it('prefixes uploads with asset base', () => {
    const url = resolveHomeBannerImageSrc('/uploads/banners/x.jpg')
    expect(url).toContain('/uploads/banners/x.jpg')
    expect(url.startsWith('http')).toBe(true)
  })

  it('maps /images to frontend public base', () => {
    const url = resolveHomeBannerImageSrc('/images/app-home-banner.jpg')
    expect(url).toContain('images/app-home-banner.jpg')
  })
})
