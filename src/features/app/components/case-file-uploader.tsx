import { useRef, useState, type DragEvent } from 'react'
import { FileUp, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toPersianDigits } from '@/lib/format'
import { CASE_FILE_ACCEPT, CASE_FILE_MAX_COUNT } from '../constants/case-intake'
import { formatFileSize, mergeCaseFiles } from '../lib/case-files'
import type { CaseFileMeta } from '../types'

interface CaseFileUploaderProps {
  files: CaseFileMeta[]
  onChange: (files: CaseFileMeta[]) => void
  error?: string
}

export function CaseFileUploader({ files, onChange, error }: CaseFileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [localErrors, setLocalErrors] = useState<string[]>([])

  const applyIncoming = (list: FileList | File[]) => {
    const incoming = Array.from(list)
    const result = mergeCaseFiles(files, incoming)
    onChange(result.files)
    setLocalErrors(result.errors)
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragOver(false)
    if (event.dataTransfer.files?.length) applyIncoming(event.dataTransfer.files)
  }

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault()
          setDragOver(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setDragOver(false)
        }}
        onDrop={onDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-10 text-center transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/40',
          dragOver
            ? 'border-gold-400 bg-gold-100/60'
            : 'border-navy-200 bg-navy-50/40 hover:border-gold-300 hover:bg-gold-100/30',
        )}
      >
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-navy-900 text-gold-300">
          <FileUp className="size-5" aria-hidden />
        </span>
        <p className="mt-4 text-sm font-semibold text-navy-900">فایل‌ها را بکشید و رها کنید</p>
        <p className="mt-1 text-xs leading-6 text-navy-500">
          یا لمس کنید برای انتخاب · حداکثر {toPersianDigits(CASE_FILE_MAX_COUNT)} فایل
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={CASE_FILE_ACCEPT}
          className="sr-only"
          onChange={(event) => {
            if (event.target.files?.length) applyIncoming(event.target.files)
            event.target.value = ''
          }}
        />
      </div>

      {files.length > 0 ? (
        <ul className="space-y-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-navy-200 bg-white px-3.5 py-3 shadow-soft"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-navy-900">{file.name}</p>
                <p className="mt-0.5 text-xs text-navy-500">{toPersianDigits(formatFileSize(file.size))}</p>
              </div>
              <button
                type="button"
                aria-label={`حذف ${file.name}`}
                className="inline-flex size-10 items-center justify-center rounded-xl border border-navy-200 text-navy-600 transition hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/40"
                onClick={() => onChange(files.filter((item) => item.id !== file.id))}
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {localErrors.map((message) => (
        <p key={message} className="text-xs text-destructive" role="alert">
          {message}
        </p>
      ))}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
