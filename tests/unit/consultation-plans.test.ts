import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiRequest = vi.fn()
vi.mock('@/services/api', () => ({ apiRequest: (...args: unknown[]) => apiRequest(...args) }))

import { fetchConsultationPlans } from '@/features/app/api/consultation'
import { planRequiresTime } from '@/features/app/constants/consultation-plans'
import type { ConsultationPlanId } from '@/features/app/types'

describe('fetchConsultationPlans', () => {
  beforeEach(() => apiRequest.mockReset())

  it('reads active plans (with admin-set prices) from GET /consultation/plans', async () => {
    apiRequest.mockResolvedValue([
      {
        id: 'specialist-online',
        title: 'مشاوره آنلاین تخصصی',
        subtitle: 's',
        channel: 'online',
        channelLabel: 'آنلاین',
        requiresTime: false,
        isFree: false,
        requiresPayment: true,
        price: 1_234_000,
        durationMinutes: 30,
        highlights: ['a'],
      },
    ])

    const plans = await fetchConsultationPlans()

    expect(apiRequest).toHaveBeenCalledWith({ method: 'GET', url: '/consultation/plans' })
    expect(plans).toHaveLength(1)
    expect(plans[0]?.price).toBe(1_234_000)
    expect(plans[0]?.highlights).toEqual(['a'])
  })

  it('normalizes a missing highlights array so cards never crash', async () => {
    apiRequest.mockResolvedValue([{ id: 'free-online', price: 0, isFree: true, highlights: null }])
    const [plan] = await fetchConsultationPlans()
    expect(plan?.highlights).toEqual([])
  })

  it('returns an empty list when every plan is hidden by admin', async () => {
    apiRequest.mockResolvedValue([])
    await expect(fetchConsultationPlans()).resolves.toEqual([])
  })
})

describe('planRequiresTime', () => {
  it('knows which plans need a clock slot', () => {
    expect(planRequiresTime('in-person')).toBe(true)
    expect(planRequiresTime('dargahi-premium')).toBe(true)
    expect(planRequiresTime('free-online')).toBe(false)
  })

  it('does not throw for an unknown plan id', () => {
    expect(planRequiresTime('unknown' as ConsultationPlanId)).toBe(false)
  })
})
