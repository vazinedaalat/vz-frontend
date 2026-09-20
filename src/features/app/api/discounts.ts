import { apiRequest } from '@/services/api'
import type { DiscountCode } from '../types'

export function fetchMyDiscounts() {
  return apiRequest<DiscountCode[]>({ method: 'GET', url: '/discounts/mine' })
}

export function validateDiscountCode(
  code: string,
  section: string,
  planId?: string,
) {
  return apiRequest<{
    code: string
    percent: number
    title: string
    section: string
    applicableTo: string
    context: string
  }>({
    method: 'POST',
    url: '/discounts/validate',
    data: {
      code,
      section,
      ...(planId ? { planId } : {}),
    },
  })
}
