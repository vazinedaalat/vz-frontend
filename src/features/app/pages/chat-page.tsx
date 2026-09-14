import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, FolderOpen, MessageCirclePlus, SendHorizontal, Shield } from 'lucide-react'
import { z } from 'zod'
import { Button, Input, Textarea } from '@/components/ui'
import { cn } from '@/lib/utils'
import { toPersianDigits } from '@/lib/format'
import { chatMessageSchema, ticketSchema, type TicketValues } from '../schemas'
import { getCaseChats, getTickets } from '../mocks/data'
import { AppEmptyState } from '../components/app-empty-state'
import { Field } from '../components/field'
import { PageHeader } from '../components/page-header'
import type { ChatMessage, SupportTicket } from '../types'

type ChatForm = z.infer<typeof chatMessageSchema>
type MobilePane = 'list' | 'thread' | 'compose'
type ChatTab = 'cases' | 'support'

const selectClassName =
  'h-11 w-full rounded-xl border border-navy-200 bg-white px-3.5 text-sm shadow-soft focus-visible:border-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/30'

export default function ChatPage() {
  const caseChats = useMemo(() => getCaseChats(), [])
  const initialTickets = useMemo(() => getTickets(), [])
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets)
  const [activeId, setActiveId] = useState<string | null>(initialTickets[0]?.id ?? null)
  const [mobilePane, setMobilePane] = useState<MobilePane>('list')
  const [tab, setTab] = useState<ChatTab>('cases')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const active = tickets.find((item) => item.id === activeId) ?? null

  const ticketForm = useForm<TicketValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { subject: '', category: 'عمومی', message: '' },
  })

  const chatForm = useForm<ChatForm>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: { body: '' },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [active?.messages.length, mobilePane, activeId])

  const openThread = (id: string) => {
    setActiveId(id)
    setTab('support')
    setMobilePane('thread')
  }

  const createTicket = ticketForm.handleSubmit((values) => {
    const id = `tkt-${Date.now()}`
    const ticket: SupportTicket = {
      id,
      subject: values.subject,
      category: values.category,
      status: 'open',
      statusLabel: 'باز',
      updatedAt: 'اکنون',
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'user',
          body: values.message,
          createdAt: 'اکنون',
        },
      ],
    }
    setTickets((prev) => [ticket, ...prev])
    setActiveId(id)
    setTab('support')
    setMobilePane('thread')
    ticketForm.reset()
  })

  const sendMessage = chatForm.handleSubmit((values) => {
    if (!activeId) return
    const message: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'user',
      body: values.body,
      createdAt: 'اکنون',
    }
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === activeId
          ? { ...ticket, messages: [...ticket.messages, message], updatedAt: 'اکنون' }
          : ticket,
      ),
    )
    chatForm.reset()
  })

  return (
    <div className="space-y-5 md:space-y-8">
      <div className={cn(mobilePane !== 'list' && 'hidden md:block')}>
        <PageHeader
          eyebrow="پیام‌ها"
          title="چت پرونده‌ها و پشتیبانی"
          description="هر پرونده چت اختصاصی پیگیری دارد. برای مسائل عمومی هم می‌توانید تیکت پشتیبانی بسازید."
        />

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-navy-200 bg-white p-1.5 shadow-soft">
          <button
            type="button"
            onClick={() => {
              setTab('cases')
              setMobilePane('list')
            }}
            className={cn(
              'min-h-11 rounded-xl px-3 py-2 text-sm font-semibold transition-colors',
              tab === 'cases' ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50',
            )}
          >
            چت پرونده‌ها
            {caseChats.length > 0 ? (
              <span className="mr-1 text-xs opacity-80">({toPersianDigits(caseChats.length)})</span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => setTab('support')}
            className={cn(
              'min-h-11 rounded-xl px-3 py-2 text-sm font-semibold transition-colors',
              tab === 'support' ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50',
            )}
          >
            پشتیبانی عمومی
          </button>
        </div>
      </div>

      {tab === 'cases' ? (
        <div className={cn('space-y-3', mobilePane === 'thread' && 'hidden md:block')}>
          {caseChats.length > 0 ? (
            <ul className="grid gap-3 md:grid-cols-2">
              {caseChats.map((chat) => (
                <li key={chat.id}>
                  <Link
                    to={`/app/cases/${chat.caseId}/chat`}
                    className="flex h-full flex-col rounded-2xl border border-navy-200 bg-white p-4 shadow-soft transition-all hover:border-gold-400 hover:shadow-lift"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[0.7rem] font-semibold text-gold-700">{chat.caseNumber}</p>
                        <h3 className="font-display mt-1 text-sm font-bold text-navy-900">{chat.caseTitle}</h3>
                      </div>
                      {chat.unreadCount > 0 ? (
                        <span className="shrink-0 rounded-full bg-navy-900 px-2 py-0.5 text-[0.65rem] font-semibold text-gold-300">
                          {toPersianDigits(chat.unreadCount)} جدید
                        </span>
                      ) : (
                        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
                          <FolderOpen className="size-4" aria-hidden />
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-navy-500">
                      {chat.lawyerName} · {chat.updatedAt}
                    </p>
                    {chat.messages.at(-1) ? (
                      <p className="mt-2 line-clamp-2 text-xs leading-6 text-navy-600">
                        {chat.messages.at(-1)!.body}
                      </p>
                    ) : null}
                    <span className="mt-3 text-xs font-semibold text-navy-800">ورود به چت پیگیری</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <AppEmptyState
              title="چت پرونده‌ای نیست"
              description="با ایجاد پرونده، کانال چت پیگیری به‌صورت خودکار فعال می‌شود."
              action={
                <Button variant="accent" asChild>
                  <Link to="/app/cases/new">ایجاد پرونده</Link>
                </Button>
              }
            />
          )}
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr] xl:gap-6">
          <div className={cn('space-y-5', mobilePane === 'thread' ? 'hidden md:block' : 'block')}>
            <AnimatePresence mode="wait" initial={false}>
              {mobilePane === 'compose' ? (
                <motion.div
                  key="compose-mobile"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="md:hidden"
                >
                  <ComposeTicketCard
                    form={ticketForm}
                    onSubmit={createTicket}
                    onCancel={() => setMobilePane('list')}
                    showCancel
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className={cn(mobilePane === 'compose' && 'hidden md:block')}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="font-display text-base font-bold text-navy-900">تیکت‌های پشتیبانی</h2>
                <Button
                  type="button"
                  variant="accent"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setMobilePane('compose')}
                >
                  <MessageCirclePlus className="size-4" aria-hidden />
                  تیکت جدید
                </Button>
              </div>

              {tickets.length > 0 ? (
                <ul className="space-y-2.5">
                  {tickets.map((ticket) => (
                    <li key={ticket.id}>
                      <button
                        type="button"
                        onClick={() => openThread(ticket.id)}
                        className={cn(
                          'w-full rounded-2xl border p-4 text-start transition-all duration-200',
                          'min-h-14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/40',
                          activeId === ticket.id
                            ? 'border-gold-400 bg-gold-100/60 shadow-soft'
                            : 'border-navy-200 bg-white hover:border-gold-300 hover:shadow-soft',
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-semibold leading-6 text-navy-900">{ticket.subject}</p>
                          <StatusChip label={ticket.statusLabel} status={ticket.status} />
                        </div>
                        <p className="mt-2 text-xs text-navy-500">
                          {ticket.category} · {ticket.updatedAt}
                        </p>
                        {ticket.messages.at(-1) ? (
                          <p className="mt-2 line-clamp-2 text-xs leading-6 text-navy-600">
                            {ticket.messages.at(-1)!.body}
                          </p>
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <AppEmptyState title="تیکتی نیست" description="اولین تیکت را ثبت کنید تا گفتگو آغاز شود." />
              )}
            </div>

            <div className="hidden md:block">
              <ComposeTicketCard form={ticketForm} onSubmit={createTicket} />
            </div>
          </div>

          <section
            className={cn(
              'flex flex-col overflow-hidden rounded-[1.5rem] border border-navy-200 bg-white shadow-soft',
              mobilePane === 'thread'
                ? 'fixed inset-x-0 top-0 bottom-[4.25rem] z-30 md:static md:inset-auto md:z-auto md:min-h-[32rem]'
                : 'hidden min-h-[28rem] md:flex',
            )}
          >
            {active ? (
              <>
                <div className="flex items-start gap-3 border-b border-navy-100 bg-navy-50/40 px-4 py-3.5 sm:px-5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-0.5 shrink-0 md:hidden"
                    aria-label="بازگشت به فهرست تیکت‌ها"
                    onClick={() => setMobilePane('list')}
                  >
                    <ArrowRight className="size-5" />
                  </Button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display truncate text-base font-bold text-navy-900 sm:text-lg">
                        {active.subject}
                      </h2>
                      <StatusChip label={active.statusLabel} status={active.status} />
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-navy-500">
                      <Shield className="size-3.5 text-gold-600" aria-hidden />
                      پشتیبانی حقوقی · {active.category}
                    </p>
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto bg-navy-50/40 px-4 py-4 sm:px-5">
                  {active.messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-soft sm:max-w-[80%]',
                        message.sender === 'user'
                          ? 'ms-auto rounded-es-md bg-navy-900 text-white'
                          : message.sender === 'admin'
                            ? 'me-auto rounded-ee-md border border-gold-200 bg-gold-100 text-navy-900'
                            : 'mx-auto bg-navy-50 text-navy-600',
                      )}
                    >
                      {message.sender === 'admin' ? (
                        <p className="mb-1 text-[0.65rem] font-semibold text-gold-700">پاسخ کارشناس</p>
                      ) : null}
                      {message.body}
                      <p
                        className={cn(
                          'mt-1.5 text-[0.65rem]',
                          message.sender === 'user' ? 'text-white/55' : 'text-navy-400',
                        )}
                      >
                        {message.createdAt}
                      </p>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={sendMessage}
                  className="border-t border-navy-100 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4"
                >
                  <div className="flex items-end gap-2">
                    <div className="min-w-0 flex-1">
                      <label htmlFor="chat-body" className="sr-only">
                        متن پیام
                      </label>
                      <Input
                        id="chat-body"
                        placeholder="پیام خود را بنویسید…"
                        className="min-h-11"
                        {...chatForm.register('body')}
                      />
                      {chatForm.formState.errors.body ? (
                        <p className="mt-1 text-xs text-destructive" role="alert">
                          {chatForm.formState.errors.body.message}
                        </p>
                      ) : null}
                    </div>
                    <Button type="submit" variant="accent" size="icon" className="size-11 shrink-0" aria-label="ارسال پیام">
                      <SendHorizontal className="size-4" />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-6">
                <AppEmptyState
                  title="گفتگویی انتخاب نشده"
                  description="یک تیکت را انتخاب کنید یا تیکت جدید بسازید."
                />
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

function StatusChip({ label, status }: { label: string; status: SupportTicket['status'] }) {
  return (
    <span
      className={cn(
        'shrink-0 rounded-lg px-2 py-0.5 text-[0.65rem] font-semibold',
        status === 'answered' && 'bg-gold-100 text-gold-700',
        status === 'open' && 'bg-navy-900 text-gold-300',
        status === 'pending' && 'bg-navy-100 text-navy-600',
        status === 'closed' && 'bg-navy-50 text-navy-400',
      )}
    >
      {label}
    </span>
  )
}

function ComposeTicketCard({
  form,
  onSubmit,
  onCancel,
  showCancel = false,
}: {
  form: UseFormReturn<TicketValues>
  onSubmit: () => void
  onCancel?: () => void
  showCancel?: boolean
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-bold text-navy-900">تیکت جدید</h2>
          <p className="mt-1 text-xs leading-6 text-navy-500">موضوع را دقیق بنویسید تا سریع‌تر پاسخ بگیرید.</p>
        </div>
        {showCancel ? (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            انصراف
          </Button>
        ) : null}
      </div>
      <Field label="موضوع" htmlFor="subject" required error={form.formState.errors.subject?.message}>
        <Input id="subject" {...form.register('subject')} />
      </Field>
      <Field label="دسته‌بندی" htmlFor="category" required error={form.formState.errors.category?.message}>
        <select id="category" className={selectClassName} {...form.register('category')}>
          <option value="عمومی">عمومی</option>
          <option value="مالی">مالی</option>
          <option value="فنی">فنی</option>
          <option value="پرونده">پرونده</option>
        </select>
      </Field>
      <Field label="پیام" htmlFor="message" required error={form.formState.errors.message?.message}>
        <Textarea id="message" rows={4} {...form.register('message')} />
      </Field>
      <Button type="submit" variant="accent" className="w-full" size="lg">
        ثبت تیکت و شروع گفتگو
      </Button>
    </form>
  )
}
