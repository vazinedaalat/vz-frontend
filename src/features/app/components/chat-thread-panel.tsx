import { useEffect, useRef, type ReactNode } from 'react'
import { Clock3, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toPersianDigits } from '@/lib/format'
import { formatFaDateTime } from '@/lib/jalali'
import { ChatAttachmentList, ChatComposer } from './chat-composer'
import type { ChatMessage, ChatSendPayload } from '../types'

interface ChatThreadPanelProps {
  title: string
  subtitle: string
  messages: ChatMessage[]
  onSend: (payload: ChatSendPayload) => void
  className?: string
  headerStart?: ReactNode
  emptyHint?: string
  placeholder?: string
  /** Last activity time shown in Persian under the title. */
  updatedAt?: string
  /** Mobile immersive fill above bottom nav with clipped bottom edge. */
  immersive?: boolean
  /** Hide paperclip when attachments are not supported for this thread. */
  allowAttachments?: boolean
}

/** App-style message thread: sticky header, scroll body, docked composer with bottom cut. */
export function ChatThreadPanel({
  title,
  subtitle,
  messages,
  onSend,
  className,
  headerStart,
  emptyHint = 'هنوز پیامی رد و بدل نشده است. اولین پیام را بفرستید.',
  placeholder = 'پیام یا فایل پیگیری را ارسال کنید…',
  updatedAt,
  immersive = false,
  allowAttachments = true,
}: ChatThreadPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = messagesEndRef.current
    if (!node) return
    node.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length])

  const lastActivity = updatedAt ?? messages.at(-1)?.createdAt

  return (
    <section
      className={cn(
        'relative flex min-w-0 flex-col overflow-hidden border border-navy-200 bg-white shadow-soft',
        immersive
          ? [
              'max-md:fixed max-md:inset-x-0 max-md:top-14 max-md:bottom-[4.5rem] max-md:z-30',
              'max-md:rounded-t-[1.35rem] max-md:border-x-0 max-md:border-b-0 max-md:shadow-lift',
              'md:static md:inset-auto md:z-auto md:h-[min(70vh,42rem)] md:max-h-[min(70vh,42rem)] md:rounded-[1.5rem]',
            ].join(' ')
          : 'h-[min(70vh,36rem)] max-h-[70vh] rounded-[1.5rem]',
        className,
      )}
    >
      <header className="relative z-20 flex shrink-0 items-start gap-2.5 border-b border-navy-100 bg-white/95 px-3 py-3 backdrop-blur-xl sm:gap-3 sm:px-5 sm:py-3.5">
        {headerStart}
        <div className="min-w-0 flex-1 overflow-hidden">
          <h2 className="font-display truncate text-base font-bold text-navy-900 sm:text-lg">
            {toPersianDigits(title)}
          </h2>
          <p className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-navy-500">
            <Shield className="size-3.5 shrink-0 text-gold-600" aria-hidden />
            <span className="truncate">{toPersianDigits(subtitle)}</span>
          </p>
          {lastActivity ? (
            <p className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[0.7rem] text-navy-400">
              <Clock3 className="size-3 shrink-0 text-gold-600" aria-hidden />
              <span className="truncate">آخرین فعالیت: {formatFaDateTime(lastActivity)}</span>
            </p>
          ) : null}
        </div>
      </header>

      <div
        ref={scrollerRef}
        className={cn(
          'relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 py-4 sm:px-5',
          'bg-navy-50/50 bg-[radial-gradient(circle_at_1px_1px,var(--color-navy-200)_1px,transparent_0)] bg-size-[18px_18px]',
        )}
      >
        {messages.length === 0 ? (
          <div className="flex h-full min-h-48 flex-col items-center justify-center px-6 text-center">
            <span className="mb-3 inline-flex size-12 items-center justify-center rounded-2xl bg-navy-900 text-gold-300">
              <Shield className="size-5" aria-hidden />
            </span>
            <p className="text-sm leading-7 text-navy-500">{emptyHint}</p>
          </div>
        ) : (
          <div className="mx-auto flex w-full min-w-0 max-w-2xl flex-col gap-2.5">
            {messages.map((message, index) => {
              const prev = messages[index - 1]
              const showMeta = !prev || prev.sender !== message.sender
              return <ChatBubble key={message.id} message={message} showMeta={showMeta} />
            })}
            <div ref={messagesEndRef} className="h-px w-full shrink-0" />
          </div>
        )}
      </div>

      <div className="shrink-0">
        <ChatComposer
          onSend={onSend}
          placeholder={placeholder}
          allowAttachments={allowAttachments}
        />
      </div>
    </section>
  )
}

function ChatBubble({ message, showMeta }: { message: ChatMessage; showMeta: boolean }) {
  const isUser = message.sender === 'user'
  const isAdmin = message.sender === 'admin'
  const isSystem = message.sender === 'system'

  if (isSystem) {
    return (
      <div className="mx-auto w-full min-w-0 max-w-[92%] rounded-2xl border border-navy-100 bg-white/90 px-3.5 py-2.5 text-center text-xs leading-6 text-navy-500 shadow-soft">
        {message.body && message.body !== '(فایل پیوست)' ? (
          <p className="break-words [overflow-wrap:anywhere] whitespace-pre-wrap">{message.body}</p>
        ) : null}
        <p className="mt-1 text-[0.65rem] text-navy-400">{formatFaDateTime(message.createdAt)}</p>
      </div>
    )
  }

  return (
    <div className={cn('flex w-full min-w-0', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'min-w-0 max-w-[min(85%,22rem)] px-3.5 py-2.5 text-sm leading-7 shadow-soft sm:max-w-[min(75%,28rem)]',
          isUser && 'rounded-2xl rounded-es-md bg-navy-900 text-white',
          isAdmin && 'rounded-2xl rounded-ee-md border border-gold-200/80 bg-gold-100 text-navy-900',
        )}
      >
        {isAdmin && showMeta ? (
          <p className="mb-1 text-[0.65rem] font-semibold text-gold-700">پاسخ وکیل / کارشناس</p>
        ) : null}
        {message.body && message.body !== '(فایل پیوست)' ? (
          <p className="break-words [overflow-wrap:anywhere] whitespace-pre-wrap">{message.body}</p>
        ) : null}
        {message.attachments?.length ? (
          <ChatAttachmentList attachments={message.attachments} tone={isUser ? 'dark' : 'light'} />
        ) : null}
        <p className={cn('mt-1.5 text-end text-[0.65rem]', isUser ? 'text-white/55' : 'text-navy-400')}>
          {formatFaDateTime(message.createdAt)}
        </p>
      </div>
    </div>
  )
}
