import { apiRequest } from '@/services/api'
import type { AppUser } from '../types'

export interface OtpRequestResult {
  expiresIn: number
  demoCode?: string
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  user: AppUser
}

export function requestOtpApi(phone: string) {
  return apiRequest<OtpRequestResult>({
    method: 'POST',
    url: '/auth/otp/request',
    data: { phone },
  })
}

export function verifyOtpApi(phone: string, code: string) {
  return apiRequest<AuthSession>({
    method: 'POST',
    url: '/auth/otp/verify',
    data: { phone, code },
  })
}

export function fetchMeApi() {
  return apiRequest<AppUser>({ method: 'GET', url: '/auth/me' })
}

export interface UpdateProfilePayload {
  fullName: string
  /** Omit or leave empty to keep the existing national ID. */
  nationalId?: string
}

export function updateProfileApi(payload: UpdateProfilePayload) {
  const body: UpdateProfilePayload = { fullName: payload.fullName.trim() }
  const nationalId = payload.nationalId?.trim()
  if (nationalId) body.nationalId = nationalId
  return apiRequest<AppUser>({ method: 'PATCH', url: '/auth/me', data: body })
}

export function logoutApi(refreshToken?: string | null) {
  return apiRequest<{ ok: true }>({
    method: 'POST',
    url: '/auth/logout',
    data: refreshToken ? { refreshToken } : {},
  })
}
