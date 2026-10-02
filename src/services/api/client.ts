import axios, { type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/config'
import { logger } from '@/lib/logger'
import { AuthenticationError, normalizeApiError } from './errors'
import {
  AUTH_CLIENT,
  AUTH_CLIENT_HEADER,
  clearLegacyTokens,
  shouldAttemptRefresh,
  withCrossTabLock,
} from './token'
import type { ApiSuccessEnvelope } from './types'

clearLegacyTokens()

const apiClient: AxiosInstance = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    [AUTH_CLIENT_HEADER]: AUTH_CLIENT,
  },
})

apiClient.interceptors.request.use(
  (config) => {
    config.headers['X-Request-Id'] = crypto.randomUUID()

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    } else if (config.data !== undefined && config.headers['Content-Type'] == null) {
      config.headers['Content-Type'] = 'application/json'
    }

    if (import.meta.env.DEV) {
      logger.debug('API Request', {
        method: config.method,
        url: config.url,
      })
    }

    return config
  },
  (error) => {
    logger.error('Request interceptor error', error)
    return Promise.reject(error)
  },
)

let refreshPromise: Promise<boolean> | null = null

/** Rotates the HttpOnly session cookies; the API clears them itself when refresh fails. */
async function refreshSession(): Promise<boolean> {
  try {
    await withCrossTabLock('vz-web-auth-refresh', () =>
      axios.post(`${env.VITE_API_URL}/auth/refresh`, undefined, {
        withCredentials: true,
        headers: { Accept: 'application/json', [AUTH_CLIENT_HEADER]: AUTH_CLIENT },
      }),
    )
    return true
  } catch {
    return false
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const status = error.response?.status

    if (original && shouldAttemptRefresh(status, original.url, Boolean(original._retry))) {
      original._retry = true
      refreshPromise ??= refreshSession().finally(() => {
        refreshPromise = null
      })
      if (await refreshPromise) {
        return apiClient.request(original)
      }
      return Promise.reject(new AuthenticationError('نشست منقضی شده است. دوباره وارد شوید.'))
    }

    const normalized = normalizeApiError(error)
    logger.error('API Error', {
      code: normalized.code,
      status: normalized.status,
      message: normalized.message,
    })
    return Promise.reject(normalized)
  },
)

/** Typed request that unwraps Nest `{ success, data }` envelope. */
export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<ApiSuccessEnvelope<T>>(config)
  return response.data.data
}

export { apiClient }
