import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { env } from '@/config'
import { logger } from '@/lib/logger'
import { normalizeApiError } from './errors'

const apiClient: AxiosInstance = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    // Attach auth token if available (from secure storage)
    const token = localStorage.getItem('access_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Optional request ID for tracing
    config.headers['X-Request-Id'] = crypto.randomUUID()

    if (import.meta.env.DEV) {
      logger.debug('API Request', {
        method: config.method,
        url: config.url,
        // never log body if it may contain sensitive data
      })
    }

    return config
  },
  (error) => {
    logger.error('Request interceptor error', error)
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const normalized = normalizeApiError(error)
    logger.error('API Error', {
      code: normalized.code,
      status: normalized.status,
      message: normalized.message,
    })
    return Promise.reject(normalized)
  }
)

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<T>(config)
  return response.data
}

export { apiClient }
