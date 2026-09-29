import { apiRequest } from '@/services/api'
import { ValidationError } from '@/services/api/errors'
import type { DiscountCode, DiscountSection, DiscountValidationResult } from '../types'

export function fetchMyDiscounts() {
  return apiRequest<DiscountCode[]>({ method: 'GET', url: '/discounts/mine' })
}

type ValidateResponse =
  | (DiscountValidationResult & { valid?: true })
  | { valid: false; message: string }

/**
 * Preview whether a discount code is usable for a section/plan — does not consume usage.
 * For consultation, always pass `planId`.
 *
 * Uses `softFail` so a rejected code comes back as 200 `{ valid: false, message }`:
 * the CDN in front of the API replaces 4xx bodies with an HTML page without CORS
 * headers, which would otherwise surface as a generic network error.
 */
export async function validateDiscountCode(
  code: string,
  section: DiscountSection | string,
  planId?: string,
): Promise<DiscountValidationResult> {
  const result = await apiRequest<ValidateResponse>({
    method: 'POST',
    url: '/discounts/validate',
    data: {
      code: code.trim(),
      section,
      ...(planId ? { planId } : {}),
      softFail: true,
    },
  })
  if (result.valid === false) {
    throw new ValidationError(result.message || 'کد تخفیف نامعتبر است')
  }
  return result
}
