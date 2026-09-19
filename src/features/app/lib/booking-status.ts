import type { ConsultationBookingStatus } from '../types'

export const BOOKING_STATUS_LABEL: Record<ConsultationBookingStatus, string> = {
  available: 'آزاد',
  booked: 'رزرو شده',
  done: 'انجام‌شده',
  cancelled: 'لغو شده',
  expired: 'منقضی',
}

export function bookingStatusLabel(
  status: ConsultationBookingStatus | string | undefined,
): string {
  if (!status) return BOOKING_STATUS_LABEL.booked
  return BOOKING_STATUS_LABEL[status as ConsultationBookingStatus] ?? status
}

/** Tailwind classes for status chips (aligned with support ticket chips). */
export function bookingStatusChipClass(
  status: ConsultationBookingStatus | string | undefined,
): string {
  switch (status) {
    case 'available':
      return 'bg-navy-50 text-navy-500'
    case 'done':
      return 'bg-navy-100 text-navy-800'
    case 'cancelled':
      return 'bg-destructive/10 text-destructive'
    case 'expired':
      return 'bg-navy-50 text-navy-400'
    case 'booked':
    default:
      return 'bg-gold-100 text-gold-700'
  }
}
