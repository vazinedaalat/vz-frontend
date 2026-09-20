/** Final payable amount after a percent discount (rounded to nearest toman). */
export function computeDiscountedPrice(price: number, percent: number): number {
  if (!Number.isFinite(price) || price <= 0) return 0
  if (!Number.isFinite(percent) || percent <= 0) return Math.round(price)
  const clamped = Math.min(100, percent)
  return Math.max(0, Math.round(price * (1 - clamped / 100)))
}

/** Absolute savings in toman. */
export function computeDiscountAmount(price: number, percent: number): number {
  if (!Number.isFinite(price) || price <= 0) return 0
  return Math.max(0, Math.round(price) - computeDiscountedPrice(price, percent))
}

/** Normalize user-entered discount codes for compare / API. */
export function normalizeDiscountCode(code: string): string {
  return code.trim().toUpperCase()
}
