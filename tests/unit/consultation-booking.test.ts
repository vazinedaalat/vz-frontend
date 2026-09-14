import { describe, expect, it } from 'vitest'
import {
  getAvailableTimeSlots,
  isDateSelectableForPlan,
  isTimeSlotBooked,
  slotKey,
} from '@/features/app/lib/consultation-availability'
import type { ConsultationAvailability } from '@/features/app/types'
import { consultationRequestSchema } from '@/features/app/schemas'

const availability: ConsultationAvailability = {
  bookedDates: ['2026-09-16'],
  bookedSlots: [slotKey('2026-09-15', '10:00')],
  timeSlots: ['09:00', '10:00', '11:00'],
}

describe('consultation availability', () => {
  it('blocks fully booked dates for all plans', () => {
    expect(isDateSelectableForPlan('2026-09-16', 'free-online', availability, new Date(2026, 8, 14))).toBe(false)
    expect(isDateSelectableForPlan('2026-09-15', 'free-online', availability, new Date(2026, 8, 14))).toBe(true)
  })

  it('blocks past dates', () => {
    expect(isDateSelectableForPlan('2026-09-13', 'specialist-online', availability, new Date(2026, 8, 14))).toBe(
      false,
    )
  })

  it('filters booked time slots', () => {
    expect(isTimeSlotBooked('2026-09-15', '10:00', availability)).toBe(true)
    expect(getAvailableTimeSlots('2026-09-15', availability)).toEqual(['09:00', '11:00'])
  })
})

describe('consultationRequestSchema', () => {
  it('requires time only for in-person plans', () => {
    const online = consultationRequestSchema.safeParse({
      planId: 'free-online',
      topic: 'موضوع تستی',
      description: 'توضیح کافی برای اعتبارسنجی فرم رزرو مشاوره',
      dateKey: '2026-09-20',
    })
    expect(online.success).toBe(true)

    const inPerson = consultationRequestSchema.safeParse({
      planId: 'in-person',
      topic: 'موضوع تستی',
      description: 'توضیح کافی برای اعتبارسنجی فرم رزرو مشاوره',
      dateKey: '2026-09-20',
    })
    expect(inPerson.success).toBe(false)
  })
})
