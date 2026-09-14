import { describe, expect, it } from 'vitest'
import { createCaseSchema, createCaseIntakeSchema } from '@/features/app/schemas'
import { isAllowedCaseFile, mergeCaseFiles } from '@/features/app/lib/case-files'

function makeFile(name: string, size: number, type: string): File {
  const buffer = new Uint8Array(Math.min(size, 64))
  return new File([buffer], name, { type })
}

describe('createCaseIntakeSchema', () => {
  it('accepts intake without file-rule acceptance', () => {
    const result = createCaseIntakeSchema.safeParse({
      clientRole: 'خواهان',
      clientFullName: 'علی رضایی',
      clientFatherName: 'محمد',
      clientNationalId: '0012345678',
      clientPhone: '09121234567',
      clientAddress: 'تهران، خیابان ولیعصر، پلاک ۱۲',
      title: 'الزام به تنظیم سند رسمی',
      claimType: 'تنظیم سند رسمی',
      category: 'ملکی',
      proceedingType: 'حقوقی',
      summary: 'پس از پرداخت ثمن، فروشنده از حضور در دفترخانه خودداری کرده است.',
      legalBasis: 'مبایعه‌نامه مورخ ۱۴۰۲ و ماده ۲۲۰ قانون مدنی',
      opponentName: 'حسین محمدی',
      city: 'تهران',
      urgency: 'فوری',
      hasThanaAccount: 'بله',
    })
    expect(result.success).toBe(true)
  })
})

describe('createCaseSchema', () => {
  it('accepts a complete Iranian intake payload', () => {
    const result = createCaseSchema.safeParse({
      clientRole: 'خواهان',
      clientFullName: 'علی رضایی',
      clientFatherName: 'محمد',
      clientNationalId: '0012345678',
      clientPhone: '09121234567',
      clientAddress: 'تهران، خیابان ولیعصر، پلاک ۱۲',
      title: 'الزام به تنظیم سند رسمی',
      claimType: 'تنظیم سند رسمی',
      category: 'ملکی',
      proceedingType: 'حقوقی',
      summary: 'پس از پرداخت ثمن، فروشنده از حضور در دفترخانه خودداری کرده است.',
      legalBasis: 'مبایعه‌نامه مورخ ۱۴۰۲ و ماده ۲۲۰ قانون مدنی',
      opponentName: 'حسین محمدی',
      city: 'تهران',
      urgency: 'فوری',
      hasThanaAccount: 'بله',
      acceptFileRules: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects when file rules are not accepted', () => {
    const result = createCaseSchema.safeParse({
      clientRole: 'خواهان',
      clientFullName: 'علی رضایی',
      clientFatherName: 'محمد',
      clientNationalId: '0012345678',
      clientPhone: '09121234567',
      clientAddress: 'تهران، خیابان ولیعصر، پلاک ۱۲',
      title: 'الزام به تنظیم سند رسمی',
      claimType: 'تنظیم سند رسمی',
      category: 'ملکی',
      proceedingType: 'حقوقی',
      summary: 'پس از پرداخت ثمن، فروشنده از حضور در دفترخانه خودداری کرده است.',
      legalBasis: 'مبایعه‌نامه مورخ ۱۴۰۲ و ماده ۲۲۰ قانون مدنی',
      opponentName: 'حسین محمدی',
      city: 'تهران',
      urgency: 'فوری',
      hasThanaAccount: 'بله',
      acceptFileRules: false,
    })
    expect(result.success).toBe(false)
  })
})

describe('case file rules', () => {
  it('allows pdf under size limit', () => {
    expect(isAllowedCaseFile(makeFile('doc.pdf', 1024, 'application/pdf'))).toBe(true)
  })

  it('rejects oversized files', () => {
    const file = makeFile('big.pdf', 1024, 'application/pdf')
    Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 })
    expect(isAllowedCaseFile(file)).toBe(false)
  })

  it('merges unique files and reports duplicates', () => {
    const first = makeFile('a.pdf', 100, 'application/pdf')
    const { files, errors } = mergeCaseFiles([], [first, first])
    expect(files).toHaveLength(1)
    expect(errors.length).toBeGreaterThan(0)
  })
})
