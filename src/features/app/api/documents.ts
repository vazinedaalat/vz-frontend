import { apiRequest } from '@/services/api'
import { normalizeFileName } from '../lib/filename'
import type { DocumentRequestValues } from '../schemas'
import type { DocumentPaymentInfo, DocumentRequestType } from '../types'

export interface DocumentRequestListItem {
  id: string
  documentType: DocumentRequestType
  plaintiffName: string
  claimTitle: string
  /** Backend status key — display via documentStatusLabel (Persian). */
  status: string
  payment?: DocumentPaymentInfo
  createdAt: string
  updatedAt: string
  files: Array<{ id: string; name: string; size: number; type: string }>
}

export type DocumentRequestDetail = DocumentRequestListItem & {
  plaintiffFatherName?: string
  plaintiffNationalId?: string
  plaintiffAddress?: string
  defendantName?: string
  defendantAddress?: string
  defendantPhone?: string | null
  claimAmount?: string | null
  claimBasis?: string
  courtRequest?: string
  evidenceSummary?: string
  notes?: string | null
  payment: DocumentPaymentInfo
}

function normalizeDocument<T extends DocumentRequestListItem>(item: T): T {
  return {
    ...item,
    files: (item.files ?? []).map((file) => ({
      ...file,
      name: normalizeFileName(file.name),
    })),
  }
}

export function fetchDocumentPricing() {
  return apiRequest<{
    prepaymentAmount: number
    currencyLabel: string
    prepaymentItems?: Array<{ label: string; amount: number }>
    updatedAt?: string
  }>({ method: 'GET', url: '/documents/pricing' })
}

export function fetchDocuments() {
  return apiRequest<DocumentRequestListItem[]>({ method: 'GET', url: '/documents' }).then((rows) =>
    rows.map(normalizeDocument),
  )
}

export function fetchDocumentById(id: string) {
  return apiRequest<DocumentRequestDetail>({ method: 'GET', url: `/documents/${id}` }).then(
    normalizeDocument,
  )
}

export function createDocumentRequest(payload: DocumentRequestValues, files: File[]) {
  const form = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    form.append(key, typeof value === 'boolean' ? String(value) : String(value))
  })
  files.forEach((file) => form.append('files', file, file.name))
  return apiRequest<DocumentRequestDetail>({
    method: 'POST',
    url: '/documents',
    data: form,
  }).then(normalizeDocument)
}

export function payDocumentPrepayment(id: string, discountCode?: string) {
  return apiRequest<DocumentRequestDetail>({
    method: 'POST',
    url: `/documents/${id}/prepayment/pay`,
    data: discountCode?.trim() ? { discountCode: discountCode.trim() } : {},
  }).then(normalizeDocument)
}

export function payDocumentFinal(id: string, discountCode?: string) {
  return apiRequest<DocumentRequestDetail>({
    method: 'POST',
    url: `/documents/${id}/final-payment/pay`,
    data: discountCode?.trim() ? { discountCode: discountCode.trim() } : {},
  }).then(normalizeDocument)
}
