import { describe, expect, it } from 'vitest'
import {
  documentStatusLabel,
  documentStatusProgress,
  documentTypeLabel,
  isDocumentPending,
  normalizeDocumentStatus,
} from '@/features/app/lib/document-status'

describe('document-status', () => {
  it('maps API statuses to Persian labels', () => {
    expect(documentStatusLabel('submitted')).toBe('ثبت‌شده')
    expect(documentStatusLabel('in_progress')).toBe('در حال تنظیم')
    expect(documentStatusLabel('review')).toBe('در بازبینی')
    expect(documentStatusLabel('ready')).toBe('آماده تحویل')
    expect(documentStatusLabel('delivered')).toBe('تحویل‌شده')
    expect(documentStatusLabel('rejected')).toBe('رد شده')
  })

  it('treats unknown status as submitted', () => {
    expect(normalizeDocumentStatus('weird')).toBe('submitted')
    expect(documentStatusLabel(undefined)).toBe('ثبت‌شده')
  })

  it('flags pending vs closed statuses', () => {
    expect(isDocumentPending('submitted')).toBe(true)
    expect(isDocumentPending('ready')).toBe(true)
    expect(isDocumentPending('delivered')).toBe(false)
    expect(isDocumentPending('rejected')).toBe(false)
  })

  it('computes progress and type labels', () => {
    expect(documentStatusProgress('submitted')).toBeGreaterThan(0)
    expect(documentStatusProgress('delivered')).toBe(100)
    expect(documentTypeLabel('petition')).toBe('دادخواست')
    expect(documentTypeLabel('power-of-attorney')).toContain('وکالت')
  })
})
