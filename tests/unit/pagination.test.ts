import { describe, expect, it } from 'vitest'
import {
  clampPage,
  getPageItemRange,
  getPageSlice,
  getPaginationRange,
  getTotalPages,
} from '@/lib/pagination'

describe('getTotalPages', () => {
  it('returns at least one page for empty lists', () => {
    expect(getTotalPages(0, 6)).toBe(1)
    expect(getTotalPages(-1, 6)).toBe(1)
  })

  it('ceil-divides items by page size', () => {
    expect(getTotalPages(6, 6)).toBe(1)
    expect(getTotalPages(7, 6)).toBe(2)
    expect(getTotalPages(13, 5)).toBe(3)
  })
})

describe('clampPage', () => {
  it('keeps page within 1..totalPages', () => {
    expect(clampPage(0, 5)).toBe(1)
    expect(clampPage(3, 5)).toBe(3)
    expect(clampPage(9, 5)).toBe(5)
    expect(clampPage(1.8, 5)).toBe(1)
  })
})

describe('getPageSlice', () => {
  it('slices the requested window', () => {
    const items = [1, 2, 3, 4, 5, 6, 7]
    expect(getPageSlice(items, 1, 3)).toEqual([1, 2, 3])
    expect(getPageSlice(items, 2, 3)).toEqual([4, 5, 6])
    expect(getPageSlice(items, 3, 3)).toEqual([7])
  })

  it('clamps out-of-range pages', () => {
    expect(getPageSlice([1, 2, 3], 99, 2)).toEqual([3])
  })
})

describe('getPageItemRange', () => {
  it('reports inclusive from/to for the visible window', () => {
    expect(getPageItemRange(1, 6, 14)).toEqual({ from: 1, to: 6 })
    expect(getPageItemRange(3, 6, 14)).toEqual({ from: 13, to: 14 })
    expect(getPageItemRange(1, 6, 0)).toEqual({ from: 0, to: 0 })
  })
})

describe('getPaginationRange', () => {
  it('lists every page when the set is small', () => {
    expect(getPaginationRange(2, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('inserts ellipsis for long ranges', () => {
    expect(getPaginationRange(1, 12)).toEqual([1, 2, 'ellipsis', 12])
    expect(getPaginationRange(6, 12)).toEqual([1, 'ellipsis', 5, 6, 7, 'ellipsis', 12])
    expect(getPaginationRange(12, 12)).toEqual([1, 'ellipsis', 11, 12])
  })
})
