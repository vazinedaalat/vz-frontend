import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, FolderCheck } from 'lucide-react'
import { Button, Input, Textarea } from '@/components/ui'
import { isMockEnabled } from '@/config/env'
import { createCaseIntakeSchema, type CreateCaseValues } from '../schemas'
import { CASE_CATEGORY_OPTIONS } from '../constants/nav'
import {
  CLAIM_TYPE_OPTIONS,
  CLIENT_ROLE_OPTIONS,
  PROCEEDING_TYPE_OPTIONS,
} from '../constants/case-intake'
import { getCasePrepaymentInvoice } from '../mocks/data'
import { CaseFileUploader } from '../components/case-file-uploader'
import { CaseFormHelpBanner } from '../components/case-form-help-banner'
import { CasePrepaymentPanel } from '../components/case-prepayment-panel'
import { CaseRulesDropdowns } from '../components/case-rules-dropdowns'
import { CaseWizardSteps } from '../components/case-wizard-steps'
import { Field } from '../components/field'
import { PageHeader } from '../components/page-header'
import type { CaseFileMeta, CasePrepaymentInvoice, CreateCaseWizardStep } from '../types'

const selectClassName =
  'h-11 w-full rounded-xl border border-navy-200 bg-white px-3.5 text-sm text-navy-900 shadow-soft focus-visible:border-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/30'

