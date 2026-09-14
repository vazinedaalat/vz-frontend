import {
  CASE_FILE_ACCEPT_MIME,
  CASE_FILE_MAX_BYTES,
  CASE_FILE_MAX_COUNT,
} from '../constants/case-intake'
import type { CaseFileMeta } from '../types'

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function isAllowedCaseFile(file: File): boolean {
  if (file.size <= 0 || file.size > CASE_FILE_MAX_BYTES) return false
  if (CASE_FILE_ACCEPT_MIME.includes(file.type as (typeof CASE_FILE_ACCEPT_MIME)[number])) return true
  const lower = file.name.toLowerCase()
  return (
    lower.endsWith('.pdf') ||
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.png') ||
    lower.endsWith('.webp') ||
    lower.endsWith('.zip')
  )
}

export function toCaseFileMeta(file: File): CaseFileMeta {
  return {
    id: `${file.name}-${file.size}-${file.lastModified}`,
    name: file.name,
    size: file.size,
    type: file.type || 'unknown',
  }
}

export interface MergeCaseFilesResult {
  files: CaseFileMeta[]
  errors: string[]
}

/** Merges new uploads into the current list with count/type/size rules. */
export function mergeCaseFiles(current: CaseFileMeta[], incoming: File[]): MergeCaseFilesResult {
  const errors: string[] = []
  const next = [...current]

  for (const file of incoming) {
    if (next.length >= CASE_FILE_MAX_COUNT) {
      errors.push(`حداکثر ${CASE_FILE_MAX_COUNT} فایل مجاز است.`)
      break
    }
    if (!isAllowedCaseFile(file)) {
      errors.push(`«${file.name}» مجاز نیست یا حجم آن بیش از ۱۰ مگابایت است.`)
      continue
    }
    const meta = toCaseFileMeta(file)
    if (next.some((item) => item.id === meta.id)) {
      errors.push(`«${file.name}» قبلاً افزوده شده است.`)
      continue
    }
    next.push(meta)
  }

  return { files: next, errors }
}
