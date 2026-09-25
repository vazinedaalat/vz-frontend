import { describe, expect, it } from 'vitest'
import { normalizeFileName } from '@/features/app/lib/filename'

describe('normalizeFileName', () => {
  it('restores Persian UTF-8 misread as Latin-1 (multer mojibake)', () => {
    const good = 'قرارداد جامع شراکت و سهامداری - اصلاح_شده.pdf'
    const mojibake = Buffer.from(good, 'utf8').toString('latin1')
    expect(normalizeFileName(mojibake)).toBe(good)
  })

  it('leaves already-correct Persian names alone', () => {
    const name = 'مبیعه‌نامه.pdf'
    expect(normalizeFileName(name)).toBe(name)
  })

  it('leaves plain ASCII names alone', () => {
    expect(normalizeFileName('contract-v2.pdf')).toBe('contract-v2.pdf')
  })

  it('decodes percent-encoded UTF-8 names', () => {
    const encoded = encodeURIComponent('اظهارنامه.pdf')
    expect(normalizeFileName(encoded)).toBe('اظهارنامه.pdf')
  })
})
