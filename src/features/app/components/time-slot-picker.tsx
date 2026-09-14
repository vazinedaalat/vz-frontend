import { cn } from '@/lib/utils'
import { toPersianDigits } from '@/lib/format'
import { getAvailableTimeSlots, isTimeSlotBooked } from '../lib/consultation-availability'
import type { ConsultationAvailability } from '../types'

interface TimeSlotPickerProps {
  dateKey: string
  availability: ConsultationAvailability
  value?: string
  onChange: (time: string) => void
  error?: string
}

export function TimeSlotPicker({ dateKey, availability, value, onChange, error }: TimeSlotPickerProps) {
  const available = getAvailableTimeSlots(dateKey, availability)

  if (availability.timeSlots.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-navy-200 bg-navy-50/60 px-4 py-5 text-sm leading-7 text-navy-600">
        ساعات قابل رزرو از سرور بارگذاری می‌شوند. در محیط توسعه از داده‌های نمونه استفاده می‌شود.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {availability.timeSlots.map((time) => {
          const booked = isTimeSlotBooked(dateKey, time, availability)
          const selected = value === time
          return (
            <button
              key={time}
              type="button"
              disabled={booked}
              aria-pressed={selected}
              onClick={() => onChange(time)}
              className={cn(
                'h-11 rounded-xl border text-sm font-semibold transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/40',
                selected && 'border-gold-400 bg-navy-900 text-white shadow-soft',
                !selected && !booked && 'border-navy-200 bg-white text-navy-800 hover:border-gold-300 hover:bg-gold-100/50',
                booked && 'cursor-not-allowed border-navy-100 bg-navy-50 text-navy-300 line-through',
              )}
            >
              {toPersianDigits(time)}
            </button>
          )
        })}
      </div>
      {available.length === 0 ? (
        <p className="text-xs text-navy-500">در این روز ساعت آزادی باقی نمانده است.</p>
      ) : null}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
