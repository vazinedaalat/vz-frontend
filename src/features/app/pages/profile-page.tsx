import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/components/ui'
import { ErrorBadge } from '@/components/shared/error-badge'
import { asciiDigitsField, toPersianDigits } from '@/lib/format'
import { Field } from '../components/field'
import { PageHeader } from '../components/page-header'
import { updateProfileSchema, type UpdateProfileValues } from '../schemas'
import { useAuthStore } from '../store/auth-store'

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const [success, setSuccess] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    shouldFocusError: true,
    defaultValues: {
      fullName: user?.fullName ?? '',
      nationalId: '',
    },
  })

  useEffect(() => {
    reset({
      fullName: user?.fullName ?? '',
      nationalId: '',
    })
  }, [user?.fullName, user?.id, reset])

  const onSubmit = handleSubmit(async (values) => {
    setSuccess(null)
    setApiError(null)
    const result = await updateProfile({
      fullName: values.fullName,
      nationalId: values.nationalId || undefined,
    })
    if (!result.ok) {
      setApiError(result.message)
      return
    }
    reset({ fullName: result.user.fullName, nationalId: '' })
    setSuccess('مشخصات شما ذخیره شد.')
  })

  const maskedHint = user?.nationalIdMasked
    ? `کد ملی ثبت‌شده: ${toPersianDigits(user.nationalIdMasked)}`
    : 'کد ملی هنوز ثبت نشده است.'

  return (
    <div>
      <PageHeader
        eyebrow="حساب کاربری"
        title="مشخصات من"
        description="نام و نام خانوادگی و کد ملی خود را تکمیل یا به‌روز کنید. شماره موبایل از طریق ورود پیامکی ثابت است."
      />

      <form
        onSubmit={onSubmit}
        className="max-w-xl space-y-5 rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft sm:p-6"
        noValidate
      >
        <Field label="شماره موبایل" htmlFor="profile-phone" hint="قابل تغییر از این بخش نیست.">
          <Input
            id="profile-phone"
            value={user?.phone ?? ''}
            readOnly
            dir="ltr"
            className="bg-navy-50 text-navy-600"
          />
        </Field>

        <Field
          label="نام و نام خانوادگی"
          htmlFor="profile-fullName"
          required
          error={errors.fullName?.message}
        >
          <Input
            id="profile-fullName"
            autoComplete="name"
            placeholder="مثلاً علی رضایی"
            aria-invalid={Boolean(errors.fullName)}
            {...register('fullName')}
          />
        </Field>

        <Field
          label="کد ملی"
          htmlFor="profile-nationalId"
          error={errors.nationalId?.message}
          hint={
            user?.hasNationalId
              ? `${maskedHint} — برای تغییر، کد ملی جدید را وارد کنید؛ در غیر این صورت خالی بگذارید.`
              : `${maskedHint} — ۱۰ رقم کد ملی را وارد کنید.`
          }
        >
          <Input
            id="profile-nationalId"
            inputMode="numeric"
            autoComplete="off"
            placeholder="۱۰ رقم"
            dir="ltr"
            maxLength={10}
            aria-invalid={Boolean(errors.nationalId)}
            {...register('nationalId', asciiDigitsField)}
          />
        </Field>

        {apiError ? <ErrorBadge>{apiError}</ErrorBadge> : null}
        {success ? (
          <p className="rounded-xl border border-gold-200 bg-gold-50 px-3 py-2 text-sm text-gold-900">
            {success}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button type="submit" variant="accent" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? 'در حال ذخیره…' : 'ذخیره تغییرات'}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting || !isDirty}
            onClick={() => {
              reset({ fullName: user?.fullName ?? '', nationalId: '' })
              setSuccess(null)
              setApiError(null)
            }}
          >
            لغو
          </Button>
        </div>
      </form>
    </div>
  )
}
