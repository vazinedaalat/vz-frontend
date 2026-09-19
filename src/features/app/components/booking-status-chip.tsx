import { cn } from '@/lib/utils'
import type { ConsultationBookingStatus } from '../types'
import { bookingStatusChipClass, bookingStatusLabel } from '../lib/booking-status'

export function BookingStatusChip({
  status,
  className,
}: {
  status: ConsultationBookingStatus | string | undefined
  className?: string
}) {
  return (
    <span
      className={cn(
        'shrink-0 rounded-lg px-2 py-0.5 text-[0.65rem] font-semibold',
        bookingStatusChipClass(status),
        className,
      )}
    >
      {bookingStatusLabel(status)}
    </span>
  )
}
