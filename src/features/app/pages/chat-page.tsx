import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Textarea } from '@/components/ui'
import { cn } from '@/lib/utils'
import { chatMessageSchema, ticketSchema, type TicketValues } from '../schemas'
import { getTickets } from '../mocks/data'
import { AppEmptyState } from '../components/app-empty-state'
import { Field } from '../components/field'
import { PageHeader } from '../components/page-header'
import type { ChatMessage, SupportTicket } from '../types'
import { z } from 'zod'

type ChatForm = z.infer<typeof chatMessageSchema>

export default function ChatPage() {
  const initialTickets = useMemo(() => getTickets(), [])
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets)
  const [activeId, setActiveId] = useState<string | null>(initialTickets[0]?.id ?? null)
  const active = tickets.find((item) => item.id === activeId) ?? null

  const ticketForm = useForm<TicketValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { subject: '', category: 'عمومی', message: '' },
  })

  const chatForm = useForm<ChatForm>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: { body: '' },
  })

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
          : ticket
      )
    )
    chatForm.reset()
  })

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="پشتیبانی"
        title="چت آنلاین و تیکت ادمین"
        description="سوال عمومی یا پیگیری پرونده را به‌صورت تیکت ثبت کنید و گفتگو را ادامه دهید."
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <form
            onSubmit={createTicket}
            className="space-y-4 rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft"
          >
            <h2 className="font-display text-base font-bold">تیکت جدید</h2>
            <Field label="موضوع" htmlFor="subject" required error={ticketForm.formState.errors.subject?.message}>
              <Input id="subject" {...ticketForm.register('subject')} />
            </Field>
            <Field label="دسته‌بندی" htmlFor="category" required error={ticketForm.formState.errors.category?.message}>
              <select
                id="category"
                className="h-11 w-full rounded-xl border border-navy-200 bg-white px-3.5 text-sm shadow-soft focus-visible:border-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/30"
                {...ticketForm.register('category')}
              >
                <option value="عمومی">عمومی</option>
                <option value="مالی">مالی</option>
                <option value="فنی">فنی</option>
                <option value="پرونده">پرونده</option>
              </select>
            </Field>
            <Field label="پیام" htmlFor="message" required error={ticketForm.formState.errors.message?.message}>
              <Textarea id="message" {...ticketForm.register('message')} />
            </Field>
            <Button type="submit" variant="accent" className="w-full">
              ثبت تیکت
            </Button>
          </form>

          <div className="space-y-3">
            <h2 className="font-display text-base font-bold">تیکت‌های من</h2>
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => setActiveId(ticket.id)}
                  className={cn(
                    'w-full rounded-2xl border p-4 text-start transition-colors',
                    activeId === ticket.id
                      ? 'border-gold-400 bg-gold-100/50'
                      : 'border-navy-200 bg-white hover:border-gold-300'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{ticket.subject}</p>
                    <span className="text-[0.7rem] text-navy-500">{ticket.statusLabel}</span>
                  </div>
                  <p className="mt-1 text-xs text-navy-500">
                    {ticket.category} · {ticket.updatedAt}
                  </p>
                </button>
              ))
            ) : (
              <AppEmptyState title="تیکتی نیست" description="اولین تیکت را از فرم بالا ثبت کنید." />
            )}
          </div>
        </div>

        <section className="flex min-h-[28rem] flex-col rounded-[1.5rem] border border-navy-200 bg-white shadow-soft">
          {active ? (
            <>
              <div className="border-b border-navy-100 px-5 py-4">
                <h2 className="font-display font-bold">{active.subject}</h2>
                <p className="mt-1 text-xs text-navy-500">
                  {active.category} · {active.statusLabel}
                </p>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {active.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7',
                      message.sender === 'user'
                        ? 'mr-auto bg-navy-900 text-white'
                        : message.sender === 'admin'
                          ? 'ml-auto bg-gold-100 text-navy-900'
                          : 'mx-auto bg-navy-50 text-navy-600'
                    )}
                  >
                    {message.body}
                    <p
                      className={cn(
                        'mt-1 text-[0.65rem]',
                        message.sender === 'user' ? 'text-white/60' : 'text-navy-400'
                      )}
                    >
                      {message.createdAt}
                    </p>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} className="flex gap-2 border-t border-navy-100 p-4">
                <Input placeholder="پیام خود را بنویسید…" {...chatForm.register('body')} />
                <Button type="submit" variant="accent">
                  ارسال
                </Button>
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
    </div>
  )
}
