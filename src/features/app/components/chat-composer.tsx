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
import { normalizeFileName } from '../lib/filename'
import { chatMessageSchema } from '../schemas'
import type { CaseFileMeta, ChatSendPayload } from '../types'

type ChatForm = z.infer<typeof chatMessageSchema>

interface ChatComposerProps {
  onSend: (payload: ChatSendPayload) => void
  placeholder?: string
  inputId?: string
  className?: string
  /** When false, hides the paperclip control. */
  allowAttachments?: boolean
}

/** Docked chat composer — rounded top cut sits above the message stream like mobile chat apps. */
export function ChatComposer({
  onSend,
  placeholder = 'پیام خود را بنویسید…',
  inputId,
  className,
  allowAttachments = true,
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

  const watchedBody = form.watch('body')
  const canSend = Boolean(watchedBody?.trim()) || attachments.length > 0

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
        'relative z-10 rounded-t-[1.5rem] border border-b-0 border-navy-200 bg-gradient-to-b from-white to-navy-50/40',
        'px-3 pt-3 shadow-lift backdrop-blur-xl',
        'pb-[max(0.85rem,env(safe-area-inset-bottom))] sm:px-4 sm:pt-4',
        className,
      )}
    >
      <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-navy-200/90 sm:hidden" aria-hidden />

      {attachments.length > 0 ? (
        <ul className="mb-3 flex gap-2 overflow-x-auto pb-0.5">
          {attachments.map((file) => (
            <li
              key={file.id}
              className="inline-flex max-w-[14rem] shrink-0 items-center gap-2 rounded-2xl border border-navy-200 bg-white px-2.5 py-1.5 text-xs text-navy-700 shadow-soft"
            >
              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
                <FileText className="size-3.5" aria-hidden />
              </span>
              <span className="truncate font-medium" title={normalizeFileName(file.name)}>
                {normalizeFileName(file.name)}
              </span>
              <span className="shrink-0 text-navy-400">{toPersianDigits(formatFileSize(file.size))}</span>
              <button
                type="button"
                aria-label={`حذف ${normalizeFileName(file.name)}`}
                className="inline-flex size-6 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-50 hover:text-destructive"
                onClick={() => setAttachments((prev) => prev.filter((item) => item.id !== file.id))}
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex items-end gap-2 rounded-[1.35rem] border border-navy-200 bg-white p-1.5 shadow-soft focus-within:border-gold-400 focus-within:ring-2 focus-within:ring-gold-400/25">
        <Button
          type="submit"
          variant="accent"
          size="icon"
          disabled={!canSend}
          className="size-11 shrink-0 rounded-[1.1rem] disabled:opacity-45"
          aria-label="ارسال پیام"
        >
          <SendHorizontal className="size-4" />
        </Button>

        <div className="min-w-0 flex-1 self-center">
          <label htmlFor={fieldId} className="sr-only">
            متن پیام
          </label>
          <input
            id={fieldId}
            placeholder={placeholder}
            className={cn(
              'min-h-11 w-full border-0 bg-transparent px-2 py-2.5 text-sm text-navy-900',
              'placeholder:text-navy-400',
              'focus-visible:outline-none',
            )}
            {...form.register('body', {
              onChange: () => setSubmitError(undefined),
            })}
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            'size-11 shrink-0 rounded-[1.1rem] text-navy-600 hover:bg-navy-50 hover:text-navy-900',
            !allowAttachments && 'hidden',
          )}
          aria-label="پیوست فایل"
          onClick={() => fileInputRef.current?.click()}
          disabled={!allowAttachments}
        >
          <Paperclip className="size-4" />
        </Button>
        {allowAttachments ? (
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={CASE_FILE_ACCEPT}
            className="sr-only"
            onChange={onFileChange}
          />
        ) : null}
      </div>

      {allowAttachments ? (
        <p className="mt-2.5 text-center text-[0.65rem] leading-5 text-navy-400">
          PDF، تصویر یا ZIP · حداکثر {toPersianDigits(CHAT_FILE_MAX_COUNT)} فایل
        </p>
      ) : null}

      <ErrorBadgeList className="mt-2" messages={fileErrors} />
      {submitError || form.formState.errors.body ? (
        <ErrorBadge className="mt-2">{submitError ?? form.formState.errors.body?.message}</ErrorBadge>
      ) : null}
    </form>
  )
}

export { ChatAttachmentList } from './chat-attachments'
