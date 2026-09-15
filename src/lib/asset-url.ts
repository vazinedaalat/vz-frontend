import { env } from '@/config'

/** Absolute URL for Nest static uploads (`/uploads/...`). */
export function assetUrl(path: string | null | undefined): string {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const base = env.VITE_ASSET_BASE_URL.replace(/\/$/, '')
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}
