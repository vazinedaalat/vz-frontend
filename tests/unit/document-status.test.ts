import { describe, expect, it } from 'vitest'
import {
  documentNeedsFinalPayment,
  documentNeedsPrepayment,
  documentStatusLabel,
  documentStatusProgress,
  documentTypeLabel,
  isDocumentPending,
  normalizeDocumentStatus,
} from '@/features/app/lib/document-status'

describe('document-status', () => {
  it('maps API statuses to Persian labels', () => {
    expect(documentStatusLabel('awaiting_prepayment')).toBe('در انتظار پیش‌پرداخت')
    expect(documentStatusLabel('submitted')).toBe('ثبت‌شده')
    expect(documentStatusLabel('awaiting_final_payment')).toBe('در انتظار پرداخت کل')
    expect(documentStatusLabel('in_progress')).toBe('در حال تنظیم')
    expect(documentStatusLabel('review')).toBe('در بازبینی')
    expect(documentStatusLabel('ready')).toBe('آماده تحویل')
    expect(documentStatusLabel('delivered')).toBe('تحویل‌شده')
    expect(documentStatusLabel('rejected')).toBe('رد شده')
  })

  it('treats unknown status as awaiting_prepayment', () => {
    expect(normalizeDocumentStatus('weird')).toBe('awaiting_prepayment')
    expect(documentStatusLabel(undefined)).toBe('در انتظار پیش‌پرداخت')
  })

  it('flags pending vs closed statuses', () => {
    expect(isDocumentPending('submitted')).toBe(true)
    expect(isDocumentPending('awaiting_final_payment')).toBe(true)
    expect(isDocumentPending('ready')).toBe(true)
    expect(isDocumentPending('delivered')).toBe(false)
    expect(isDocumentPending('rejected')).toBe(false)
  })

  it('detects payment steps', () => {
    expect(documentNeedsPrepayment('awaiting_prepayment')).toBe(true)
    expect(documentNeedsFinalPayment('awaiting_final_payment')).toBe(true)
    expect(documentNeedsPrepayment('submitted')).toBe(false)
  })

  it('computes progress and type labels', () => {
    expect(documentStatusProgress('awaiting_prepayment')).toBeGreaterThan(0)
    expect(documentStatusProgress('delivered')).toBe(100)
    expect(documentTypeLabel('petition')).toBe('دادخواست')
    expect(documentTypeLabel('power-of-attorney')).toContain('وکالت')
  })
})
