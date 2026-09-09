import { describe, it, expect } from 'vitest'
import {
  NetworkError,
  AuthenticationError,
  ValidationError,
  normalizeApiError,
} from '@/services/api/errors'

describe('API Errors', () => {
  it('creates NetworkError', () => {
    const err = new NetworkError()
    expect(err.code).toBe('NETWORK_ERROR')
    expect(err.message).toContain('Network')
  })

  it('creates AuthenticationError', () => {
    const err = new AuthenticationError()
    expect(err.status).toBe(401)
  })

  it('normalizes unknown error', () => {
    const err = normalizeApiError(new Error('boom'))
    expect(err.name).toBe('UnexpectedError')
  })

  it('preserves AppError', () => {
    const original = new ValidationError('invalid')
    const result = normalizeApiError(original)
    expect(result).toBe(original)
  })
})
