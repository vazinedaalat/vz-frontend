import { assetUrl } from '@/lib/asset-url'
import { normalizeFileName } from './filename'
import type { CaseFileMeta } from '../types'

const IMAGE_MIME = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'])
const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i

/** True when the attachment should render as an inline image. */
export function isImageAttachment(file: Pick<CaseFileMeta, 'type' | 'name'>): boolean {
  const type = (file.type || '').toLowerCase()
  if (IMAGE_MIME.has(type) || type.startsWith('image/')) return true
  return IMAGE_EXT.test(normalizeFileName(file.name))
}

/**
 * Resolves a viewable/downloadable href for an attachment.
 * Prefer Nest `url` (`/uploads/...`); fall back to local `File` blob for pending sends.
 */
export function resolveAttachmentUrl(file: CaseFileMeta): string {
  if (file.url) return assetUrl(file.url)
  if (file.file) return URL.createObjectURL(file.file)
  return ''
}
