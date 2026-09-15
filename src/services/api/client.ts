import axios, { type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/config'
import { logger } from '@/lib/logger'
import { AuthenticationError, normalizeApiError } from './errors'
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from './token'
import type { ApiSuccessEnvelope } from './types'

const apiClient: AxiosInstance = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

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

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  try {
    const { data } = await axios.post<
      ApiSuccessEnvelope<{ accessToken: string; refreshToken: string }>
    >(
      `${env.VITE_API_URL}/auth/refresh`,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } },
    )
    setTokens(data.data.accessToken, data.data.refreshToken)
    return data.data.accessToken
  } catch {
    clearTokens()
    return null
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const status = error.response?.status

    if (status === 401 && original && !original._retry && !original.url?.includes('/auth/')) {
      original._retry = true
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null
      })
      const nextToken = await refreshPromise
      if (nextToken) {
        original.headers.Authorization = `Bearer ${nextToken}`
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
