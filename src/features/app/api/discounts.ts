import { apiRequest } from '@/services/api'
import type { DiscountCode, DiscountSection, DiscountValidationResult } from '../types'

export function fetchMyDiscounts() {
  return apiRequest<DiscountCode[]>({ method: 'GET', url: '/discounts/mine' })
}

/**
 * Preview whether a discount code is usable for a section/plan — does not consume usage.
 * For consultation, always pass `planId`.
 */
export function validateDiscountCode(
  code: string,
  section: DiscountSection | string,
  planId?: string,
) {
  return apiRequest<DiscountValidationResult>({
    method: 'POST',
    url: '/discounts/validate',
    data: {
      code: code.trim(),
      section,
      ...(planId ? { planId } : {}),
    },
  })
}
