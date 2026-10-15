import { describe, expect, it } from 'vitest'
import {
  AppError,
  AuthenticationError,
  AuthorizationError,
  NetworkError,
  isSessionRejected,
} from '@/services/api/errors'

describe('isSessionRejected', () => {
  it('ends the session only on an explicit 401/403 from the API', () => {
    expect(isSessionRejected(new AuthenticationError())).toBe(true)
    expect(isSessionRejected(new AuthorizationError())).toBe(true)
    expect(isSessionRejected(new AppError('x', 'API_ERROR', 401))).toBe(true)
  })

  it('keeps the session on network drops, CDN pages and server errors', () => {
    expect(isSessionRejected(new NetworkError())).toBe(false)
    expect(isSessionRejected(new AppError('x', 'API_ERROR', 500))).toBe(false)
    expect(isSessionRejected(new AppError('x', 'API_ERROR'))).toBe(false)
    expect(isSessionRejected(new Error('boom'))).toBe(false)
  })
})
