import { describe, it, expect } from 'vitest'
import { formatFaNumber, normalizeNumericInput, toAsciiDigits, toPersianDigits } from '@/lib/format'
import { iranianMobileSchema, nationalIdSchema, otpSchema } from '@/features/app/schemas'

describe('toPersianDigits', () => {
  it('converts ASCII digits to Persian digits', () => {
    expect(toPersianDigits(1403)).toBe('۱۴۰۳')
    expect(toPersianDigits('021-9100')).toBe('۰۲۱-۹۱۰۰')
  })
})

describe('toAsciiDigits', () => {
  it('converts Persian and Arabic-Indic digits to ASCII', () => {
    expect(toAsciiDigits('۰۹۱۲۱۲۳۴۵۶۷')).toBe('09121234567')
    expect(toAsciiDigits('٠٩١٢')).toBe('0912')
    expect(toAsciiDigits('۱۲۳۴۵')).toBe('12345')
  })
})

describe('normalizeNumericInput', () => {
  it('strips separators after digit normalization', () => {
    expect(normalizeNumericInput('۱٬۲۵۰٬۰۰۰')).toBe('1250000')
    expect(normalizeNumericInput('1,250,000')).toBe('1250000')
  })
})

describe('numeric schemas accept Persian digits', () => {
  it('parses mobile, OTP and national id', () => {
    expect(iranianMobileSchema.parse('۰۹۱۲۱۲۳۴۵۶۷')).toBe('09121234567')
    expect(otpSchema.parse('۱۲۳۴۵')).toBe('12345')
    expect(nationalIdSchema.parse('۰۰۱۲۳۴۵۶۷۸')).toBe('0012345678')
  })
})

describe('formatFaNumber', () => {
  it('formats thousands with Persian digits', () => {
    const result = formatFaNumber(2400)
    expect(result).toContain('۲')
    expect(result.replace(/[^\d۰-۹]/g, '')).toMatch(/۲۴۰۰/)
  })
})
