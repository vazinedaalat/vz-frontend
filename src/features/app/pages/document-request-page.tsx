import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Textarea } from '@/components/ui'
import { documentRequestSchema, type DocumentRequestValues } from '../schemas'
import { DOCUMENT_TYPE_OPTIONS } from '../constants/nav'
import { Field } from '../components/field'
import { PageHeader } from '../components/page-header'

export default function DocumentRequestPage() {
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DocumentRequestValues>({
    resolver: zodResolver(documentRequestSchema),
    defaultValues: {
      documentType: 'petition',
      plaintiffName: '',
      plaintiffFatherName: '',
      plaintiffNationalId: '',
      plaintiffAddress: '',
      defendantName: '',
      defendantAddress: '',
      claimTitle: '',
      claimAmount: '',
      claimBasis: '',
      courtRequest: '',
      evidenceSummary: '',
      notes: '',
    },
  })

  const documentType = watch('documentType')

  const onSubmit = handleSubmit(() => {
    setDone(true)
    reset()
  })

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="درخواست اسناد قضایی"
        title="دادخواست، اظهارنامه و سایر اوراق"
        description="فیلدها بر اساس ماده ۵۱ آیین دادرسی مدنی (دادخواست) و الزامات عملی اظهارنامه طراحی شده‌اند تا وکیل متن را دقیق تنظیم کند."
      />

      {done ? (
        <div className="mb-6 rounded-2xl border border-gold-300 bg-gold-100 px-4 py-3 text-sm text-gold-800">
          درخواست ثبت شد. پیش‌نویس توسط وکیل بررسی و برای تایید شما ارسال می‌شود.
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-8">
        <section className="rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft sm:p-7">
          <h2 className="font-display text-lg font-bold">نوع درخواست</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DOCUMENT_TYPE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm transition-colors ${
                  documentType === option.value
                    ? 'border-gold-400 bg-gold-100 text-navy-900'
                    : 'border-navy-200 bg-navy-50/50 text-navy-700 hover:border-gold-300'
                }`}
              >
                <input type="radio" value={option.value} className="sr-only" {...register('documentType')} />
                {option.label}
              </label>
            ))}
          </div>
          {errors.documentType ? (
            <p className="mt-2 text-xs text-destructive">{errors.documentType.message}</p>
          ) : null}
        </section>

        <section className="space-y-5 rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft sm:p-7">
          <h2 className="font-display text-lg font-bold">مشخصات خواهان / اظهارکننده</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="نام و نام خانوادگی" htmlFor="plaintiffName" required error={errors.plaintiffName?.message}>
              <Input id="plaintiffName" {...register('plaintiffName')} />
            </Field>
            <Field label="نام پدر" htmlFor="plaintiffFatherName" required error={errors.plaintiffFatherName?.message}>
              <Input id="plaintiffFatherName" {...register('plaintiffFatherName')} />
            </Field>
            <Field
              label="کد ملی"
              htmlFor="plaintiffNationalId"
              required
              error={errors.plaintiffNationalId?.message}
              hint="۱۰ رقم؛ مطابق اطلاعات ثنا"
            >
              <Input id="plaintiffNationalId" inputMode="numeric" dir="ltr" {...register('plaintiffNationalId')} />
            </Field>
            <Field
              label="اقامتگاه کامل"
              htmlFor="plaintiffAddress"
              required
              error={errors.plaintiffAddress?.message}
              hint="شهر، خیابان، پلاک — برای ابلاغ"
              className="sm:col-span-2"
            >
              <Textarea id="plaintiffAddress" {...register('plaintiffAddress')} />
            </Field>
          </div>
        </section>

        <section className="space-y-5 rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft sm:p-7">
          <h2 className="font-display text-lg font-bold">مشخصات خوانده / مخاطب</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="نام طرف مقابل" htmlFor="defendantName" required error={errors.defendantName?.message}>
              <Input id="defendantName" {...register('defendantName')} />
            </Field>
            <Field label="اقامتگاه طرف مقابل" htmlFor="defendantAddress" required error={errors.defendantAddress?.message}>
              <Input id="defendantAddress" {...register('defendantAddress')} />
            </Field>
          </div>
        </section>

        <section className="space-y-5 rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft sm:p-7">
          <h2 className="font-display text-lg font-bold">خواسته، جهات و ادله</h2>
          <Field label="عنوان خواسته" htmlFor="claimTitle" required error={errors.claimTitle?.message}>
            <Input id="claimTitle" placeholder="مثلاً الزام به تنظیم سند رسمی" {...register('claimTitle')} />
          </Field>
          <Field
            label="بهای خواسته (در صورت مالی بودن)"
            htmlFor="claimAmount"
            error={errors.claimAmount?.message}
            hint="اگر خواسته غیرمالی است خالی بگذارید"
          >
            <Input id="claimAmount" placeholder="مبلغ به ریال" dir="ltr" {...register('claimAmount')} />
          </Field>
          <Field
            label="تعهدات و جهات استحقاق"
            htmlFor="claimBasis"
            required
            error={errors.claimBasis?.message}
            hint="مبنای حقوقی مطالبه را روشن بنویسید"
          >
            <Textarea id="claimBasis" {...register('claimBasis')} />
          </Field>
          <Field label="آنچه از مرجع درخواست دارید" htmlFor="courtRequest" required error={errors.courtRequest?.message}>
            <Textarea id="courtRequest" {...register('courtRequest')} />
          </Field>
          <Field
            label="ادله و منضمات"
            htmlFor="evidenceSummary"
            required
            error={errors.evidenceSummary?.message}
            hint="اسناد، شهود، کارشناسی و ..."
          >
            <Textarea id="evidenceSummary" {...register('evidenceSummary')} />
          </Field>
          <Field label="توضیحات تکمیلی" htmlFor="notes" error={errors.notes?.message}>
            <Textarea id="notes" {...register('notes')} />
          </Field>
        </section>

        <Button type="submit" variant="accent" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
          ارسال درخواست تنظیم سند
        </Button>
      </form>
    </div>
  )
}
