export interface ApiSuccessEnvelope<T = unknown> {
  success: true
  statusCode: number
  message: string
  data: T
  timestamp: string
  path: string
}

export interface ApiErrorEnvelope {
  success: false
  statusCode: number
  message: string
  errorCode?: string
  timestamp?: string
  path?: string
  details?: unknown
}

/** @deprecated Prefer ApiSuccessEnvelope — kept for older helpers */
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiErrorResponse {
  message: string
  code?: string
  errorCode?: string
  details?: unknown
}
