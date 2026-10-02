import { afterEach, describe, expect, it, vi } from 'vitest'
import { clearLegacyTokens, shouldAttemptRefresh, withCrossTabLock } from '@/services/api/token'

describe('clearLegacyTokens', () => {
  it('removes JWTs left in localStorage by older builds', () => {
    localStorage.setItem('access_token', 'a')
    localStorage.setItem('refresh_token', 'r')
    localStorage.setItem('vazinedalat-auth', '{"state":{}}')

    clearLegacyTokens()

    expect(localStorage.getItem('access_token')).toBeNull()
    expect(localStorage.getItem('refresh_token')).toBeNull()
    expect(localStorage.getItem('vazinedalat-auth')).not.toBeNull()
  })

  it('tolerates storage that throws or is missing', () => {
    const throwing = {
      removeItem: () => {
        throw new Error('denied')
      },
    }
    expect(() => clearLegacyTokens(throwing)).not.toThrow()
    expect(() => clearLegacyTokens(undefined)).not.toThrow()
  })
})

describe('shouldAttemptRefresh', () => {
  it('refreshes once on 401 for normal and /auth/me requests', () => {
    expect(shouldAttemptRefresh(401, '/cases', false)).toBe(true)
    expect(shouldAttemptRefresh(401, '/auth/me', false)).toBe(true)
  })

  it('never refreshes twice, on other statuses, or on session endpoints', () => {
    expect(shouldAttemptRefresh(401, '/cases', true)).toBe(false)
    expect(shouldAttemptRefresh(403, '/cases', false)).toBe(false)
    expect(shouldAttemptRefresh(undefined, '/cases', false)).toBe(false)
    expect(shouldAttemptRefresh(401, '/auth/refresh', false)).toBe(false)
    expect(shouldAttemptRefresh(401, '/auth/logout', false)).toBe(false)
    expect(shouldAttemptRefresh(401, '/auth/otp/verify', false)).toBe(false)
  })
})

describe('withCrossTabLock', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('runs the task through navigator.locks when available', async () => {
    const request = vi.fn((_name: string, cb: () => Promise<string>) => cb())
    vi.stubGlobal('navigator', { locks: { request } })

    await expect(withCrossTabLock('refresh', async () => 'done')).resolves.toBe('done')
    expect(request).toHaveBeenCalledWith('refresh', expect.any(Function))
  })

  it('falls back to running the task directly', async () => {
    vi.stubGlobal('navigator', {})
    await expect(withCrossTabLock('refresh', async () => 42)).resolves.toBe(42)
  })
})
