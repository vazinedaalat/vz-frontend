import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Textarea } from '@/components/ui'
import { createCaseSchema, type CreateCaseValues } from '../schemas'
import { CASE_CATEGORY_OPTIONS } from '../constants/nav'
import { Field } from '../components/field'
import { PageHeader } from '../components/page-header'

export default function CreateCasePage() {
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateCaseValues>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      title: '',
      category: 'ملکی',
      summary: '',
      opponentName: '',
      city: '',
      urgency: 'عادی',
    },
  })

  const onSubmit = handleSubmit(() => {
    setDone(true)
    reset()
  })

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="ایجاد پرونده"
        title="تشکیل پرونده آنلاین"
        description="بدون حضور در دفتر، پرونده را باز کنید. وکیل متخصص همان موضوع ادامه مسیر را بر عهده می‌گیرد."
        action={
          <Button variant="outline" asChild>
            <Link to="/app/cases">بازگشت</Link>
          </Button>
        }
      />

      {done ? (
        <div className="mb-6 rounded-2xl border border-gold-300 bg-gold-100 px-4 py-3 text-sm text-gold-800">
          پرونده آزمایشی ثبت شد. در نسخه واقعی، شماره پرونده و وکیل مسئول پیامک می‌شود.
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-5 rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft sm:p-8">
        <Field label="عنوان پرونده" htmlFor="title" required error={errors.title?.message}>
          <Input id="title" placeholder="مثلاً الزام به تنظیم سند رسمی" {...register('title')} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="حوزه موضوعی" htmlFor="category" required error={errors.category?.message}>
            <select
              id="category"
              className="h-11 w-full rounded-xl border border-navy-200 bg-white px-3.5 text-sm shadow-soft focus-visible:border-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/30"
              {...register('category')}
            >
              {CASE_CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <Field label="فوریت" htmlFor="urgency" required error={errors.urgency?.message}>
            <select
              id="urgency"
              className="h-11 w-full rounded-xl border border-navy-200 bg-white px-3.5 text-sm shadow-soft focus-visible:border-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/30"
              {...register('urgency')}
            >
              <option value="عادی">عادی</option>
              <option value="فوری">فوری</option>
              <option value="خیلی فوری">خیلی فوری</option>
            </select>
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="نام طرف مقابل" htmlFor="opponentName" required error={errors.opponentName?.message}>
            <Input id="opponentName" {...register('opponentName')} />
          </Field>
          <Field label="شهر" htmlFor="city" required error={errors.city?.message}>
            <Input id="city" placeholder="تهران" {...register('city')} />
          </Field>
        </div>

        <Field
          label="شرح خلاصه"
          htmlFor="summary"
          required
          error={errors.summary?.message}
          hint="وقایع مهم، خواسته تقریبی و مدارک در دسترس را بنویسید."
        >
          <Textarea id="summary" {...register('summary')} />
        </Field>

        <Button type="submit" variant="accent" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
          ایجاد پرونده
        </Button>
      </form>
    </div>
  )
}
