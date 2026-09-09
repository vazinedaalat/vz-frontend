export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
    public readonly details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network error. Please check your connection.') {
    super(message, 'NETWORK_ERROR')
    this.name = 'NetworkError'
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, 'AUTHORIZATION_ERROR', 403)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

export class UnexpectedError extends AppError {
  constructor(message = 'An unexpected error occurred') {
    super(message, 'UNEXPECTED_ERROR', 500)
    this.name = 'UnexpectedError'
  }
}

export function normalizeApiError(error: unknown): AppError {
  if (error instanceof AppError) return error

  if (typeof error === 'object' && error !== null && 'isAxiosError' in error) {
    const axiosError = error as {
      response?: { status?: number; data?: { message?: string; code?: string } }
      message?: string
      code?: string
    }

    if (!axiosError.response) {
      return new NetworkError(axiosError.message)
    }

    const status = axiosError.response.status
    const message = axiosError.response.data?.message || axiosError.message || 'Request failed'
    const code = axiosError.response.data?.code

    switch (status) {
      case 400:
        return new ValidationError(message, axiosError.response.data)
      case 401:
        return new AuthenticationError(message)
      case 403:
        return new AuthorizationError(message)
      case 404:
        return new NotFoundError(message)
      default:
        return new AppError(message, code || 'API_ERROR', status, axiosError.response.data)
    }
  }

  if (error instanceof Error) {
    return new UnexpectedError(error.message)
  }

  return new UnexpectedError('Unknown error')
}
