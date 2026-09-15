import { apiRequest } from '@/services/api'
import type { DiscountCode } from '../types'

export function fetchMyDiscounts() {
  return apiRequest<DiscountCode[]>({ method: 'GET', url: '/discounts/mine' })
}

export function validateDiscountCode(code: string, context: string) {
  return apiRequest<{
    code: string
    percent: number
    title: string
    applicableTo: string
    context: string
  }>({
    method: 'POST',
    url: '/discounts/validate',
    data: { code, context },
  })
}
