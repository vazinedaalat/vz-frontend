import { parseDateKey, startOfLocalDay, toDateKey } from '@/lib/jalali'
import type { ConsultationAvailability, ConsultationPlanId } from '../types'
import { planRequiresTime } from '../constants/consultation-plans'

export function isPastDate(dateKey: string, today = startOfLocalDay()): boolean {
  return parseDateKey(dateKey) < startOfLocalDay(today)
}

export function isDateFullyBooked(dateKey: string, availability: ConsultationAvailability): boolean {
  return availability.bookedDates.includes(dateKey)
}

/** Day is selectable from today onward and not fully reserved. */
export function isDateSelectable(dateKey: string, availability: ConsultationAvailability, today = startOfLocalDay()): boolean {
  if (isPastDate(dateKey, today)) return false
  if (isDateFullyBooked(dateKey, availability)) return false
  return true
}

export function slotKey(dateKey: string, time: string): string {
  return `${dateKey}T${time}`
}

export function isTimeSlotBooked(
  dateKey: string,
  time: string,
  availability: ConsultationAvailability,
): boolean {
  return availability.bookedSlots.includes(slotKey(dateKey, time))
}

export function getAvailableTimeSlots(
  dateKey: string,
  availability: ConsultationAvailability,
): string[] {
  if (!isDateSelectable(dateKey, availability)) return []
  return availability.timeSlots.filter((time) => !isTimeSlotBooked(dateKey, time, availability))
}

/** If every clock slot is taken, treat the day as unbookable for timed plans. */
export function isDayExhaustedForTimedPlan(
  dateKey: string,
  availability: ConsultationAvailability,
): boolean {
  if (availability.timeSlots.length === 0) return false
  return getAvailableTimeSlots(dateKey, availability).length === 0
}

export function isDateSelectableForPlan(
  dateKey: string,
  planId: ConsultationPlanId,
  availability: ConsultationAvailability,
  today = startOfLocalDay(),
): boolean {
  if (!isDateSelectable(dateKey, availability, today)) return false
  if (planRequiresTime(planId) && isDayExhaustedForTimedPlan(dateKey, availability)) return false
  return true
}

export function todayDateKey(today = new Date()): string {
  return toDateKey(startOfLocalDay(today))
}
