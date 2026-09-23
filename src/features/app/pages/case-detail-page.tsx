import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui'
import { formatFaDateTime } from '@/lib/jalali'
import { isMockEnabled } from '@/config/env'
import { AppError } from '@/services/api/errors'
import { appKeys, fetchCaseById, fetchNotifications } from '../api'
import { getCaseById, getNotifications } from '../mocks/data'
import { AppEmptyState } from '../components/app-empty-state'
import { CaseProcessPanel } from '../components/case-process-panel'
import { PageHeader } from '../components/page-header'
import { caseNextActionLabel, isLawyerAssigned } from '../lib/case-process'

export default function CaseDetailPage() {
  const { caseId = '' } = useParams()

  const {
    data: item,
    isLoading: caseLoading,
    error: caseError,
  } = useQuery({
    queryKey: appKeys.cases.detail(caseId),
    queryFn: () => (isMockEnabled ? Promise.resolve(getCaseById(caseId)) : fetchCaseById(caseId)),
    enabled: Boolean(caseId),
  })

  const { data: notes = [] } = useQuery({
    queryKey: appKeys.notifications,
    queryFn: isMockEnabled ? async () => getNotifications() : fetchNotifications,
    select: (items) => items.filter((n) => n.caseId === caseId),
  })

  if (caseLoading) {
    return <p className="text-sm text-navy-500">در حال بارگذاری…</p>
  }

  if (!item || caseError) {
    return (
      <AppEmptyState
        title="پرونده پیدا نشد"
        description={
          caseError instanceof AppError
            ? caseError.message
            : 'این پرونده در داده‌های فعلی موجود نیست یا در محیط تولید هنوز از API نیامده است.'
        }
        action={
          <Button variant="outline" asChild>
            <Link to="/app/cases">بازگشت به فهرست</Link>
          </Button>
        }
      />
    )
  }

  const metaLine = isLawyerAssigned(item.lawyerName)
    ? `${item.category} · وکیل مسئول: ${item.lawyerName}`
    : `${item.category} · وضعیت: ${item.statusLabel}`
  const nextAction = caseNextActionLabel(item)

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={item.caseNumber}
        title={item.title}
        description={metaLine}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="accent" asChild>
              <Link to={`/app/cases/${item.id}/chat`}>
                <MessageCircle className="size-4" aria-hidden />
                چت پیگیری
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/app/cases">همه پرونده‌ها</Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <CaseProcessPanel item={item} />

        <div className="space-y-6">
          <section className="rounded-[1.5rem] border border-navy-200 bg-navy-900 p-6 text-white shadow-lift">
            <h2 className="font-display text-lg font-bold">اقدام بعدی</h2>
            <p className="mt-3 text-sm leading-7 text-white/80">{nextAction}</p>
            <p className="mt-4 text-xs text-white/50">آخرین به‌روزرسانی: {formatFaDateTime(item.updatedAt)}</p>
            <Button asChild variant="accent" className="mt-5 w-full" size="lg">
              <Link to={`/app/cases/${item.id}/chat`}>
                <MessageCircle className="size-4" aria-hidden />
                پیام به وکیل پرونده
              </Link>
            </Button>
          </section>

          <section className="rounded-[1.5rem] border border-navy-200 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">اطلاع‌رسانی این پرونده</h2>
              <Link to="/app/notifications" className="text-xs font-medium text-gold-700">
                همه
              </Link>
            </div>
            {notes.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {notes.map((note) => (
                  <li key={note.id} className="rounded-xl border border-navy-100 bg-navy-50/70 p-3">
                    <p className="text-sm font-semibold">{note.title}</p>
                    <p className="mt-1 text-xs leading-6 text-navy-600">{note.body}</p>
                    <p className="mt-2 text-[0.7rem] text-navy-400">{formatFaDateTime(note.createdAt)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-navy-500">اطلاعیه‌ای برای این پرونده نیست.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
