import { useId, useRef, useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileText, Paperclip, SendHorizontal, X } from 'lucide-react'
import { z } from 'zod'
import { Button } from '@/components/ui'
import { ErrorBadge, ErrorBadgeList } from '@/components/shared/error-badge'
import { toPersianDigits } from '@/lib/format'
import { cn } from '@/lib/utils'
import { CASE_FILE_ACCEPT, CHAT_FILE_MAX_COUNT } from '../constants/case-intake'
import { formatFileSize, mergeCaseFiles } from '../lib/case-files'
import { chatMessageSchema } from '../schemas'
import type { CaseFileMeta, ChatSendPayload } from '../types'

type ChatForm = z.infer<typeof chatMessageSchema>

interface ChatComposerProps {
  onSend: (payload: ChatSendPayload) => void
  placeholder?: string
  inputId?: string
  className?: string
}

/** Docked chat composer — rounded top cut sits above the message stream like mobile chat apps. */
export function ChatComposer({
  onSend,
  placeholder = 'پیام خود را بنویسید…',
  inputId,
  className,
}: ChatComposerProps) {
  const generatedId = useId()
  const fieldId = inputId ?? generatedId
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [attachments, setAttachments] = useState<CaseFileMeta[]>([])
  const [fileErrors, setFileErrors] = useState<string[]>([])
  const [submitError, setSubmitError] = useState<string>()

  const form = useForm<ChatForm>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: { body: '' },
  })

  const applyFiles = (list: FileList | null) => {
    if (!list?.length) return
    const result = mergeCaseFiles(attachments, Array.from(list), CHAT_FILE_MAX_COUNT)
    setAttachments(result.files)
    setFileErrors(result.errors)
  }

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    applyFiles(event.target.files)
    event.target.value = ''
  }

  const submit = form.handleSubmit((values) => {
    const body = values.body.trim()
    if (!body && attachments.length === 0) {
      setSubmitError('متن پیام یا حداقل یک فایل لازم است')
      return
    }
    setSubmitError(undefined)
    onSend({ body, attachments })
    form.reset({ body: '' })
    setAttachments([])
    setFileErrors([])
  })

  return (
    <form
      onSubmit={submit}
      className={cn(
        'relative z-10 rounded-t-[1.35rem] border border-b-0 border-navy-200/90 bg-white/95 px-3 pt-3 shadow-lift backdrop-blur-xl',
        'pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4 sm:pt-3.5',
        className,
      )}
    >
      <div className="mx-auto mb-2.5 h-1 w-10 rounded-full bg-navy-200/80 sm:hidden" aria-hidden />

      {attachments.length > 0 ? (
        <ul className="mb-2.5 flex gap-2 overflow-x-auto pb-0.5">
          {attachments.map((file) => (
            <li
              key={file.id}
              className="inline-flex max-w-[14rem] shrink-0 items-center gap-2 rounded-xl border border-navy-200 bg-navy-50 px-2.5 py-1.5 text-xs text-navy-700"
            >
              <FileText className="size-3.5 shrink-0 text-gold-700" aria-hidden />
              <span className="truncate">{file.name}</span>
              <span className="shrink-0 text-navy-400">{toPersianDigits(formatFileSize(file.size))}</span>
              <button
                type="button"
                aria-label={`حذف ${file.name}`}
                className="inline-flex size-6 items-center justify-center rounded-lg text-navy-500 hover:bg-white hover:text-destructive"
                onClick={() => setAttachments((prev) => prev.filter((item) => item.id !== file.id))}
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex items-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11 shrink-0 rounded-2xl text-navy-600 hover:bg-navy-50"
          aria-label="پیوست فایل"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="size-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={CASE_FILE_ACCEPT}
          className="sr-only"
          onChange={onFileChange}
        />

        <div className="min-w-0 flex-1">
          <label htmlFor={fieldId} className="sr-only">
            متن پیام
          </label>
          <input
            id={fieldId}
            placeholder={placeholder}
            className={cn(
              'min-h-11 w-full rounded-2xl border border-navy-200 bg-navy-50/80 px-3.5 py-2.5 text-sm text-navy-900 shadow-soft',
              'placeholder:text-navy-400',
              'focus-visible:border-gold-400 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/30',
            )}
            {...form.register('body', {
              onChange: () => setSubmitError(undefined),
            })}
          />
        </div>

        <Button type="submit" variant="accent" size="icon" className="size-11 shrink-0 rounded-2xl" aria-label="ارسال پیام">
          <SendHorizontal className="size-4" />
        </Button>
      </div>

      <ErrorBadgeList className="mt-2" messages={fileErrors} />
      {submitError || form.formState.errors.body ? (
        <ErrorBadge className="mt-2">{submitError ?? form.formState.errors.body?.message}</ErrorBadge>
      ) : null}
    </form>
  )
}

export function ChatAttachmentList({
  attachments,
  tone = 'light',
}: {
  attachments: CaseFileMeta[]
  tone?: 'light' | 'dark'
}) {
  if (attachments.length === 0) return null
  return (
    <ul className="mt-2 space-y-1.5">
      {attachments.map((file) => (
        <li
          key={file.id}
          className={cn(
            'flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs',
            tone === 'dark' ? 'bg-white/10 text-white' : 'border border-navy-200/80 bg-white/80 text-navy-800',
          )}
        >
          <FileText className={cn('size-3.5 shrink-0', tone === 'dark' ? 'text-gold-300' : 'text-gold-700')} aria-hidden />
          <span className="min-w-0 flex-1 truncate font-medium">{file.name}</span>
          <span className={cn('shrink-0', tone === 'dark' ? 'text-white/50' : 'text-navy-400')}>
            {toPersianDigits(formatFileSize(file.size))}
          </span>
        </li>
      ))}
    </ul>
  )
}
