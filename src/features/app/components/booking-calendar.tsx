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
    <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-soft sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          aria-label="ماه بعد"
          className="inline-flex size-10 items-center justify-center rounded-xl border border-navy-200 text-navy-700 transition hover:border-gold-400 hover:bg-navy-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/40"
          onClick={() => onViewMonthChange(shiftJalaliMonth(viewMonth.jy, viewMonth.jm, 1))}
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>

        <div className="text-center">
          <p className="font-display text-base font-bold text-navy-900">
            {persianMonthName(viewMonth.jm)} {toPersianDigits(viewMonth.jy)}
          </p>
          <p className="mt-0.5 text-xs text-navy-500">روزهای قابل رزرو از امروز به بعد</p>
        </div>

        <button
          type="button"
          aria-label="ماه قبل"
          disabled={!canGoPrev}
          className="inline-flex size-10 items-center justify-center rounded-xl border border-navy-200 text-navy-700 transition hover:border-gold-400 hover:bg-navy-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/40 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => onViewMonthChange(shiftJalaliMonth(viewMonth.jy, viewMonth.jm, -1))}
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[0.7rem] font-semibold text-navy-500">
        {PERSIAN_WEEKDAYS.map((day) => (
          <span key={day} className="py-1">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, index) => {
          if (!cell) {
            return <span key={`empty-${index}`} className="aspect-square" aria-hidden />
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
                'relative aspect-square rounded-xl text-sm font-semibold transition-all duration-200',
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
                <span className="absolute bottom-1 start-1/2 size-1 -translate-x-1/2 rounded-full bg-navy-400" />
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-[0.7rem] text-navy-500">
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
      <span className={cn('size-2.5 rounded-full', className)} aria-hidden />
      {label}
    </span>
  )
}
