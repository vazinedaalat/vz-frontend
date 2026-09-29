import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiRequest = vi.fn()
vi.mock('@/services/api', () => ({ apiRequest: (...args: unknown[]) => apiRequest(...args) }))

import { validateDiscountCode } from '@/features/app/api/discounts'
import { normalizeDiscountCode } from '@/features/app/lib/discount-preview'
import { ValidationError } from '@/services/api/errors'

describe('validateDiscountCode (CDN-safe)', () => {
  beforeEach(() => apiRequest.mockReset())

  it('asks for softFail so the rejection reason survives the CDN', async () => {
    apiRequest.mockResolvedValue({ valid: true, code: 'SALAM99', percent: 16, title: 't' })
    await validateDiscountCode('SALAM99', 'consultation', 'specialist-online')
    expect(apiRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/discounts/validate',
      data: { code: 'SALAM99', section: 'consultation', planId: 'specialist-online', softFail: true },
    })
  })

  it('turns `{ valid: false }` into a ValidationError with the server message', async () => {
    apiRequest.mockResolvedValue({ valid: false, message: 'این کد برای این پلن مشاوره نیست' })
    const err = await validateDiscountCode('SALAM99', 'consultation', 'dargahi-premium').catch(
      (e: unknown) => e,
    )
    expect(err).toBeInstanceOf(ValidationError)
    expect((err as Error).message).toBe('این کد برای این پلن مشاوره نیست')
  })

  it('returns the preview for a valid code', async () => {
    apiRequest.mockResolvedValue({ valid: true, code: 'SALAM99', percent: 16, title: 'خوش آمدید' })
    const res = await validateDiscountCode('SALAM99', 'consultation', 'specialist-online')
    expect(res.percent).toBe(16)
  })

  it('still accepts an older backend response without `valid`', async () => {
    apiRequest.mockResolvedValue({ code: 'SALAM99', percent: 16, title: 't' })
    await expect(validateDiscountCode('SALAM99', 'consultation', 'in-person')).resolves.toMatchObject({
      percent: 16,
    })
  })
})

describe('normalizeDiscountCode', () => {
  it('uppercases, strips spaces and converts Persian/Arabic digits', () => {
    expect(normalizeDiscountCode(' salam ۹۹ ')).toBe('SALAM99')
    expect(normalizeDiscountCode('vz-٤٠')).toBe('VZ-40')
  })
})
