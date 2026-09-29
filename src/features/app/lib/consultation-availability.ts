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

/** Slot on today's date whose start time is now or earlier (backend rejects these too). */
export function isTimeSlotPast(dateKey: string, time: string, now = new Date()): boolean {
  if (dateKey !== toDateKey(startOfLocalDay(now))) return false
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  return time <= `${hh}:${mm}`
}

export function getAvailableTimeSlots(
  dateKey: string,
  availability: ConsultationAvailability,
  now = new Date(),
): string[] {
  if (!isDateSelectable(dateKey, availability, startOfLocalDay(now))) return []
  return availability.timeSlots.filter(
    (time) => !isTimeSlotBooked(dateKey, time, availability) && !isTimeSlotPast(dateKey, time, now),
  )
}

/** If every clock slot is taken or already past, treat the day as unbookable for timed plans. */
export function isDayExhaustedForTimedPlan(
  dateKey: string,
  availability: ConsultationAvailability,
  now = new Date(),
): boolean {
  if (availability.timeSlots.length === 0) return false
  return getAvailableTimeSlots(dateKey, availability, now).length === 0
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
