import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileStack, ScrollText } from 'lucide-react'
import { Button, Input, Textarea } from '@/components/ui'
import { cn } from '@/lib/utils'
import { toPersianDigits } from '@/lib/format'
import {
  documentRequestFieldsSchema,
  type DocumentRequestValues,
} from '../schemas'
import { DOCUMENT_TYPE_OPTIONS } from '../constants/nav'
import { DOCUMENT_FILE_RULE_SECTIONS } from '../constants/case-intake'
import { CaseFileUploader } from '../components/case-file-uploader'
import { CaseFormHelpBanner } from '../components/case-form-help-banner'
import { CaseRulesDropdowns } from '../components/case-rules-dropdowns'
import { Field } from '../components/field'
import { PageHeader } from '../components/page-header'
import type { CaseFileMeta } from '../types'

export default function DocumentRequestPage() {
  const [done, setDone] = useState(false)
  const [files, setFiles] = useState<CaseFileMeta[]>([])
  const [fileError, setFileError] = useState<string>()
  const [formErrorBanner, setFormErrorBanner] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DocumentRequestValues>({
    resolver: zodResolver(documentRequestFieldsSchema),
    shouldFocusError: true,
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
      acceptFileRules: false,
    },
  })

  const documentType = watch('documentType')

  const onSubmit = handleSubmit(
    () => {
      clearErrors('acceptFileRules')
      setFormErrorBanner(false)

      if (!getValues('acceptFileRules')) {
        setError('acceptFileRules', {
          type: 'manual',
          message: 'پذیرش قوانین ارسال فایل الزامی است',
        })
        document.getElementById('document-upload-section')?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        return
      }

      if (files.length === 0) {
        setFileError('حداقل یک فایل از مدارک پرونده را پیوست کنید')
        document.getElementById('document-upload-section')?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        return
      }

      setFileError(undefined)
      setDone(true)
      setFiles([])
      reset({
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
        acceptFileRules: false,
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    () => {
      setFormErrorBanner(true)
      window.setTimeout(() => {
        document.querySelector<HTMLElement>('[role="alert"]')?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 50)
    },
  )

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        eyebrow="درخواست اسناد قضایی"
        title="دادخواست، اظهارنامه و سایر اوراق"
        description="فیلدها بر اساس ماده ۵۱ آیین دادرسی مدنی و الزامات عملی اظهارنامه طراحی شده‌اند. پس از تکمیل فرم، قوانین را بپذیرید و مدارک پرونده را بارگذاری کنید."
      />

      <CaseFormHelpBanner />

      {done ? (
        <div className="rounded-2xl border border-gold-300 bg-gold-100 px-4 py-3 text-sm text-gold-800">
          درخواست ثبت شد. پیش‌نویس توسط وکیل بررسی و برای تایید شما ارسال می‌شود.
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        {formErrorBanner ? (
          <div
            className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            لطفاً فیلدهای الزامی را کامل کنید، قوانین ارسال را بپذیرید و مدارک را آپلود کنید.
          </div>
        ) : null}

        <section className="rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft sm:p-7">
          <SectionHeading
            icon={<ScrollText className="size-4" aria-hidden />}
            title="نوع درخواست"
            hint="اوراق مورد نیاز را انتخاب کنید تا فرم متناسب با همان سند تکمیل شود."
          />
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DOCUMENT_TYPE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={cn(
                  'cursor-pointer rounded-2xl border px-4 py-3.5 text-sm font-medium transition-all duration-200',
                  'min-h-12 focus-within:ring-2 focus-within:ring-gold-400/40',
                  documentType === option.value
                    ? 'border-gold-400 bg-gold-100 text-navy-900 shadow-soft'
                    : 'border-navy-200 bg-navy-50/50 text-navy-700 hover:border-gold-300',
                )}
              >
                <input type="radio" value={option.value} className="sr-only" {...register('documentType')} />
                {option.label}
              </label>
            ))}
          </div>
          {errors.documentType ? (
            <p className="mt-2 text-xs text-destructive" role="alert">
              {errors.documentType.message}
            </p>
          ) : null}
        </section>

        <section className="space-y-5 rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft sm:p-7">
          <SectionHeading
            title="مشخصات خواهان / اظهارکننده"
            hint="نام، نام پدر، کد ملی و اقامتگاه مطابق ماده ۵۱ آیین دادرسی مدنی."
          />
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
              <Input
                id="plaintiffNationalId"
                inputMode="numeric"
                maxLength={10}
                dir="ltr"
                className="text-left"
                {...register('plaintiffNationalId')}
              />
            </Field>
            <Field
              label="اقامتگاه کامل"
              htmlFor="plaintiffAddress"
              required
              error={errors.plaintiffAddress?.message}
              hint="شهر، خیابان، پلاک — برای ابلاغ"
              className="sm:col-span-2"
            >
              <Textarea id="plaintiffAddress" rows={3} {...register('plaintiffAddress')} />
            </Field>
          </div>
        </section>

        <section className="space-y-5 rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft sm:p-7">
          <SectionHeading title="مشخصات خوانده / مخاطب" hint="طرف مقابل دعوا یا مخاطب اظهارنامه را مشخص کنید." />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="نام طرف مقابل" htmlFor="defendantName" required error={errors.defendantName?.message}>
              <Input id="defendantName" {...register('defendantName')} />
            </Field>
            <Field
              label="اقامتگاه طرف مقابل"
              htmlFor="defendantAddress"
              required
              error={errors.defendantAddress?.message}
            >
              <Input id="defendantAddress" {...register('defendantAddress')} />
            </Field>
          </div>
        </section>

        <section className="space-y-5 rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft sm:p-7">
          <SectionHeading title="خواسته، جهات و ادله" hint="خواسته، مبنای استحقاق و آنچه از مرجع می‌خواهید را روشن بنویسید." />
          <Field label="عنوان خواسته" htmlFor="claimTitle" required error={errors.claimTitle?.message}>
            <Input id="claimTitle" placeholder="مثلاً الزام به تنظیم سند رسمی" {...register('claimTitle')} />
          </Field>
          <Field
            label="بهای خواسته (در صورت مالی بودن)"
            htmlFor="claimAmount"
            error={errors.claimAmount?.message}
            hint="اگر خواسته غیرمالی است خالی بگذارید"
          >
            <Input id="claimAmount" placeholder="مبلغ به ریال" dir="ltr" className="text-left" {...register('claimAmount')} />
          </Field>
          <Field
            label="تعهدات و جهات استحقاق"
            htmlFor="claimBasis"
            required
            error={errors.claimBasis?.message}
            hint="مبنای حقوقی مطالبه را روشن بنویسید"
          >
            <Textarea id="claimBasis" rows={4} {...register('claimBasis')} />
          </Field>
          <Field label="آنچه از مرجع درخواست دارید" htmlFor="courtRequest" required error={errors.courtRequest?.message}>
            <Textarea id="courtRequest" rows={3} {...register('courtRequest')} />
          </Field>
          <Field
            label="ادله و منضمات"
            htmlFor="evidenceSummary"
            required
            error={errors.evidenceSummary?.message}
            hint="اسناد، شهود، کارشناسی و … — فایل‌های مربوط را در بخش بعدی آپلود کنید."
          >
            <Textarea id="evidenceSummary" rows={3} {...register('evidenceSummary')} />
          </Field>
          <Field label="توضیحات تکمیلی" htmlFor="notes" error={errors.notes?.message}>
            <Textarea id="notes" rows={3} {...register('notes')} />
          </Field>
        </section>

        <section
          id="document-upload-section"
          className="scroll-mt-24 space-y-5 rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft sm:p-7"
        >
          <SectionHeading
            icon={<FileStack className="size-4" aria-hidden />}
            title="آپلود مدارک پرونده"
            hint={`حداقل یک فایل پیوست کنید. ${toPersianDigits(files.length)} فایل انتخاب شده است.`}
          />

          <CaseFileUploader files={files} onChange={setFiles} error={fileError} />

          <CaseRulesDropdowns
            rulesTitle="قوانین ارسال اسناد و منضمات"
            deliveryTitle="روش‌های ارسال مدارک سند"
            rules={DOCUMENT_FILE_RULE_SECTIONS}
          />

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-navy-100 bg-navy-50/50 p-4">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-navy-300 text-navy-900 focus-visible:ring-gold-400"
              {...register('acceptFileRules')}
            />
            <span className="text-sm leading-7 text-navy-700">
              قوانین ارسال فایل و روش‌های ارسال مدارک را خوانده‌ام و می‌پذیرم.
              {errors.acceptFileRules ? (
                <span className="mt-1 block text-xs text-destructive" role="alert">
                  {errors.acceptFileRules.message}
                </span>
              ) : null}
            </span>
          </label>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="submit" variant="accent" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
            ارسال درخواست تنظیم سند
          </Button>
        </div>
      </form>
    </div>
  )
}

function SectionHeading({
  title,
  hint,
  icon,
}: {
  title: string
  hint: string
  icon?: ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {icon ? (
          <span className="inline-flex size-8 items-center justify-center rounded-xl bg-navy-900 text-gold-300">
            {icon}
          </span>
        ) : null}
        <h2 className="font-display text-lg font-bold text-navy-900">{title}</h2>
      </div>
      <p className="mt-1.5 text-sm leading-7 text-navy-600">{hint}</p>
    </div>
  )
}
