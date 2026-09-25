import { useEffect, useId, useState } from 'react'
import { Download, Expand, FileText, X } from 'lucide-react'
import { toPersianDigits } from '@/lib/format'
import { cn } from '@/lib/utils'
import { formatFileSize } from '../lib/case-files'
import { isImageAttachment, resolveAttachmentUrl } from '../lib/chat-attachments'
import { normalizeFileName } from '../lib/filename'
import type { CaseFileMeta } from '../types'

interface ChatAttachmentListProps {
  attachments: CaseFileMeta[]
  tone?: 'light' | 'dark'
}

/** Renders chat attachments: inline image preview + downloadable files. */
export function ChatAttachmentList({ attachments, tone = 'light' }: ChatAttachmentListProps) {
  const [lightbox, setLightbox] = useState<{ src: string; name: string } | null>(null)

  if (attachments.length === 0) return null

  const images = attachments.filter((file) => isImageAttachment(file) && resolveAttachmentUrl(file))
  const files = attachments.filter((file) => !isImageAttachment(file) || !resolveAttachmentUrl(file))

  return (
    <>
      <div className="mt-2 space-y-2">
        {images.length > 0 ? (
          <ul
            className={cn(
              'grid gap-2',
              images.length === 1 ? 'grid-cols-1' : 'grid-cols-2',
            )}
          >
            {images.map((file) => {
              const href = resolveAttachmentUrl(file)
              const displayName = normalizeFileName(file.name)
              return (
                <li key={file.id}>
                  <button
                    type="button"
                    onClick={() => setLightbox({ src: href, name: displayName })}
                    className={cn(
                      'group relative block w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50',
                      tone === 'dark' ? 'bg-white/10' : 'border border-navy-200/80 bg-navy-50',
                    )}
                    aria-label={`مشاهده تصویر ${displayName}`}
                  >
                    <img
                      src={href}
                      alt={displayName}
                      loading="lazy"
                      className="max-h-52 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <span
                      className={cn(
                        'pointer-events-none absolute bottom-2 start-2 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[0.65rem] font-medium opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100',
                        tone === 'dark' ? 'bg-navy-950/70 text-white' : 'bg-white/90 text-navy-800 shadow-soft',
                      )}
                    >
                      <Expand className="size-3" aria-hidden />
                      بزرگ‌نمایی
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        ) : null}

        {files.length > 0 ? (
          <ul className="space-y-1.5">
            {files.map((file) => (
              <FileAttachmentRow key={file.id} file={file} tone={tone} />
            ))}
          </ul>
        ) : null}
      </div>

      {lightbox ? (
        <ImageLightbox
          src={lightbox.src}
          name={lightbox.name}
          onClose={() => setLightbox(null)}
        />
      ) : null}
    </>
  )
}

function FileAttachmentRow({
  file,
  tone,
}: {
  file: CaseFileMeta
  tone: 'light' | 'dark'
}) {
  const href = resolveAttachmentUrl(file)
  const displayName = normalizeFileName(file.name)
  const content = (
    <>
      <span
        className={cn(
          'inline-flex size-8 shrink-0 items-center justify-center rounded-xl',
          tone === 'dark' ? 'bg-white/10 text-gold-300' : 'bg-gold-100 text-gold-700',
        )}
      >
        <FileText className="size-3.5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium" title={displayName}>
          {displayName}
        </span>
        <span className={cn('block text-[0.65rem]', tone === 'dark' ? 'text-white/50' : 'text-navy-400')}>
          {toPersianDigits(formatFileSize(file.size))}
        </span>
      </span>
      {href ? (
        <Download
          className={cn('size-3.5 shrink-0', tone === 'dark' ? 'text-gold-300' : 'text-gold-700')}
          aria-hidden
        />
      ) : null}
    </>
  )

  const className = cn(
    'flex min-h-11 items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs transition-colors',
    tone === 'dark'
      ? 'bg-white/10 text-white hover:bg-white/15'
      : 'border border-navy-200/80 bg-white/80 text-navy-800 hover:border-gold-300 hover:bg-gold-50/60',
    href && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/40',
  )

  if (!href) {
    return <li className={className}>{content}</li>
  }

  return (
    <li>
      <a
        href={href}
        download={displayName}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={`دانلود ${displayName}`}
      >
        {content}
      </a>
    </li>
  )
}

function ImageLightbox({
  src,
  name,
  onClose,
}: {
  src: string
  name: string
  onClose: () => void
}) {
  const titleId = useId()

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[min(92dvh,56rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-navy-900 shadow-lift"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <h2 id={titleId} className="min-w-0 truncate text-sm font-semibold text-white">
            {name}
          </h2>
          <div className="flex shrink-0 items-center gap-1">
            <a
              href={src}
              download={name}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-10 items-center justify-center rounded-xl text-gold-300 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/40"
              aria-label={`دانلود ${name}`}
            >
              <Download className="size-4" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-10 items-center justify-center rounded-xl text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/40"
              aria-label="بستن"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-3 sm:p-5">
          <img src={src} alt={name} className="max-h-[min(75dvh,48rem)] max-w-full rounded-lg object-contain" />
        </div>
      </div>
    </div>
  )
}
