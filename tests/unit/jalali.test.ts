import { describe, expect, it } from 'vitest'
import {
  buildJalaliMonthGrid,
  dateKeyFromJalali,
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
