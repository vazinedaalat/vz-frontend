import { describe, expect, it } from 'vitest'
import {
  getAvailableTimeSlots,
  isDateSelectableForPlan,
  isTimeSlotPast,
} from '@/features/app/lib/consultation-availability'
import type { ConsultationAvailability } from '@/features/app/types'

const availability: ConsultationAvailability = {
  bookedDates: [],
  bookedSlots: ['2026-09-30T11:00'],
  timeSlots: ['09:00', '10:00', '11:00', '16:00', '18:00'],
}

// 2026-09-29 16:34 local
const now = new Date(2026, 8, 29, 16, 34)

describe('consultation availability — past time slots', () => {
  it('marks slots at or before now on today as past', () => {
    expect(isTimeSlotPast('2026-09-29', '10:00', now)).toBe(true)
    expect(isTimeSlotPast('2026-09-29', '16:00', now)).toBe(true)
    expect(isTimeSlotPast('2026-09-29', '18:00', now)).toBe(false)
  })

  it('never marks slots on future days as past', () => {
    expect(isTimeSlotPast('2026-09-30', '09:00', now)).toBe(false)
  })

  it('today offers only future, unbooked slots', () => {
    expect(getAvailableTimeSlots('2026-09-29', availability, now)).toEqual(['18:00'])
  })

  it('tomorrow excludes booked slots only', () => {
    expect(getAvailableTimeSlots('2026-09-30', availability, now)).toEqual([
      '09:00',
      '10:00',
      '16:00',
      '18:00',
    ])
  })

  it('past days have no slots', () => {
    expect(getAvailableTimeSlots('2026-09-28', availability, now)).toEqual([])
  })

  it('today is not selectable for timed plans once every slot has passed', () => {
    const late = new Date(2026, 8, 29, 19, 0)
    expect(getAvailableTimeSlots('2026-09-29', availability, late)).toEqual([])
    // Online plans are day-only, so today stays selectable.
    expect(isDateSelectableForPlan('2026-09-29', 'specialist-online', availability, late)).toBe(true)
  })
})
