import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { CreditCard, CalendarDays, Clock3 } from 'lucide-react'
import { Button, Input, Textarea } from '@/components/ui'
import { formatFaNumber, toPersianDigits } from '@/lib/format'
import { formatJalaliLabel, jalaliFromDate, startOfLocalDay } from '@/lib/jalali'
import { isMockEnabled } from '@/config/env'
import { CONSULTATION_PLANS, getConsultationPlan } from '../constants/consultation-plans'
import { consultationRequestSchema, type ConsultationRequestValues } from '../schemas'
import { getConsultationAvailability, getConsultations } from '../mocks/data'
import { AppEmptyState } from '../components/app-empty-state'
import { BookingCalendar } from '../components/booking-calendar'
import { ConsultationPlanCards } from '../components/consultation-plan-cards'
import { Field } from '../components/field'
import { PageHeader } from '../components/page-header'
import { TimeSlotPicker } from '../components/time-slot-picker'
import type { ConsultationPlanId } from '../types'

export default function ConsultationPage() {
  const availability = useMemo(() => getConsultationAvailability(), [])
  const existing = getConsultations()
  const [submitted, setSubmitted] = useState(false)
  const [viewMonth, setViewMonth] = useState(() => jalaliFromDate(startOfLocalDay()))

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConsultationRequestValues>({
    resolver: zodResolver(consultationRequestSchema),
    defaultValues: {
      planId: undefined,
      topic: '',
      description: '',
      dateKey: '',
      time: '',
      discountCode: '',
    },
  })

  const planId = watch('planId') as ConsultationPlanId | undefined
  const dateKey = watch('dateKey')
  const time = watch('time')
  const selectedPlan = planId ? getConsultationPlan(planId) : null

  const onSubmit = handleSubmit(() => {
    setSubmitted(true)
    reset({
      planId: undefined,
      topic: '',
      description: '',
      dateKey: '',
      time: '',
      discountCode: '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="مشاوره حقوقی"
        title="رزرو مشاوره"
        description="یکی از چهار طرح را انتخاب کنید، روز مناسب را از تقویم مشخص کنید و در طرح‌های حضوری ساعت جلسه را نیز رزرو کنید."
      />

      {submitted ? (
        <div className="rounded-2xl border border-gold-300 bg-gold-100 px-4 py-3 text-sm text-gold-800">
          رزرو ثبت شد. در نسخه کامل، تایید زمان و لینک پرداخت از طریق پیامک ارسال می‌شود.
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-8">
        <section className="space-y-4">
          <SectionTitle step="۱" title="انتخاب طرح مشاوره" />
          <Controller
            name="planId"
            control={control}
            render={({ field }) => (
              <ConsultationPlanCards
                value={field.value}
                onChange={(next) => {
                  field.onChange(next)
                  setValue('dateKey', '')
                  setValue('time', '')
                  setSubmitted(false)
                }}
              />
            )}
          />
          {errors.planId ? (
            <p className="text-xs text-destructive" role="alert">
              {errors.planId.message}
            </p>
          ) : null}
        </section>

        <AnimatePresence mode="wait">
          {selectedPlan ? (
            <motion.section
              key={selectedPlan.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]"
            >
              <div className="space-y-4">
                <SectionTitle
                  step="۲"
                  title={selectedPlan.requiresTime ? 'انتخاب روز و ساعت' : 'انتخاب روز'}
                  hint={
                    selectedPlan.requiresTime
                      ? 'برای مشاوره حضوری علاوه بر روز، ساعت آزاد را هم مشخص کنید.'
                      : 'مشاوره‌های آنلاین فقط با انتخاب روز رزرو می‌شوند؛ ساعت بعداً هماهنگ می‌شود.'
                  }
                />
                <Controller
                  name="dateKey"
                  control={control}
                  render={({ field }) => (
                    <BookingCalendar
                      planId={selectedPlan.id}
                      availability={availability}
                      selectedDate={field.value || undefined}
                      viewMonth={viewMonth}
                      onViewMonthChange={setViewMonth}
                      onSelectDate={(key) => {
                        field.onChange(key)
                        setValue('time', '')
                      }}
                    />
                  )}
                />
                {errors.dateKey ? (
                  <p className="text-xs text-destructive" role="alert">
                    {errors.dateKey.message}
                  </p>
                ) : null}

                {selectedPlan.requiresTime && dateKey ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                      <Clock3 className="size-4 text-gold-600" aria-hidden />
                      ساعت جلسه
                    </h3>
                    <Controller
                      name="time"
                      control={control}
                      render={({ field }) => (
                        <TimeSlotPicker
                          dateKey={dateKey}
                          availability={availability}
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.time?.message}
                        />
                      )}
                    />
                  </motion.div>
                ) : null}
              </div>

              <div className="space-y-5">
                <SectionTitle step="۳" title="جزئیات درخواست" />
                <div className="space-y-5 rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft sm:p-6">
                  <Field label="موضوع مشاوره" htmlFor="topic" required error={errors.topic?.message}>
                    <Input id="topic" placeholder="مثلاً اختلاف قرارداد اجاره" {...register('topic')} />
                  </Field>

                  <Field
                    label="شرح مختصر"
                    htmlFor="description"
                    required
                    error={errors.description?.message}
                    hint="طرفین، موضوع اختلاف و نتیجه مورد انتظار را بنویسید."
                  >
                    <Textarea
                      id="description"
                      placeholder="شرح کوتاه پرونده یا سوال حقوقی…"
                      {...register('description')}
                    />
                  </Field>

                  {!selectedPlan.isFree ? (
                    <Field label="کد تخفیف (اختیاری)" htmlFor="discountCode" error={errors.discountCode?.message}>
                      <Input
                        id="discountCode"
                        placeholder="VAZIN40"
                        className="uppercase"
                        {...register('discountCode')}
                      />
                    </Field>
                  ) : null}

                  <BookingSummary
                    planTitle={selectedPlan.title}
                    lawyerName={selectedPlan.lawyerName}
                    dateKey={dateKey}
                    time={selectedPlan.requiresTime ? time : undefined}
                    price={selectedPlan.price}
                    isFree={selectedPlan.isFree}
                    requiresPayment={selectedPlan.requiresPayment}
                  />

                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {selectedPlan.requiresPayment ? (
                      <>
                        <CreditCard className="size-4" aria-hidden />
                        پرداخت و ثبت رزرو
                      </>
                    ) : (
                      <>
                        <CalendarDays className="size-4" aria-hidden />
                        ثبت رزرو رایگان
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.section>
          ) : (
            <motion.div
              key="empty-plan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-navy-200 bg-navy-50/50 px-5 py-8"
            >
              <AppEmptyState
                title="ابتدا طرح را انتخاب کنید"
                description="پس از انتخاب طرح، تقویم ماه برای رزرو روزهای آزاد نمایش داده می‌شود."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-bold text-navy-900">رزروهای شما</h2>
        {existing.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {existing.map((slot) => (
              <article key={slot.id} className="rounded-2xl border border-navy-200 bg-white p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-navy-900">{slot.topic}</h3>
                    <p className="mt-1 text-xs text-navy-500">
                      {slot.lawyerName} · {slot.modeLabel}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-gold-700">
                    {slot.status === 'available' ? 'آزاد' : slot.status === 'done' ? 'انجام‌شده' : 'رزرو شده'}
                  </span>
                </div>
                <p className="mt-3 text-sm text-navy-600">{slot.startsAt}</p>
                <p className="mt-2 text-sm font-semibold text-navy-900">
                  {slot.price === 0 ? (
                    <span className="text-gold-700">رایگان</span>
                  ) : slot.discountedPrice ? (
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
            ))}
          </div>
        ) : (
          <AppEmptyState
            title="رزروی نمایش داده نمی‌شود"
            description={
              isMockEnabled
                ? 'هنوز رزروی ثبت نشده است.'
                : 'در محیط تولید، رزروها از سرور دریافت می‌شوند.'
            }
          />
        )}
      </section>

      {!isMockEnabled ? (
        <p className="text-xs leading-6 text-navy-500">
          ظرفیت روزها و ساعات از API بارگذاری می‌شود. طرح‌های ثابت: {CONSULTATION_PLANS.map((p) => p.title).join('، ')}.
        </p>
      ) : null}
    </div>
  )
}

function SectionTitle({ step, title, hint }: { step: string; title: string; hint?: string }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="inline-flex size-7 items-center justify-center rounded-lg bg-navy-900 text-xs font-bold text-gold-300">
          {toPersianDigits(step)}
        </span>
        <h2 className="font-display text-lg font-bold text-navy-900">{title}</h2>
      </div>
      {hint ? <p className="mt-2 text-sm leading-7 text-navy-600">{hint}</p> : null}
    </div>
  )
}

function BookingSummary({
  planTitle,
  lawyerName,
  dateKey,
  time,
  price,
  isFree,
  requiresPayment,
}: {
  planTitle: string
  lawyerName: string
  dateKey?: string
  time?: string
  price: number
  isFree: boolean
  requiresPayment: boolean
}) {
  return (
    <div className="rounded-2xl border border-navy-100 bg-navy-50/70 p-4">
      <p className="text-xs font-semibold text-gold-700">خلاصه رزرو</p>
      <ul className="mt-3 space-y-2 text-sm text-navy-700">
        <li className="flex justify-between gap-3">
          <span className="text-navy-500">طرح</span>
          <span className="text-left font-medium">{planTitle}</span>
        </li>
        <li className="flex justify-between gap-3">
          <span className="text-navy-500">مشاور</span>
          <span className="font-medium">{lawyerName}</span>
        </li>
        <li className="flex justify-between gap-3">
          <span className="text-navy-500">روز</span>
          <span className="font-medium">
            {dateKey ? toPersianDigits(formatJalaliLabel(dateKey)) : '—'}
          </span>
        </li>
        {time !== undefined ? (
          <li className="flex justify-between gap-3">
            <span className="text-navy-500">ساعت</span>
            <span className="font-medium">{time ? toPersianDigits(time) : '—'}</span>
          </li>
        ) : null}
        <li className="flex justify-between gap-3 border-t border-navy-200/80 pt-2">
          <span className="text-navy-500">{requiresPayment ? 'مبلغ قابل پرداخت' : 'هزینه'}</span>
          <span className="font-display font-bold text-navy-900">
            {isFree ? 'رایگان' : `${formatFaNumber(price)} تومان`}
          </span>
        </li>
      </ul>
    </div>
  )
}
