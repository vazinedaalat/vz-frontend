import { apiRequest } from '@/services/api'
import type { DocumentRequestValues } from '../schemas'
import type { DocumentRequestType } from '../types'

export interface DocumentRequestListItem {
  id: string
  documentType: DocumentRequestType
  plaintiffName: string
  claimTitle: string
  status: string
  createdAt: string
  updatedAt: string
  files: Array<{ id: string; name: string; size: number; type: string }>
}

export function fetchDocuments() {
  return apiRequest<DocumentRequestListItem[]>({ method: 'GET', url: '/documents' })
}

export function createDocumentRequest(payload: DocumentRequestValues, files: File[]) {
  const form = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    form.append(key, typeof value === 'boolean' ? String(value) : String(value))
  })
  files.forEach((file) => form.append('files', file))
  return apiRequest<DocumentRequestListItem>({
    method: 'POST',
    url: '/documents',
    data: form,
  })
}
