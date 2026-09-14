import { describe, expect, it } from 'vitest'
import { cycleIndex } from '@/features/app/lib/home-banner'

describe('cycleIndex', () => {
  it('advances and wraps forward', () => {
    expect(cycleIndex(0, 1, 3)).toBe(1)
    expect(cycleIndex(2, 1, 3)).toBe(0)
  })

  it('wraps backward', () => {
    expect(cycleIndex(0, -1, 3)).toBe(2)
    expect(cycleIndex(1, -1, 3)).toBe(0)
  })

  it('handles empty length', () => {
    expect(cycleIndex(0, 1, 0)).toBe(0)
  })
})
