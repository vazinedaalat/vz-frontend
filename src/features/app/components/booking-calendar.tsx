import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toPersianDigits } from '@/lib/format'
import {
  PERSIAN_WEEKDAYS,
  buildJalaliMonthGrid,
  jalaliFromDate,
  persianMonthName,
  shiftJalaliMonth,
  startOfLocalDay,
  toDateKey,
  type JalaliDate,
} from '@/lib/jalali'
import {
  isDateFullyBooked,
  isDateSelectableForPlan,
  isPastDate,
} from '../lib/consultation-availability'
import type { ConsultationAvailability, ConsultationPlanId } from '../types'

interface BookingCalendarProps {
  planId: ConsultationPlanId
  availability: ConsultationAvailability
  selectedDate?: string
  onSelectDate: (dateKey: string) => void
  viewMonth: JalaliDate
  onViewMonthChange: (month: JalaliDate) => void
}

export function BookingCalendar({
  planId,
  availability,
  selectedDate,
  onSelectDate,
  viewMonth,
  onViewMonthChange,
}: BookingCalendarProps) {
  const today = startOfLocalDay()
  const todayJalali = jalaliFromDate(today)
  const todayKey = toDateKey(today)
  const cells = buildJalaliMonthGrid(viewMonth.jy, viewMonth.jm)

  const canGoPrev =
    viewMonth.jy > todayJalali.jy ||
    (viewMonth.jy === todayJalali.jy && viewMonth.jm > todayJalali.jm)

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-navy-200 bg-white p-3 shadow-soft sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4 sm:gap-3">
        <button
          type="button"
          aria-label="ماه بعد"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-navy-200 text-navy-700 transition hover:border-gold-400 hover:bg-navy-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/40 sm:size-10"
          onClick={() => onViewMonthChange(shiftJalaliMonth(viewMonth.jy, viewMonth.jm, 1))}
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>

        <div className="min-w-0 flex-1 px-1 text-center">
          <p className="font-display truncate text-sm font-bold text-navy-900 sm:text-base">
            {persianMonthName(viewMonth.jm)} {toPersianDigits(viewMonth.jy)}
          </p>
          <p className="mt-0.5 hidden text-xs text-navy-500 sm:block">روزهای قابل رزرو از امروز به بعد</p>
        </div>

        <button
          type="button"
          aria-label="ماه قبل"
          disabled={!canGoPrev}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-navy-200 text-navy-700 transition hover:border-gold-400 hover:bg-navy-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/40 disabled:cursor-not-allowed disabled:opacity-40 sm:size-10"
          onClick={() => onViewMonthChange(shiftJalaliMonth(viewMonth.jy, viewMonth.jm, -1))}
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
      </div>

      <div className="mb-1.5 grid grid-cols-7 gap-0.5 text-center text-[0.65rem] font-semibold text-navy-500 sm:mb-2 sm:gap-1 sm:text-[0.7rem]">
        {PERSIAN_WEEKDAYS.map((day) => (
          <span key={day} className="py-1">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {cells.map((cell, index) => {
          if (!cell) {
            return <span key={`empty-${index}`} className="aspect-square min-h-0 min-w-0" aria-hidden />
          }

          const selectable = isDateSelectableForPlan(cell.key, planId, availability, today)
          const booked = isDateFullyBooked(cell.key, availability)
          const past = isPastDate(cell.key, today)
          const selected = selectedDate === cell.key
          const isToday = cell.key === todayKey

          return (
            <button
              key={cell.key}
              type="button"
              disabled={!selectable}
              aria-pressed={selected}
              aria-label={`${toPersianDigits(cell.jd)} ${persianMonthName(cell.jm)}`}
              title={booked ? 'این روز رزرو شده است' : past ? 'گذشته' : undefined}
              onClick={() => onSelectDate(cell.key)}
              className={cn(
                'relative aspect-square min-h-0 min-w-0 rounded-lg text-[0.75rem] font-semibold transition-all duration-200 sm:rounded-xl sm:text-sm',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/40',
                selectable && !selected && 'bg-navy-50 text-navy-900 hover:bg-gold-100 hover:text-navy-900',
                selected && 'bg-navy-900 text-white shadow-soft',
                !selectable && 'cursor-not-allowed bg-transparent text-navy-300',
                booked && !selected && 'bg-navy-100/80 text-navy-400 line-through',
                isToday && !selected && selectable && 'ring-1 ring-gold-400/60',
              )}
            >
              {toPersianDigits(cell.jd)}
              {booked ? (
                <span className="absolute bottom-0.5 start-1/2 size-1 -translate-x-1/2 rounded-full bg-navy-400 sm:bottom-1" />
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[0.65rem] text-navy-500 sm:mt-4 sm:text-[0.7rem]">
        <LegendDot className="bg-navy-50 ring-1 ring-navy-200" label="قابل رزرو" />
        <LegendDot className="bg-navy-100" label="رزرو شده" />
        <LegendDot className="bg-navy-900" label="انتخاب‌شده" />
      </div>
    </div>
  )
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn('size-2.5 shrink-0 rounded-full', className)} aria-hidden />
      {label}
    </span>
  )
}
