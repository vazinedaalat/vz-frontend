import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, FileText } from 'lucide-react'
import { Button } from '@/components/ui'
import { ErrorBadge } from '@/components/shared/error-badge'
import { formatFaDateTime } from '@/lib/jalali'
import { formatFaNumber } from '@/lib/format'
import { isMockEnabled } from '@/config/env'
import { AppError } from '@/services/api/errors'
import {
  appKeys,
  fetchDocumentById,
  payDocumentFinal,
  payDocumentPrepayment,
} from '../api'
import { AppEmptyState } from '../components/app-empty-state'
import { DocumentPaymentPanel } from '../components/document-payment-panel'
import { DocumentStatusChip } from '../components/document-status-chip'
import { PageHeader } from '../components/page-header'
import {
  documentNeedsFinalPayment,
  documentNeedsPrepayment,
  documentStatusHint,
  documentTypeLabel,
} from '../lib/document-status'

export default function DocumentDetailPage() {
  const { documentId = '' } = useParams()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: appKeys.document(documentId),
    queryFn: () => fetchDocumentById(documentId),
    enabled: Boolean(documentId) && !isMockEnabled,
  })

  const payPre = useMutation({
    mutationFn: (discountCode?: string) => payDocumentPrepayment(documentId, discountCode),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: appKeys.document(documentId) })
      await queryClient.invalidateQueries({ queryKey: appKeys.documents })
    },
  })

  const payFinal = useMutation({
    mutationFn: (discountCode?: string) => payDocumentFinal(documentId, discountCode),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: appKeys.document(documentId) })
      await queryClient.invalidateQueries({ queryKey: appKeys.documents })
    },
  })

  if (isMockEnabled) {
    return (
      <AppEmptyState
        title="جزئیات سند"
        description="در حالت موک، جزئیات پرداخت سند در دسترس نیست."
        action={
          <Button variant="outline" asChild>
            <Link to="/app/documents">بازگشت</Link>
          </Button>
        }
      />
    )
  }

  if (isLoading) {
    return <p className="text-sm text-navy-500">در حال بارگذاری…</p>
  }

  if (error || !data) {
    return (
      <AppEmptyState
        title="درخواست یافت نشد"
        description={error instanceof AppError ? error.message : 'این سند موجود نیست یا دسترسی ندارید.'}
        action={
          <Button variant="outline" asChild>
            <Link to="/app/documents">بازگشت به اسناد</Link>
          </Button>
        }
      />
    )
  }

  const payment = data.payment
  const showPrepay = documentNeedsPrepayment(data.status)
  const showFinal = documentNeedsFinalPayment(data.status)
  const payError =
    (payPre.error instanceof AppError && payPre.error.message) ||
    (payFinal.error instanceof AppError && payFinal.error.message) ||
    null

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ms-2 mb-2">
          <Link to="/app/documents">
            <ArrowRight className="size-4" />
            بازگشت به اسناد
          </Link>
        </Button>
      </div>

      <PageHeader
        eyebrow={documentTypeLabel(data.documentType)}
        title={data.claimTitle}
        description={documentStatusHint(data.status)}
        action={<DocumentStatusChip status={data.status} />}
      />

      {payError ? <ErrorBadge variant="page">{payError}</ErrorBadge> : null}

      {showPrepay && payment ? (
        <DocumentPaymentPanel
          mode="prepayment"
          payment={payment}
          claimTitle={data.claimTitle}
          paying={payPre.isPending}
          onPay={(discountCode) => payPre.mutate(discountCode)}
        />
      ) : null}

      {showFinal && payment ? (
        <DocumentPaymentPanel
          mode="final"
          payment={payment}
          claimTitle={data.claimTitle}
          paying={payFinal.isPending}
          onPay={(discountCode) => payFinal.mutate(discountCode)}
        />
      ) : null}

      {!showPrepay && !showFinal && payment ? (
        <section className="rounded-2xl border border-navy-200 bg-white p-5 shadow-soft sm:p-6">
          <h2 className="font-display text-base font-bold text-navy-900">وضعیت پرداخت</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl bg-navy-50/70 px-3 py-2.5">
              <dt className="text-navy-500">پیش‌پرداخت</dt>
              <dd className="mt-1 font-semibold text-navy-900">
                {payment.prepaymentStatus === 'paid'
                  ? `${formatFaNumber(payment.prepaymentAmount)} ${payment.currencyLabel} · پرداخت‌شده`
                  : 'در انتظار'}
              </dd>
            </div>
            <div className="rounded-xl bg-navy-50/70 px-3 py-2.5">
              <dt className="text-navy-500">مبلغ کل / مابه‌التفاوت</dt>
              <dd className="mt-1 font-semibold text-navy-900">
                {payment.totalAmount != null
                  ? payment.finalPaymentStatus === 'paid'
                    ? `تسویه · کل ${formatFaNumber(payment.totalAmount)}`
                    : `کل ${formatFaNumber(payment.totalAmount)}`
                  : 'هنوز اعلام نشده'}
              </dd>
            </div>
          </dl>
          {payment.priceDescription ? (
            <p className="mt-4 rounded-xl border border-navy-100 bg-navy-50/50 p-3 text-sm leading-7 text-navy-700">
              {payment.priceDescription}
            </p>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-2xl border border-navy-200 bg-white p-5 shadow-soft sm:p-6">
        <h2 className="font-display flex items-center gap-2 text-base font-bold text-navy-900">
          <FileText className="size-4 text-gold-600" aria-hidden />
          خلاصه درخواست
        </h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-navy-500">خواهان</dt>
            <dd className="mt-1 font-medium text-navy-900">{data.plaintiffName}</dd>
          </div>
          <div>
            <dt className="text-navy-500">خوانده</dt>
            <dd className="mt-1 font-medium text-navy-900">{data.defendantName || '—'}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-navy-500">ثبت</dt>
            <dd className="mt-1 font-medium text-navy-900">{formatFaDateTime(data.createdAt)}</dd>
          </div>
        </dl>
        {data.files?.length ? (
          <ul className="mt-4 space-y-2 border-t border-navy-100 pt-4 text-sm text-navy-600">
            {data.files.map((f) => (
              <li key={f.id} className="truncate">
                {f.name}
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  )
}
