import { apiRequest } from '@/services/api'
import type { CreateCaseValues } from '../schemas'
import type { CasePrepaymentInvoice, LegalCase } from '../types'

export type CasePrepaymentInvoiceApi = CasePrepaymentInvoice & {
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'waived'
}

function normalizeCase(item: LegalCase & { lawyerName?: string | null; nextAction?: string | null }): LegalCase {
  return {
    ...item,
    lawyerName: item.lawyerName ?? '—',
    nextAction: item.nextAction ?? '',
  }
}

export function fetchCases() {
  return apiRequest<LegalCase[]>({ method: 'GET', url: '/cases' }).then((items) =>
    items.map(normalizeCase),
  )
}

export function fetchCaseById(id: string) {
  return apiRequest<LegalCase>({ method: 'GET', url: `/cases/${id}` }).then(normalizeCase)
}

export function createCaseApi(payload: CreateCaseValues) {
  return apiRequest<LegalCase>({
    method: 'POST',
    url: '/cases',
    data: payload,
  }).then(normalizeCase)
}

export function uploadCaseFilesApi(caseId: string, files: File[]) {
  const form = new FormData()
  files.forEach((file) => form.append('files', file))
  return apiRequest<
    Array<{ id: string; name: string; size: number; type: string; url: string }>
  >({
    method: 'POST',
    url: `/cases/${caseId}/files`,
    data: form,
  })
}

export function fetchCasePrepayment(caseId: string) {
  return apiRequest<CasePrepaymentInvoiceApi>({
    method: 'GET',
    url: `/cases/${caseId}/prepayment`,
  })
}

export function payCasePrepayment(caseId: string) {
  return apiRequest<{ id: string; paymentStatus: 'paid'; paidAt?: string }>({
    method: 'POST',
    url: `/cases/${caseId}/prepayment/pay`,
  })
}
