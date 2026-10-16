import { afterEach, describe, expect, it, vi } from 'vitest'
import { notifySessionExpired, onSessionExpired } from '@/services/api/session-expired'

describe('session-expired', () => {
  afterEach(() => {
    onSessionExpired(null)
  })

  it('invokes the registered handler when the session expires', () => {
    const handler = vi.fn()
    onSessionExpired(handler)
    notifySessionExpired()
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('is a no-op without a handler and after unregister', () => {
    expect(() => notifySessionExpired()).not.toThrow()
    const handler = vi.fn()
    onSessionExpired(handler)
    onSessionExpired(null)
    notifySessionExpired()
    expect(handler).not.toHaveBeenCalled()
  })
})
