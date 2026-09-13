import { describe, it, expect } from 'vitest'
import {
  documentRequestSchema,
  iranianMobileSchema,
  otpSchema,
  createCaseSchema,
} from '@/features/app/schemas'
import { USE_MOCK_DATA, withMockData } from '@/lib/mock'
import { getCases, getSpecialOffers } from '@/features/app/mocks/data'

describe('Iranian legal form schemas', () => {
  it('accepts valid mobile numbers', () => {
    expect(iranianMobileSchema.parse('09121234567')).toBe('09121234567')
  })

  it('rejects invalid mobile numbers', () => {
    expect(() => iranianMobileSchema.parse('9121234567')).toThrow()
    expect(() => iranianMobileSchema.parse('0912123456')).toThrow()
  })

  it('accepts 5-digit OTP', () => {
    expect(otpSchema.parse('12345')).toBe('12345')
  })

  it('validates petition-style document request fields (Art. 51 inspired)', () => {
    const parsed = documentRequestSchema.parse({
      documentType: 'petition',
      plaintiffName: 'علی رضایی',
      plaintiffFatherName: 'محمد',
      plaintiffNationalId: '0012345678',
      plaintiffAddress: 'تهران، خیابان ولیعصر، پلاک ۱۲',
      defendantName: 'شرکت نمونه',
      defendantAddress: 'تهران، ونک',
      claimTitle: 'الزام به تنظیم سند رسمی',
      claimAmount: '5000000000',
      claimBasis: 'به موجب مبایعه‌نامه مورخ ۱۴۰۲ خواهان مستحق انتقال رسمی است.',
      courtRequest: 'صدور حکم بر الزام خوانده به تنظیم سند رسمی',
      evidenceSummary: 'مبایعه‌نامه، رسیدهای بانکی، گواهی عدم حضور',
    })
    expect(parsed.documentType).toBe('petition')
  })

  it('validates create-case payload', () => {
    const parsed = createCaseSchema.parse({
      title: 'مطالبه وجه چک',
      category: 'تجاری',
      summary: 'چک به شماره ۱۲۳ برگشت خورده و مطالبه وجه آن درخواست می‌شود.',
      opponentName: 'رضا محمدی',
      city: 'تهران',
      urgency: 'فوری',
    })
    expect(parsed.category).toBe('تجاری')
  })
})

describe('mock data gate', () => {
  it('loads demo datasets when mock mode is enabled (non-production)', () => {
    expect(USE_MOCK_DATA).toBe(true)
    expect(withMockData(() => ['a'], [])).toEqual(['a'])
    expect(getCases().length).toBeGreaterThan(0)
    expect(getSpecialOffers().length).toBeGreaterThan(0)
  })
})
