import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { toPersianDigits, formatFaNumber } from '@/lib/format'
import { getCaseById, getCaseChatByCaseId, getNotifications } from '../mocks/data'
import { AppEmptyState } from '../components/app-empty-state'
import { ChatThreadPanel } from '../components/chat-thread-panel'
import { PageHeader } from '../components/page-header'
import type { CaseChatThread, ChatMessage, ChatSendPayload } from '../types'

export default function CaseDetailPage() {
  const { caseId = '' } = useParams()
  const item = getCaseById(caseId)
  const notes = getNotifications().filter((n) => n.caseId === caseId)
  const initialChat = useMemo(() => getCaseChatByCaseId(caseId), [caseId])
  const [thread, setThread] = useState<CaseChatThread | null>(initialChat ?? null)

  if (!item) {
    return (
      <AppEmptyState
        title="پرونده پیدا نشد"
        description="این پرونده در داده‌های فعلی موجود نیست یا در محیط تولید هنوز از API نیامده است."
        action={
          <Button variant="outline" asChild>
            <Link to="/app/cases">بازگشت به فهرست</Link>
          </Button>
        }
      />
    )
  }

  const onSend = ({ body, attachments }: ChatSendPayload) => {
    const message: ChatMessage = {
      id: `cm-${Date.now()}`,
      sender: 'user',
      body,
      createdAt: 'اکنون',
      attachments: attachments.length > 0 ? attachments : undefined,
    }
    setThread((prev) =>
      prev
        ? { ...prev, updatedAt: 'اکنون', unreadCount: 0, messages: [...prev.messages, message] }
        : prev,
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={item.caseNumber}
        title={item.title}
        description={`${item.category} · وکیل مسئول: ${item.lawyerName}`}
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
        <section className="rounded-[1.5rem] border border-navy-200 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold">فرآیند پرونده</h2>
            <span className="rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-700">
              {item.statusLabel}
            </span>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex justify-between text-xs text-navy-500">
              <span>پیشرفت</span>
              <span>{formatFaNumber(item.progress)}٪</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-navy-100">
              <div className="h-full rounded-full bg-gold-500" style={{ width: `${item.progress}%` }} />
            </div>
          </div>

          <ol className="relative mt-8 space-y-0">
            {item.stages.map((stage, index) => (
              <li key={stage.id} className="relative flex gap-4 pb-8 last:pb-0">
                {index < item.stages.length - 1 ? (
                  <span
                    className={cn(
                      'absolute top-8 right-[0.95rem] h-[calc(100%-1.5rem)] w-px',
                      stage.completed ? 'bg-gold-400' : 'bg-navy-200',
                    )}
                    aria-hidden
                  />
                ) : null}
                <span
                  className={cn(
                    'relative z-10 mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border text-xs font-bold',
                    stage.completed
                      ? 'border-gold-500 bg-gold-500 text-navy-900'
                      : 'border-navy-200 bg-white text-navy-400',
                  )}
                >
                  {toPersianDigits(index + 1)}
                </span>
                <div>
                  <h3 className="font-semibold text-navy-900">{stage.title}</h3>
                  <p className="mt-1 text-sm leading-7 text-navy-600">{stage.description}</p>
                  {stage.at ? <p className="mt-1 text-xs text-navy-400">{stage.at}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="space-y-6">
          <section className="rounded-[1.5rem] border border-navy-200 bg-navy-900 p-6 text-white shadow-lift">
            <h2 className="font-display text-lg font-bold">اقدام بعدی</h2>
            <p className="mt-3 text-sm leading-7 text-white/80">{item.nextAction}</p>
            <p className="mt-4 text-xs text-white/50">آخرین به‌روزرسانی: {item.updatedAt}</p>
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
                    <p className="mt-2 text-[0.7rem] text-navy-400">{note.createdAt}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-navy-500">اطلاعیه‌ای برای این پرونده نیست.</p>
            )}
          </section>
        </div>
      </div>

      {thread ? (
        <div className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-navy-900">چت پیگیری پرونده</h2>
              <p className="mt-1 text-sm text-navy-600">هر پرونده کانال اختصاصی پیام با وکیل مسئول دارد.</p>
            </div>
            <Button variant="outline" size="sm" className="hidden sm:inline-flex" asChild>
              <Link to={`/app/cases/${item.id}/chat`}>نمای تمام‌صفحه</Link>
            </Button>
          </div>
          <ChatThreadPanel
            title={item.title}
            subtitle={`${item.caseNumber} · ${item.lawyerName}`}
            messages={thread.messages}
            onSend={onSend}
            className="min-h-[24rem]"
          />
        </div>
      ) : null}
    </div>
  )
}
