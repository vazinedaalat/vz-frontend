export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NetworkError extends AppError {
  constructor(message = 'ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.') {
    super(message, 'NETWORK_ERROR')
    this.name = 'NetworkError'
  }
}

export class ValidationError extends AppError {
  constructor(message = 'اطلاعات واردشده معتبر نیست.', details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'برای ادامه وارد حساب کاربری شوید.') {
    super(message, 'AUTHENTICATION_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'دسترسی به این بخش مجاز نیست.') {
    super(message, 'AUTHORIZATION_ERROR', 403)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'مورد درخواستی پیدا نشد.') {
    super(message, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

export class UnexpectedError extends AppError {
  constructor(message = 'خطای غیرمنتظره‌ای رخ داد.') {
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
      return new NetworkError()
    }

    const status = axiosError.response.status
    const payload = axiosError.response.data as
      | { message?: string; code?: string; errorCode?: string; details?: unknown }
      | undefined
    const message = payload?.message || 'درخواست با خطا مواجه شد.'
    const code = payload?.errorCode || payload?.code

    switch (status) {
      case 400:
        return new ValidationError(message, payload)
      case 401:
        return new AuthenticationError(message)
      case 403:
        return new AuthorizationError(message)
      case 404:
        return new NotFoundError(message)
      default:
        return new AppError(message, code || 'API_ERROR', status, payload)
    }
  }

  if (error instanceof Error) {
    return new UnexpectedError(error.message)
  }

  return new UnexpectedError('خطای ناشناخته رخ داد.')
}
