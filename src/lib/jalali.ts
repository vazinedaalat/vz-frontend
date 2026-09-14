/** Jalali calendar helpers via Intl (no external date libraries). */

export interface JalaliDate {
  jy: number
  jm: number
  jd: number
}

const PERSIAN_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
] as const

export const PERSIAN_WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'] as const

const persianPartsFormatter = new Intl.DateTimeFormat('en-US-u-ca-persian', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
})

function readPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): number {
  const raw = parts.find((part) => part.type === type)?.value ?? '0'
  return Number(raw.replace(/\D/g, ''))
}

export function jalaliFromDate(date: Date): JalaliDate {
  const parts = persianPartsFormatter.formatToParts(date)
  return {
    jy: readPart(parts, 'year'),
    jm: readPart(parts, 'month'),
    jd: readPart(parts, 'day'),
  }
}

export function toJalali(gy: number, gm: number, gd: number): JalaliDate {
  return jalaliFromDate(new Date(gy, gm - 1, gd))
}

/** Finds the local Gregorian date for a Jalali Y/M/D. */
export function toGregorian(jy: number, jm: number, jd: number): { gy: number; gm: number; gd: number } {
  const date = dateFromJalali(jy, jm, jd)
  return {
    gy: date.getFullYear(),
    gm: date.getMonth() + 1,
    gd: date.getDate(),
  }
}

export function jalaliMonthLength(jy: number, jm: number): number {
  const first = dateFromJalali(jy, jm, 1)
  let cursor = first
  let count = 0
  while (true) {
    const parts = jalaliFromDate(cursor)
    if (parts.jy !== jy || parts.jm !== jm) break
    count += 1
    cursor = addDays(cursor, 1)
  }
  return count
}

export function persianMonthName(jm: number): string {
  return PERSIAN_MONTHS[jm - 1] ?? ''
}

/** Local calendar date key `YYYY-MM-DD` (Gregorian). */
export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y!, m! - 1, d!)
}

export function startOfLocalDay(date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

/**
 * Resolves Jalali day → local Date by scanning near Nowruz approximation.
 */
export function dateFromJalali(jy: number, jm: number, jd: number): Date {
  const approx = new Date(jy + 621, 2, 21)
  approx.setDate(approx.getDate() + (jm - 1) * 30 + (jd - 1))

  for (let offset = -40; offset <= 40; offset++) {
    const candidate = addDays(approx, offset)
    const parts = jalaliFromDate(candidate)
    if (parts.jy === jy && parts.jm === jm && parts.jd === jd) {
      return startOfLocalDay(candidate)
    }
  }

  throw new Error(`Unable to resolve Jalali date ${jy}/${jm}/${jd}`)
}

export function dateKeyFromJalali(jy: number, jm: number, jd: number): string {
  return toDateKey(dateFromJalali(jy, jm, jd))
}

/**
 * Saturday-first weekday index (0 = شنبه … 6 = جمعه) for a Jalali day.
 */
export function jalaliWeekdayIndex(jy: number, jm: number, jd: number): number {
  const date = dateFromJalali(jy, jm, jd)
  const jsDay = date.getDay() // 0 Sun … 6 Sat
  return (jsDay + 1) % 7
}

export interface CalendarCell {
  key: string
  jy: number
  jm: number
  jd: number
  inMonth: boolean
}

/** Builds a Saturday-first month grid (including leading blanks as null). */
export function buildJalaliMonthGrid(jy: number, jm: number): Array<CalendarCell | null> {
  const length = jalaliMonthLength(jy, jm)
  const offset = jalaliWeekdayIndex(jy, jm, 1)
  const cells: Array<CalendarCell | null> = Array.from({ length: offset }, () => null)
  for (let jd = 1; jd <= length; jd++) {
    cells.push({
      key: dateKeyFromJalali(jy, jm, jd),
      jy,
      jm,
      jd,
      inMonth: true,
    })
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function shiftJalaliMonth(jy: number, jm: number, delta: number): JalaliDate {
  let nextJm = jm + delta
  let nextJy = jy
  while (nextJm > 12) {
    nextJm -= 12
    nextJy += 1
  }
  while (nextJm < 1) {
    nextJm += 12
    nextJy -= 1
  }
  return { jy: nextJy, jm: nextJm, jd: 1 }
}

export function formatJalaliLabel(dateKey: string): string {
  const date = parseDateKey(dateKey)
  const { jy, jm, jd } = jalaliFromDate(date)
  return `${jd} ${persianMonthName(jm)} ${jy}`
}
