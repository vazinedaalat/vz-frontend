import { useEffect, useRef, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SendHorizontal, Shield } from 'lucide-react'
import { z } from 'zod'
import { Button, Input } from '@/components/ui'
import { cn } from '@/lib/utils'
import { chatMessageSchema } from '../schemas'
import type { ChatMessage } from '../types'

type ChatForm = z.infer<typeof chatMessageSchema>

interface ChatThreadPanelProps {
  title: string
  subtitle: string
  messages: ChatMessage[]
  onSend: (body: string) => void
  className?: string
  headerStart?: ReactNode
  emptyHint?: string
}

/** Shared message thread + composer for case follow-up and support chats. */
export function ChatThreadPanel({
  title,
  subtitle,
  messages,
  onSend,
  className,
  headerStart,
  emptyHint = 'هنوز پیامی رد و بدل نشده است.',
}: ChatThreadPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const form = useForm<ChatForm>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: { body: '' },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length])

  const submit = form.handleSubmit((values) => {
    onSend(values.body)
    form.reset()
  })

  return (
    <section
      className={cn(
        'flex min-h-[28rem] flex-col overflow-hidden rounded-[1.5rem] border border-navy-200 bg-white shadow-soft',
        className,
      )}
    >
      <div className="flex items-start gap-3 border-b border-navy-100 bg-navy-50/50 px-4 py-3.5 sm:px-5">
        {headerStart}
        <div className="min-w-0 flex-1">
          <h2 className="font-display truncate text-base font-bold text-navy-900 sm:text-lg">{title}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-navy-500">
            <Shield className="size-3.5 shrink-0 text-gold-600" aria-hidden />
            <span className="truncate">{subtitle}</span>
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-navy-50/40 px-4 py-4 sm:px-5">
        {messages.length === 0 ? (
          <p className="py-10 text-center text-sm text-navy-500">{emptyHint}</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-soft sm:max-w-[80%]',
                message.sender === 'user'
                  ? 'ms-auto rounded-es-md bg-navy-900 text-white'
                  : message.sender === 'admin'
                    ? 'me-auto rounded-ee-md border border-gold-200 bg-gold-100 text-navy-900'
                    : 'mx-auto max-w-[95%] border border-navy-100 bg-white text-navy-600',
              )}
            >
              {message.sender === 'admin' ? (
                <p className="mb-1 text-[0.65rem] font-semibold text-gold-700">پاسخ وکیل / کارشناس</p>
              ) : null}
              {message.sender === 'system' ? (
                <p className="mb-1 text-[0.65rem] font-semibold text-navy-400">پیام سامانه</p>
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
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={submit}
        className="border-t border-navy-100 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4"
      >
        <div className="flex items-end gap-2">
          <div className="min-w-0 flex-1">
            <label htmlFor="thread-chat-body" className="sr-only">
              متن پیام
            </label>
            <Input
              id="thread-chat-body"
              placeholder="پیام پیگیری خود را بنویسید…"
              className="min-h-11"
              {...form.register('body')}
            />
            {form.formState.errors.body ? (
              <p className="mt-1 text-xs text-destructive" role="alert">
                {form.formState.errors.body.message}
              </p>
            ) : null}
          </div>
          <Button type="submit" variant="accent" size="icon" className="size-11 shrink-0" aria-label="ارسال پیام">
            <SendHorizontal className="size-4" />
          </Button>
        </div>
      </form>
    </section>
  )
}
