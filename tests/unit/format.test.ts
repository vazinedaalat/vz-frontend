import { describe, it, expect } from 'vitest'
import { formatFaNumber, toPersianDigits } from '@/lib/format'

describe('toPersianDigits', () => {
  it('converts ASCII digits to Persian digits', () => {
    expect(toPersianDigits(1403)).toBe('۱۴۰۳')
    expect(toPersianDigits('021-9100')).toBe('۰۲۱-۹۱۰۰')
  })
})

describe('formatFaNumber', () => {
  it('formats thousands with Persian digits', () => {
    const result = formatFaNumber(2400)
    expect(result).toContain('۲')
    expect(result.replace(/[^\d۰-۹]/g, '')).toMatch(/۲۴۰۰/)
  })
})
