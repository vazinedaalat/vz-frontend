import { describe, expect, it } from 'vitest'
import { publicUrl } from '@/lib/public-url'

describe('publicUrl', () => {
  it('prefixes paths with Vite BASE_URL', () => {
    expect(publicUrl('/images/banner.jpg')).toBe(`${import.meta.env.BASE_URL}images/banner.jpg`)
    expect(publicUrl('images/banner.jpg')).toBe(`${import.meta.env.BASE_URL}images/banner.jpg`)
  })
})
