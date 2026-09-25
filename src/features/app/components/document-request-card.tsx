import { Link } from 'react-router-dom'
import { CreditCard, FileText } from 'lucide-react'
import { formatFaNumber } from '@/lib/format'
import { formatFaDateTime } from '@/lib/jalali'
import { cn } from '@/lib/utils'
import type { DocumentRequestListItem } from '../api/documents'
import {
  documentNeedsFinalPayment,
  documentNeedsPrepayment,
  documentStatusHint,
  documentStatusProgress,
  documentTypeLabel,
} from '../lib/document-status'
import { DocumentStatusChip } from './document-status-chip'

interface DocumentRequestCardProps {
  item: DocumentRequestListItem
  className?: string
  compact?: boolean
}

export function DocumentRequestCard({ item, className, compact = false }: DocumentRequestCardProps) {
  const progress = documentStatusProgress(item.status)
  const filesCount = item.files?.length ?? 0
  const needsPay = documentNeedsPrepayment(item.status) || documentNeedsFinalPayment(item.status)

  return (
    <article
      className={cn(
        'rounded-2xl border border-navy-200 bg-white shadow-soft transition-shadow hover:shadow-lift',
        compact ? 'p-4' : 'p-5 sm:p-6',
        className,
      )}
    >
      <Link to={`/app/documents/${item.id}`} className="group block min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-navy-50 px-2 py-0.5 text-[0.65rem] font-semibold text-navy-600">
                <FileText className="size-3.5 shrink-0 text-gold-600" aria-hidden />
                {documentTypeLabel(item.documentType)}
              </span>
              <DocumentStatusChip status={item.status} />
            </div>
            <h3
              className={cn(
                'font-display mt-2.5 font-bold text-navy-900 group-hover:text-navy-800',
                compact ? 'text-sm leading-6' : 'text-base leading-7 sm:text-lg',
              )}
            >
              {item.claimTitle}
            </h3>
            {!compact ? (
              <p className="mt-1.5 text-sm leading-6 text-navy-600">{documentStatusHint(item.status)}</p>
            ) : null}
          </div>
        </div>

        <div className={cn(compact ? 'mt-3' : 'mt-4')}>
          <div className="mb-1.5 flex items-center justify-between gap-2 text-[0.7rem] text-navy-500">
            <span>روند رسیدگی</span>
            <span>{formatFaNumber(progress)}٪</span>
          </div>
          <div
            className="h-1.5 overflow-hidden rounded-full bg-navy-100"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`پیشرفت وضعیت: ${formatFaNumber(progress)} درصد`}
          >
            <div
              className="h-full rounded-full bg-gold-500 transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div
          className={cn(
            'flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-navy-100 text-xs text-navy-500',
            compact ? 'mt-3 pt-3' : 'mt-4 pt-4',
          )}
        >
          <span>ثبت: {formatFaDateTime(item.createdAt)}</span>
          {filesCount > 0 ? (
            <span className="text-navy-600">{formatFaNumber(filesCount)} پیوست</span>
          ) : null}
          {item.plaintiffName ? <span className="truncate">خواهان: {item.plaintiffName}</span> : null}
        </div>
      </Link>

      {needsPay ? (
        <div className="mt-4">
          <Link
            to={`/app/documents/${item.id}`}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 text-sm font-semibold text-gold-300 transition hover:bg-navy-800 sm:h-10 sm:w-auto"
          >
            <CreditCard className="size-4" aria-hidden />
            {documentNeedsPrepayment(item.status) ? 'پرداخت پیش‌پرداخت' : 'پرداخت مبلغ کل'}
          </Link>
        </div>
      ) : null}
    </article>
  )
}
