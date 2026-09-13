import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Textarea } from '@/components/ui'
import { formatFaNumber } from '@/lib/format'
import { isMockEnabled } from '@/config/env'
import { consultationRequestSchema, type ConsultationRequestValues } from '../schemas'
import { getConsultations } from '../mocks/data'
import { AppEmptyState } from '../components/app-empty-state'
import { Field } from '../components/field'
import { PageHeader } from '../components/page-header'

export default function ConsultationPage() {
  const slots = getConsultations()
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ConsultationRequestValues>({
    resolver: zodResolver(consultationRequestSchema),
    defaultValues: {
      topic: '',
      mode: 'video',
      description: '',
      preferredTime: '',
      discountCode: '',
    },
  })

  const onSubmit = handleSubmit(() => {
    setSubmitted(true)
    reset()
  })

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="مشاوره حقوقی"
        title="رزرو مشاوره آنلاین"
        description="موضوع را مشخص کنید تا وکیل متخصص همان حوزه با شما هماهنگ شود — ویدیویی، تلفنی یا چت."
      />

      {submitted ? (
        <div className="rounded-2xl border border-gold-300 bg-gold-100 px-4 py-3 text-sm text-gold-800">
          درخواست مشاوره ثبت شد. در نسخه کامل، زمان‌بندی از طریق پیامک تایید می‌شود.
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={onSubmit} className="space-y-5 rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft sm:p-7">
          <Field label="موضوع مشاوره" htmlFor="topic" required error={errors.topic?.message}>
            <Input id="topic" placeholder="مثلاً اختلاف قرارداد اجاره" {...register('topic')} />
          </Field>

          <Field label="نحوه برگزاری" htmlFor="mode" required error={errors.mode?.message}>
            <select
              id="mode"
              className="h-11 w-full rounded-xl border border-navy-200 bg-white px-3.5 text-sm text-navy-900 shadow-soft focus-visible:border-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/30"
              {...register('mode')}
            >
              <option value="video">ویدیویی</option>
              <option value="voice">تلفنی</option>
              <option value="chat">چت آنلاین</option>
            </select>
          </Field>

          <Field
            label="شرح مختصر"
            htmlFor="description"
            required
            error={errors.description?.message}
            hint="طرفین، موضوع اختلاف و نتیجه مورد انتظار را بنویسید."
          >
            <Textarea id="description" placeholder="شرح کوتاه پرونده یا سوال حقوقی…" {...register('description')} />
          </Field>

          <Field label="زمان پیشنهادی" htmlFor="preferredTime" required error={errors.preferredTime?.message}>
            <Input id="preferredTime" placeholder="مثلاً چهارشنبه بعدازظهر" {...register('preferredTime')} />
          </Field>

          <Field label="کد تخفیف (اختیاری)" htmlFor="discountCode" error={errors.discountCode?.message}>
            <Input id="discountCode" placeholder="VAZIN40" className="uppercase" {...register('discountCode')} />
          </Field>

          <Button type="submit" variant="accent" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
            ثبت درخواست مشاوره
          </Button>
        </form>

        <div className="space-y-4">
          <h2 className="font-display text-lg font-bold">نوبت‌های قابل رزرو</h2>
          {slots.length > 0 ? (
            slots.map((slot) => (
              <article key={slot.id} className="rounded-2xl border border-navy-200 bg-white p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{slot.topic}</h3>
                    <p className="mt-1 text-xs text-navy-500">
                      {slot.lawyerName} · {slot.modeLabel}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-gold-700">
                    {slot.status === 'available' ? 'آزاد' : 'رزرو شده'}
                  </span>
                </div>
                <p className="mt-3 text-sm text-navy-600">{slot.startsAt}</p>
                <p className="mt-2 text-sm font-semibold text-navy-900">
                  {slot.discountedPrice ? (
                    <>
                      <span className="text-gold-700">{formatFaNumber(slot.discountedPrice)} تومان</span>
                      <span className="mr-2 text-xs text-navy-400 line-through">
                        {formatFaNumber(slot.price)}
                      </span>
                    </>
                  ) : (
                    <>{formatFaNumber(slot.price)} تومان</>
                  )}
                </p>
              </article>
            ))
          ) : (
            <AppEmptyState
              title="نوبتی نمایش داده نمی‌شود"
              description={
                isMockEnabled
                  ? 'داده‌ای یافت نشد.'
                  : 'در محیط تولید، نوبت‌ها از سرور دریافت می‌شوند.'
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
