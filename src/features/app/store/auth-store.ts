import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isMockEnabled } from '@/config/env'
import { resetUserScopedCache } from '@/lib/query-client'
import { AppError } from '@/services/api/errors'
import { fetchMeApi, logoutApi, requestOtpApi, updateProfileApi, verifyOtpApi } from '../api/auth'
import { getMockUser, updateMockUser } from '../mocks/data'
import type { AppUser } from '../types'

interface AuthState {
  user: AppUser | null
  phonePending: string | null
  isAuthenticated: boolean
  requestOtp: (
    phone: string,
  ) => Promise<{ ok: true; demoCode?: string } | { ok: false; message: string }>
  verifyOtp: (
    phone: string,
    code: string,
  ) => Promise<{ ok: true } | { ok: false; message: string }>
  updateProfile: (
    values: { fullName: string; nationalId?: string },
  ) => Promise<{ ok: true; user: AppUser } | { ok: false; message: string }>
  hydrateSession: () => Promise<void>
  logout: () => Promise<void>
}

const DEMO_OTP = '12345'

function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AppError) return error.message
  if (error instanceof Error) return error.message
  return fallback
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      phonePending: null,
      isAuthenticated: false,

      requestOtp: async (phone) => {
        if (isMockEnabled) {
          set({ phonePending: phone })
          return { ok: true, demoCode: DEMO_OTP }
        }

        try {
          const data = await requestOtpApi(phone)
          set({ phonePending: phone })
          return { ok: true, demoCode: data.demoCode }
        } catch (error) {
          return {
            ok: false,
            message: toErrorMessage(error, 'ارسال کد تایید ناموفق بود.'),
          }
        }
      },

      verifyOtp: async (phone, code) => {
        if (isMockEnabled) {
          if (code !== DEMO_OTP) {
            return { ok: false, message: 'کد واردشده نادرست است.' }
          }
          const mockUser = getMockUser()
          const user: AppUser = mockUser
            ? { ...mockUser, phone }
            : {
                id: 'usr-demo',
                fullName: 'کاربر وزین عدالت',
                phone,
                nationalIdMasked: '۰۰۰******۰۰',
                hasNationalId: false,
              }
          await resetUserScopedCache()
          set({ user, isAuthenticated: true, phonePending: null })
          return { ok: true }
        }

        try {
          const session = await verifyOtpApi(phone, code)
          await resetUserScopedCache()
          set({ user: session.user, isAuthenticated: true, phonePending: null })
          return { ok: true }
        } catch (error) {
          return {
            ok: false,
            message: toErrorMessage(error, 'تایید کد ناموفق بود.'),
          }
        }
      },

      updateProfile: async (values) => {
        if (isMockEnabled) {
          const current = get().user
          if (!current) {
            return { ok: false, message: 'نشست کاربر یافت نشد.' }
          }
          const nationalId = values.nationalId?.trim()
          const next: AppUser = {
            ...current,
            fullName: values.fullName.trim(),
            ...(nationalId
              ? {
                  nationalIdMasked: `${nationalId.slice(0, 3)}******${nationalId.slice(-2)}`,
                  hasNationalId: true,
                }
              : {}),
          }
          updateMockUser(next)
          set({ user: next })
          return { ok: true, user: next }
        }

        try {
          const user = await updateProfileApi(values)
          set({ user })
          return { ok: true, user }
        } catch (error) {
          return {
            ok: false,
            message: toErrorMessage(error, 'ذخیره مشخصات ناموفق بود.'),
          }
        }
      },

      hydrateSession: async () => {
        if (isMockEnabled) return

        // The HttpOnly session is invisible to JS; the persisted flag only avoids a 401 probe for guests.
        if (!get().isAuthenticated) return

        try {
          const user = await fetchMeApi()
          // Another tab may have signed in as someone else since this cache was filled.
          if (get().user?.id !== user.id) await resetUserScopedCache()
          set({ user, isAuthenticated: true })
        } catch {
          set({ user: null, isAuthenticated: false, phonePending: null })
          await resetUserScopedCache()
        }
      },

      logout: async () => {
        if (!isMockEnabled) {
          try {
            await logoutApi()
          } catch {
            // ignore network errors on logout
          }
        }
        // Flip auth first so protected pages unmount instead of refetching into the cleared cache.
        set({ user: null, isAuthenticated: false, phonePending: null })
        await resetUserScopedCache()
      },
    }),
    {
      name: 'vazinedalat-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
