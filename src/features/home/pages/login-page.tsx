import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUpLeft, Phone } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { ErrorBadge } from '@/components/shared/error-badge'
import { isMockEnabled } from '@/config/env'
import { BrandMark } from '@/features/home/components/brand-mark'
import { CONTACT_INFO, CTA } from '@/features/home/constants'
import { smsLoginOtpSchema, smsLoginPhoneSchema } from '@/features/app/schemas'
import { useAuthStore } from '@/features/app/store/auth-store'
import { Field } from '@/features/app/components/field'
import { asciiDigitsField } from '@/lib/format'
import { getAccessToken } from '@/services/api/token'
import { z } from 'zod'

type PhoneForm = z.infer<typeof smsLoginPhoneSchema>
type OtpForm = z.infer<typeof smsLoginOtpSchema>

/** SMS OTP login — mock verification only outside production. */
export default function LoginPage() {
  const navigate = useNavigate()
  const requestOtp = useAuthStore((s) => s.requestOtp)
  const verifyOtp = useAuthStore((s) => s.verifyOtp)
  const hydrateSession = useAuthStore((s) => s.hydrateSession)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [info, setInfo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [checkingSession, setCheckingSession] = useState(
    () => Boolean(getAccessToken()) || isAuthenticated,
  )

  const phoneForm = useForm<PhoneForm>({
    resolver: zodResolver(smsLoginPhoneSchema),
    defaultValues: { phone: '' },
  })

  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(smsLoginOtpSchema),
    defaultValues: { phone: '', code: '' },
  })

  useEffect(() => {
    let cancelled = false

    async function ensureSession() {
      if (isMockEnabled) {
        if (!cancelled) setCheckingSession(false)
        return
      }

      // Token present → validate; stale persist without token → clear.
      await hydrateSession()

      if (!cancelled) setCheckingSession(false)
    }

    void ensureSession()
    return () => {
      cancelled = true
    }
  }, [hydrateSession])

  const submitPhone = phoneForm.handleSubmit(async (values) => {
    setError(null)
    setInfo(null)
    const result = await requestOtp(values.phone)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setPhone(values.phone)
    otpForm.setValue('phone', values.phone)
    setStep('otp')
    if (result.demoCode) {
      setInfo(`کد آزمایشی: ${result.demoCode}`)
    } else {
      setInfo('کد تایید به شماره شما ارسال شد.')
    }
  })

  const submitOtp = otpForm.handleSubmit(async (values) => {
    setError(null)
    const result = await verifyOtp(values.phone, values.code)
    if (!result.ok) {
      setError(result.message)
      return
    }
    navigate('/app', { replace: true })
  })

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-50 px-5 py-10 text-sm text-navy-600">
        در حال بررسی نشست…
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/app" replace />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-50 px-5 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-navy-200 bg-white p-8 text-navy-900 shadow-soft sm:p-10">
        <BrandMark />
        <h1 className="font-display mt-8 text-2xl font-bold">{CTA.login}</h1>
        <p className="mt-3 text-sm leading-7 text-navy-600">
          ورود با احراز هویت پیامکی. شماره موبایل باید به نام خودتان و قابل دریافت پیامک باشد.
        </p>

        {!isMockEnabled ? (
          <p className="mt-4 rounded-xl border border-navy-200 bg-navy-50 px-3 py-2 text-xs leading-6 text-navy-600">
            ورود از طریق API واقعی. در محیط توسعه کد دمو معمولاً ۱۲۳۴۵ است.
          </p>
        ) : (
          <p className="mt-4 rounded-xl border border-gold-300 bg-gold-100 px-3 py-2 text-xs leading-6 text-gold-800">
            حالت موک فعال است — بدون اتصال به سرور.
          </p>
        )}

        {info ? (
          <p className="mt-4 rounded-xl border border-gold-300 bg-gold-100 px-3 py-2 text-xs text-gold-800">{info}</p>
        ) : null}
        {error ? (
          <ErrorBadge variant="page" className="mt-4 rounded-xl px-3 py-2 text-xs">
            {error}
          </ErrorBadge>
        ) : null}

        {step === 'phone' ? (
          <form onSubmit={submitPhone} className="mt-6 space-y-4">
            <Field
              label="شماره موبایل"
              htmlFor="phone"
              required
              error={phoneForm.formState.errors.phone?.message}
              hint="مثال: 09121234567"
            >
              <Input
                id="phone"
                inputMode="numeric"
                dir="ltr"
                placeholder="09xxxxxxxxx"
                {...phoneForm.register('phone', asciiDigitsField)}
              />
            </Field>
            <Button type="submit" variant="accent" size="lg" className="w-full">
              دریافت کد تایید
            </Button>
          </form>
        ) : (
          <form onSubmit={submitOtp} className="mt-6 space-y-4">
            <p className="text-sm text-navy-600">
              کد ارسال‌شده به <span dir="ltr">{phone}</span> را وارد کنید.
            </p>
            <Field label="کد ۵ رقمی" htmlFor="code" required error={otpForm.formState.errors.code?.message}>
              <Input
                id="code"
                inputMode="numeric"
                dir="ltr"
                maxLength={5}
                placeholder="-----"
                {...otpForm.register('code', asciiDigitsField)}
              />
            </Field>
            <Button type="submit" variant="accent" size="lg" className="w-full">
              تایید و ورود
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setStep('phone')
                setInfo(null)
                setError(null)
              }}
            >
              تغییر شماره
            </Button>
          </form>
        )}

        <div className="mt-6 flex flex-col gap-3 border-t border-navy-100 pt-6">
          <Button variant="outline" size="lg" className="w-full" asChild>
            <a href={CONTACT_INFO.phoneHref}>
              <Phone />
              {CTA.contact}
            </a>
          </Button>
          <Button variant="ghost" size="lg" className="w-full" asChild>
            <Link to="/">
              بازگشت به وب‌سایت
              <ArrowUpLeft />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
