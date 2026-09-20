import type { DiscountCode, SpecialOffer } from '../types'

/** Maps a real discount code (`/discounts/mine`) into the home offer card shape. */
export function discountToSpecialOffer(discount: DiscountCode): SpecialOffer {
  return {
    id: discount.id,
    title: discount.title,
    subtitle: discount.description,
    discountPercent: discount.percent,
    badge: discount.audience === 'user' ? 'اختصاصی شما' : discount.applicableTo || 'سراسری',
    expiresAt: discount.expiresAtLabel || discount.expiresAt,
    ctaLabel: discount.code,
    href: '/app/discounts',
  }
}

export function discountsToSpecialOffers(discounts: DiscountCode[]): SpecialOffer[] {
  return discounts.filter((item) => item.isActive).map(discountToSpecialOffer)
}
