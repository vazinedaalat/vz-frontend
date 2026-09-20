import { describe, expect, it } from 'vitest'
import {
  computeDiscountAmount,
  computeDiscountedPrice,
  normalizeDiscountCode,
} from '@/features/app/lib/discount-preview'
import { mockValidateDiscountCode } from '@/features/app/mocks/data'

describe('discount-preview', () => {
  it('computes rounded payable amount and savings', () => {
    expect(computeDiscountedPrice(1_000_000, 40)).toBe(600_000)
    expect(computeDiscountAmount(1_000_000, 40)).toBe(400_000)
    expect(computeDiscountedPrice(999, 10)).toBe(899)
  })

  it('clamps invalid inputs safely', () => {
    expect(computeDiscountedPrice(0, 40)).toBe(0)
    expect(computeDiscountedPrice(1000, 0)).toBe(1000)
    expect(computeDiscountedPrice(1000, 150)).toBe(0)
    expect(computeDiscountAmount(-10, 20)).toBe(0)
  })

  it('normalizes codes', () => {
    expect(normalizeDiscountCode('  vazin40 ')).toBe('VAZIN40')
  })
})

describe('mockValidateDiscountCode', () => {
  it('accepts VAZIN40 for paid consultation plans', () => {
    const result = mockValidateDiscountCode('vazin40', 'consultation', 'specialist-online')
    expect(result.percent).toBe(40)
    expect(result.code).toBe('VAZIN40')
    expect(result.section).toBe('consultation')
  })

  it('rejects wrong section', () => {
    expect(() => mockValidateDiscountCode('VAZIN40', 'documents', 'specialist-online')).toThrow(
      /این بخش/,
    )
  })

  it('rejects inactive codes', () => {
    expect(() => mockValidateDiscountCode('EZHAR20', 'declaration')).toThrow(/منقضی/)
  })

  it('requires planId for consultation', () => {
    expect(() => mockValidateDiscountCode('VAZIN40', 'consultation')).toThrow(/پلن/)
  })
})
