import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isMockEnabled } from '@/config/env'
import { getMockUser } from '../mocks/data'
import type { AppUser } from '../types'

interface AuthState {
  user: AppUser | null
  phonePending: string | null
  isAuthenticated: boolean
  requestOtp: (phone: string) => { ok: true; demoCode?: string } | { ok: false; message: string }
  verifyOtp: (phone: string, code: string) => { ok: true } | { ok: false; message: string }
  logout: () => void
}

const DEMO_OTP = '12345'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      phonePending: null,
      isAuthenticated: false,

      requestOtp: (phone) => {
        if (!isMockEnabled) {
          return {
            ok: false,
            message: 'ارسال پیامک در محیط تولید به API واقعی متصل می‌شود. فعلاً در دسترس نیست.',
          }
        }

        set({ phonePending: phone })
        return { ok: true, demoCode: DEMO_OTP }
      },

      verifyOtp: (phone, code) => {
        if (!isMockEnabled) {
          return { ok: false, message: 'احراز هویت پیامکی در محیط تولید هنوز فعال نشده است.' }
        }

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
            }

        set({ user, isAuthenticated: true, phonePending: null })
        return { ok: true }
      },

      logout: () => set({ user: null, isAuthenticated: false, phonePending: null }),
    }),
    {
      name: 'vazinedalat-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
