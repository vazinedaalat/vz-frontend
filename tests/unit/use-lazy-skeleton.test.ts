import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { LAZY_SKELETON_DELAY_MS, useLazySkeleton } from '@/hooks/use-lazy-skeleton'

describe('useLazySkeleton', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('stays false until delay elapses while pending', () => {
    const { result, rerender } = renderHook(
      ({ pending }) => useLazySkeleton(pending, LAZY_SKELETON_DELAY_MS),
      { initialProps: { pending: true } },
    )

    expect(result.current).toBe(false)

    act(() => {
      vi.advanceTimersByTime(LAZY_SKELETON_DELAY_MS - 1)
    })
    expect(result.current).toBe(false)

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe(true)

    rerender({ pending: false })
    expect(result.current).toBe(false)
  })

  it('never shows when pending clears before delay', () => {
    const { result, rerender } = renderHook(
      ({ pending }) => useLazySkeleton(pending, 180),
      { initialProps: { pending: true } },
    )

    act(() => {
      vi.advanceTimersByTime(100)
    })
    rerender({ pending: false })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe(false)
  })
})
