import type { DocumentRequestStatus, DocumentRequestType } from '../types'
import { DOCUMENT_TYPE_OPTIONS } from '../constants/nav'

export const DOCUMENT_STATUS_LABEL: Record<DocumentRequestStatus, string> = {
  awaiting_prepayment: 'در انتظار پیش‌پرداخت',
  submitted: 'ثبت‌شده',
  awaiting_final_payment: 'در انتظار پرداخت کل',
  in_progress: 'در حال تنظیم',
  review: 'در بازبینی',
  ready: 'آماده تحویل',
  delivered: 'تحویل‌شده',
  rejected: 'رد شده',
}

/** Short UX hint under the status chip. */
export const DOCUMENT_STATUS_HINT: Record<DocumentRequestStatus, string> = {
  awaiting_prepayment: 'برای ارسال درخواست به صف بررسی، پیش‌پرداخت را واریز کنید.',
  submitted: 'پیش‌پرداخت دریافت شد؛ ادمین در حال بررسی و اعلام مبلغ کل است.',
  awaiting_final_payment: 'مبلغ کل اعلام شد؛ پس از پرداخت مابه‌التفاوت، تنظیم سند آغاز می‌شود.',
  in_progress: 'تیم حقوقی در حال تنظیم پیش‌نویس سند است.',
  review: 'پیش‌نویس برای بازبینی نهایی آماده می‌شود.',
  ready: 'سند آماده است؛ از پنل پیگیری کنید.',
  delivered: 'سند به شما تحویل داده شده است.',
  rejected: 'درخواست رد شده؛ در صورت نیاز دوباره ثبت کنید.',
}

const STATUS_ORDER: DocumentRequestStatus[] = [
  'awaiting_prepayment',
  'submitted',
  'awaiting_final_payment',
  'in_progress',
  'review',
  'ready',
  'delivered',
]

export function normalizeDocumentStatus(
  status: string | undefined | null,
): DocumentRequestStatus {
  if (!status) return 'awaiting_prepayment'
  if (status in DOCUMENT_STATUS_LABEL) return status as DocumentRequestStatus
  return 'awaiting_prepayment'
}

export function documentStatusLabel(status: string | undefined | null): string {
  const key = normalizeDocumentStatus(status)
  return DOCUMENT_STATUS_LABEL[key]
}

export function documentStatusHint(status: string | undefined | null): string {
  return DOCUMENT_STATUS_HINT[normalizeDocumentStatus(status)]
}

export function documentStatusChipClass(status: string | undefined | null): string {
  switch (normalizeDocumentStatus(status)) {
    case 'delivered':
      return 'bg-navy-100 text-navy-800'
    case 'ready':
      return 'bg-gold-100 text-gold-700'
    case 'rejected':
      return 'bg-destructive/10 text-destructive'
    case 'review':
      return 'bg-navy-50 text-navy-700'
    case 'in_progress':
      return 'bg-gold-100/80 text-gold-700'
    case 'awaiting_final_payment':
      return 'bg-gold-100 text-gold-800'
    case 'awaiting_prepayment':
      return 'bg-amber-50 text-amber-800'
    case 'submitted':
    default:
      return 'bg-navy-50 text-navy-600'
  }
}

/** 0–100 progress for the visual track (rejected stays at last known step feel). */
export function documentStatusProgress(status: string | undefined | null): number {
  const key = normalizeDocumentStatus(status)
  if (key === 'rejected') return 25
  const index = STATUS_ORDER.indexOf(key)
  if (index < 0) return 10
  return Math.round(((index + 1) / STATUS_ORDER.length) * 100)
}

/** Still open for the client — not finished or rejected. */
export function isDocumentPending(status: string | undefined | null): boolean {
  const key = normalizeDocumentStatus(status)
  return key !== 'delivered' && key !== 'rejected'
}

export function documentNeedsPrepayment(status: string | undefined | null): boolean {
  return normalizeDocumentStatus(status) === 'awaiting_prepayment'
}

export function documentNeedsFinalPayment(status: string | undefined | null): boolean {
  return normalizeDocumentStatus(status) === 'awaiting_final_payment'
}

export function documentTypeLabel(type: DocumentRequestType | string): string {
  const found = DOCUMENT_TYPE_OPTIONS.find((o) => o.value === type)
  return found?.label ?? type
}

/** Fixed client-side display amount when API not yet loaded (must match Nest constant). */
export const DOCUMENT_PREPAYMENT_AMOUNT = 750_000
