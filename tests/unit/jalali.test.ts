import { describe, expect, it } from 'vitest'
import {
  buildJalaliMonthGrid,
  dateKeyFromJalali,
  formatFaDate,
  formatFaDateTime,
  formatJalaliLabel,
  jalaliMonthLength,
  jalaliWeekdayIndex,
  toGregorian,
  toJalali,
} from '@/lib/jalali'

describe('jalali conversion', () => {
  it('round-trips a known Gregorian date', () => {
    const j = toJalali(2026, 9, 14)
    expect(j).toEqual({ jy: 1405, jm: 6, jd: 23 })
    expect(toGregorian(j.jy, j.jm, j.jd)).toEqual({ gy: 2026, gm: 9, gd: 14 })
  })

  it('reports month length for Shahrivar', () => {
    expect(jalaliMonthLength(1405, 6)).toBe(31)
  })

  it('builds a Saturday-first grid with correct first weekday', () => {
    const offset = jalaliWeekdayIndex(1405, 6, 1)
    const grid = buildJalaliMonthGrid(1405, 6)
    expect(grid.slice(0, offset).every((cell) => cell === null)).toBe(true)
    expect(grid[offset]?.jd).toBe(1)
    expect(grid[offset]?.key).toBe(dateKeyFromJalali(1405, 6, 1))
  })
})

describe('formatFaDateTime', () => {
  it('formats ISO timestamps to Jalali with Persian digits', () => {
    const result = formatFaDateTime('2026-09-15T10:05:00')
    expect(result).toMatch(/۱۴۰۵\/۰۶\/۲۴/)
    expect(result).toContain('۱۰:۰۵')
  })

  it('formats Gregorian date keys and combo labels', () => {
    expect(formatFaDate('2026-09-14')).toBe('۱۴۰۵/۰۶/۲۳')
    expect(formatFaDateTime('2026-09-20 · 10:00')).toMatch(/۱۴۰۵\/۰۶\/۲۹/)
    expect(formatFaDateTime('2026-09-20 · 10:00')).toContain('۱۰:۰۰')
  })

  it('passes through Persian mock labels', () => {
    expect(formatFaDateTime('۱۴۰۴/۰۶/۱۸ · ۱۴:۲۰')).toBe('۱۴۰۴/۰۶/۱۸ · ۱۴:۲۰')
    expect(formatFaDateTime('اکنون')).toBe('اکنون')
    expect(formatFaDateTime('سه‌شنبه ۲۱ شهریور')).toContain('شهریور')
  })

  it('formats long Jalali labels with Persian digits', () => {
    expect(formatJalaliLabel('2026-09-14')).toBe('۲۳ شهریور ۱۴۰۵')
  })
})