export default function CreateCasePage() {
  const [step, setStep] = useState<CreateCaseWizardStep>('intake')
  const [files, setFiles] = useState<CaseFileMeta[]>([])
  const [fileError, setFileError] = useState<string>()
  const [waitingInvoice, setWaitingInvoice] = useState(false)
  const [invoice, setInvoice] = useState<CasePrepaymentInvoice | null>(null)
  const [paying, setPaying] = useState(false)
  const [intakeErrorBanner, setIntakeErrorBanner] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreateCaseValues>({
    resolver: zodResolver(createCaseIntakeSchema),
    shouldFocusError: true,
    defaultValues: {
      clientRole: 'خواهان',
      clientFullName: '',
      clientFatherName: '',
      clientNationalId: '',
      clientPhone: '',
      clientAddress: '',
      title: '',
      claimType: 'مطالبه وجه / خسارت',
      category: 'ملکی',
      proceedingType: 'حقوقی',
      summary: '',
      legalBasis: '',
      opponentName: '',
      opponentAddress: '',
      city: '',
      courtHint: '',
      urgency: 'عادی',
      hasThanaAccount: 'نامشخص',
      priorCaseNumber: '',
      acceptFileRules: false,
    },
  })

  useEffect(() => {
    if (!waitingInvoice) return

    if (!isMockEnabled) {
      setWaitingInvoice(false)
      setInvoice(null)
      return
    }

    const timer = window.setTimeout(() => {
      setInvoice(getCasePrepaymentInvoice())
      setWaitingInvoice(false)
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [waitingInvoice])

  const goToUpload = handleSubmit(
    () => {
      setIntakeErrorBanner(false)
      setStep('upload')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    () => {
      setIntakeErrorBanner(true)
      window.setTimeout(() => {
        document.querySelector<HTMLElement>('[role="alert"]')?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 50)
    },
  )

  const submitUpload = () => {
    clearErrors('acceptFileRules')
    if (!getValues('acceptFileRules')) {
      setError('acceptFileRules', {
        type: 'manual',
        message: 'پذیرش قوانین ارسال فایل الزامی است',
      })
      return
    }
    if (files.length === 0) {
      setFileError('حداقل یک فایل پیوست کنید')
      return
    }
    setFileError(undefined)
    setStep('prepayment')
    setWaitingInvoice(true)
    setInvoice(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onPay = () => {
    setPaying(true)
    window.setTimeout(() => {
      setPaying(false)
      setStep('completed')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 900)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        eyebrow="ایجاد پرونده"
        title="تشکیل پرونده آنلاین"
        description="اطلاعات را بر اساس الزامات عملی آیین دادرسی تکمیل کنید، مدارک را بارگذاری کنید و پس از پیش‌پرداخت مسیر پرونده ادامه می‌یابد."
        action={
          <Button variant="outline" asChild>
            <Link to="/app/cases">بازگشت</Link>
          </Button>
        }
      />

      <CaseWizardSteps current={step} />

      {step === 'intake' || step === 'upload' ? <CaseFormHelpBanner /> : null}

      <AnimatePresence mode="wait">
        {step === 'intake' ? (
          <motion.form
            key="intake"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            onSubmit={goToUpload}
            className="space-y-6"
            noValidate
          >
            {intakeErrorBanner ? (
              <div
                className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                role="alert"
              >
                لطفاً فیلدهای الزامی را کامل کنید تا بتوانید به مرحله آپلود مدارک بروید.
              </div>
            ) : null}

            <section className="rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft sm:p-7">
              <SectionHeading
                title="مشخصات موکل"
                hint="مطابق ماده ۵۱ آیین دادرسی مدنی: نام، نام پدر، اقامتگاه و مشخصات طرفین باید روشن باشد."
              />
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="سمت در دعوا" htmlFor="clientRole" required error={errors.clientRole?.message}>
                  <select id="clientRole" className={selectClassName} {...register('clientRole')}>
                    {CLIENT_ROLE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="نام و نام خانوادگی"
                  htmlFor="clientFullName"
                  required
                  error={errors.clientFullName?.message}
                >
                  <Input id="clientFullName" {...register('clientFullName')} />
                </Field>
                <Field label="نام پدر" htmlFor="clientFatherName" required error={errors.clientFatherName?.message}>
                  <Input id="clientFatherName" {...register('clientFatherName')} />
                </Field>
                <Field label="کد ملی" htmlFor="clientNationalId" required error={errors.clientNationalId?.message}>
                  <Input
                    id="clientNationalId"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="۱۰ رقم"
                    {...register('clientNationalId')}
                  />
                </Field>
                <Field label="موبایل" htmlFor="clientPhone" required error={errors.clientPhone?.message}>
                  <Input
                    id="clientPhone"
                    inputMode="tel"
                    placeholder="0912…"
                    dir="ltr"
                    className="text-left"
                    {...register('clientPhone')}
                  />
                </Field>
                <Field label="حساب ثنا" htmlFor="hasThanaAccount" required error={errors.hasThanaAccount?.message}>
                  <select id="hasThanaAccount" className={selectClassName} {...register('hasThanaAccount')}>
                    <option value="بله">بله</option>
                    <option value="خیر">خیر</option>
                    <option value="نامشخص">نامشخص</option>
                  </select>
                </Field>
              </div>
              <div className="mt-5">
                <Field
                  label="اقامتگاه"
                  htmlFor="clientAddress"
                  required
                  error={errors.clientAddress?.message}
                  hint="شهر، خیابان، پلاک و کدپستی در صورت امکان."
                >
                  <Textarea id="clientAddress" rows={3} {...register('clientAddress')} />
                </Field>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft sm:p-7">
              <SectionHeading
                title="موضوع دعوا و خواسته"
                hint="عنوان خواسته، نوع رسیدگی و مبنای استحقاق را مشخص کنید تا صلاحیت و مسیر پرونده روشن شود."
              />
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field
                  label="عنوان / خواسته"
                  htmlFor="title"
                  required
                  error={errors.title?.message}
                  className="sm:col-span-2"
                >
                  <Input id="title" placeholder="مثلاً الزام به تنظیم سند رسمی ملک" {...register('title')} />
                </Field>
                <Field label="نوع خواسته" htmlFor="claimType" required error={errors.claimType?.message}>
                  <select id="claimType" className={selectClassName} {...register('claimType')}>
                    {CLAIM_TYPE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="حوزه موضوعی" htmlFor="category" required error={errors.category?.message}>
                  <select id="category" className={selectClassName} {...register('category')}>
                    {CASE_CATEGORY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="نوع رسیدگی" htmlFor="proceedingType" required error={errors.proceedingType?.message}>
                  <select id="proceedingType" className={selectClassName} {...register('proceedingType')}>
                    {PROCEEDING_TYPE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="فوریت" htmlFor="urgency" required error={errors.urgency?.message}>
                  <select id="urgency" className={selectClassName} {...register('urgency')}>
                    <option value="عادی">عادی</option>
                    <option value="فوری">فوری</option>
                    <option value="خیلی فوری">خیلی فوری</option>
                  </select>
                </Field>
                <Field label="شهر" htmlFor="city" required error={errors.city?.message}>
                  <Input id="city" placeholder="محل اقامتگاه / وقوع" {...register('city')} />
                </Field>
                <Field
                  label="مرجع صالح احتمالی (اختیاری)"
                  htmlFor="courtHint"
                  error={errors.courtHint?.message}
                  hint="مثلاً دادگاه عمومی حقوقی تهران / شورای حل اختلاف"
                >
                  <Input id="courtHint" {...register('courtHint')} />
                </Field>
              </div>

              <div className="mt-5 grid gap-5">
                <Field
                  label="شرح وقایع"
                  htmlFor="summary"
                  required
                  error={errors.summary?.message}
                  hint="ترتیب زمانی وقایع، طرفین و نتیجه مورد انتظار را بنویسید."
                >
                  <Textarea id="summary" rows={5} {...register('summary')} />
                </Field>
                <Field
                  label="مبنای حقوقی / تعهد"
                  htmlFor="legalBasis"
                  required
                  error={errors.legalBasis?.message}
                  hint="قرارداد، چک، رای قبلی، یا ماده قانونی مرتبط را ذکر کنید."
                >
                  <Textarea id="legalBasis" rows={3} {...register('legalBasis')} />
                </Field>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft sm:p-7">
              <SectionHeading title="طرف مقابل" hint="نام و در صورت امکان اقامتگاه خوانده / مشتکی‌عنه." />
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="نام طرف مقابل" htmlFor="opponentName" required error={errors.opponentName?.message}>
                  <Input id="opponentName" {...register('opponentName')} />
                </Field>
                <Field
                  label="شماره پرونده قبلی (اختیاری)"
                  htmlFor="priorCaseNumber"
                  error={errors.priorCaseNumber?.message}
                >
                  <Input id="priorCaseNumber" placeholder="در صورت وجود" {...register('priorCaseNumber')} />
                </Field>
                <Field
                  label="اقامتگاه طرف مقابل (اختیاری)"
                  htmlFor="opponentAddress"
                  error={errors.opponentAddress?.message}
                  className="sm:col-span-2"
                >
                  <Textarea id="opponentAddress" rows={3} {...register('opponentAddress')} />
                </Field>
              </div>
            </section>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="submit" variant="accent" size="lg" className="w-full sm:w-auto">
                ادامه به آپلود مدارک
                <ArrowLeft className="size-4" aria-hidden />
              </Button>
            </div>
          </motion.form>
        ) : null}

        {step === 'upload' ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <section className="rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft sm:p-7">
              <SectionHeading
                title="بارگذاری مدارک پرونده"
                hint={`پرونده «${getValues('title') || 'بدون عنوان'}» — پس از ارسال، منتظر پیش‌فاکتور بمانید.`}
              />
              <div className="mt-5">
                <CaseFileUploader files={files} onChange={setFiles} error={fileError} />
              </div>
              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-navy-100 bg-navy-50/50 p-4">
                <input
                  type="checkbox"
                  className="mt-1 size-4 rounded border-navy-300 text-navy-900 focus-visible:ring-gold-400"
                  {...register('acceptFileRules')}
                />
                <span className="text-sm leading-7 text-navy-700">
                  قوانین ارسال فایل و روش‌های ارسال را خوانده‌ام و می‌پذیرم.
                  {errors.acceptFileRules ? (
                    <span className="mt-1 block text-xs text-destructive" role="alert">
                      {errors.acceptFileRules.message}
                    </span>
                  ) : null}
                </span>
              </label>
            </section>

            <CaseRulesDropdowns />

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => setStep('intake')}
              >
                <ArrowRight className="size-4" aria-hidden />
                بازگشت به فرم
              </Button>
              <Button type="button" variant="accent" size="lg" className="w-full sm:w-auto" onClick={submitUpload}>
                ارسال مدارک و دریافت پیش‌فاکتور
                <ArrowLeft className="size-4" aria-hidden />
              </Button>
            </div>
          </motion.div>
        ) : null}

        {step === 'prepayment' ? (
          <motion.div
            key="prepayment"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <CasePrepaymentPanel waiting={waitingInvoice} invoice={invoice} paying={paying} onPay={onPay} />
          </motion.div>
        ) : null}

        {step === 'completed' ? (
          <motion.section
            key="completed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-[1.5rem] border border-navy-200 bg-white p-6 text-center shadow-soft sm:p-10"
          >
            <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-navy-900 text-gold-300">
              <FolderCheck className="size-7" aria-hidden />
            </span>
            <h2 className="font-display mt-5 text-2xl font-bold text-navy-900">پیش‌پرداخت انجام شد</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-navy-600">
              پرونده وارد مسیر بررسی می‌شود: تخصیص وکیل، بازبینی مدارک، تنظیم اوراق لازم و اطلاع‌رسانی مراحل بعدی
              در بخش پرونده‌ها و اطلاعیه‌ها.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild variant="accent" size="lg">
                <Link to="/app/cases">مشاهده پرونده‌ها</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/app/notifications">اطلاعیه‌ها</Link>
              </Button>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function SectionHeading({ title, hint }: { title: string; hint: string }) {
  return (
    <div>
      <h2 className="font-display text-lg font-bold text-navy-900">{title}</h2>
      <p className="mt-1.5 text-sm leading-7 text-navy-600">{hint}</p>
    </div>
  )
}
