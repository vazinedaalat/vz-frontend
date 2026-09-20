import { describe, expect, it } from 'vitest'
import { discountToSpecialOffer, discountsToSpecialOffers } from '@/features/app/lib/discount-offers'
import type { DiscountCode } from '@/features/app/types'

const sample: DiscountCode = {
  id: 'd1',
  code: 'VAZIN40',
  title: 'تخفیف مشاوره',
  description: 'اولین جلسه',
  percent: 40,
  maxUsage: 1,
  usedCount: 0,
  expiresAt: '2026-12-21T23:59:59.999Z',
  expiresAtLabel: '۱۴۰۴/۰۷/۳۰',
  section: 'consultation',
  applicableTo: 'مشاوره',
  audience: 'user',
  isActive: true,
}

describe('discount-offers', () => {
  it('maps discount codes into home offer cards', () => {
    const offer = discountToSpecialOffer(sample)
    expect(offer.badge).toBe('اختصاصی شما')
    expect(offer.discountPercent).toBe(40)
    expect(offer.ctaLabel).toBe('VAZIN40')
    expect(offer.href).toBe('/app/discounts')
    expect(offer.expiresAt).toBe('۱۴۰۴/۰۷/۳۰')
  })

  it('skips inactive discounts', () => {
    expect(discountsToSpecialOffers([{ ...sample, isActive: false }])).toHaveLength(0)
    expect(discountsToSpecialOffers([sample])).toHaveLength(1)
  })
})
