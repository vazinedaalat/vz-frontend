import { apiRequest } from '@/services/api'
import type { CaseFileRuleSection, CaseDeliveryMethod } from '../types'

export interface CaseIntakeCatalog {
  clientRoles: string[]
  claimTypes: string[]
  categories: string[]
  proceedingTypes: string[]
  urgency: string[]
  thanaOptions: string[]
  fileRulesSections: CaseFileRuleSection[]
  deliveryMethods: CaseDeliveryMethod[]
  documentTypes: Array<{ value: string; label: string }>
  mimeLimits: {
    accept: string
    mimeTypes: string[]
    maxBytes: number
    maxCount: number
    chatMaxCount: number
  }
}

export function fetchCaseIntakeCatalog() {
  return apiRequest<CaseIntakeCatalog>({ method: 'GET', url: '/catalog/case-intake' })
}
