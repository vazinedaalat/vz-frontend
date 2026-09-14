import { z } from 'zod'

/** Iranian mobile numbers: 09XXXXXXXXX */
export const iranianMobileSchema = z
  .string()
  .trim()
  .regex(/^09\d{9}$/, 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد')

export const otpSchema = z
  .string()
  .trim()
  .regex(/^\d{5}$/, 'کد تایید باید ۵ رقم باشد')

export const smsLoginPhoneSchema = z.object({
  phone: iranianMobileSchema,
})

export const smsLoginOtpSchema = z.object({
  phone: iranianMobileSchema,
  code: otpSchema,
})

export const consultationRequestSchema = z
  .object({
    planId: z.enum(['free-online', 'specialist-online', 'in-person', 'dargahi-premium'], {
      required_error: 'طرح مشاوره را انتخاب کنید',
    }),
    topic: z.string().min(3, 'موضوع مشاوره را وارد کنید'),
    description: z.string().min(20, 'حداقل ۲۰ نویسه توضیح دهید'),
    dateKey: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'تاریخ رزرو را از تقویم انتخاب کنید'),
    time: z.string().optional(),
    discountCode: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    const needsTime = values.planId === 'in-person' || values.planId === 'dargahi-premium'
    if (needsTime && !values.time) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ساعت جلسه را انتخاب کنید',
        path: ['time'],
      })
    }
  })

const createCaseIntakeFields = {
  clientRole: z.enum(
    ['خواهان', 'خوانده', 'شاکی', 'مشتکی‌عنه', 'متقاضی', 'وکیل / نماینده', 'سایر'],
    { required_error: 'سمت خود را مشخص کنید' },
  ),
  clientFullName: z.string().min(3, 'نام و نام خانوادگی را کامل وارد کنید'),
  clientFatherName: z.string().min(2, 'نام پدر را وارد کنید'),
  clientNationalId: z.string().regex(/^\d{10}$/, 'کد ملی باید ۱۰ رقم باشد'),
  clientPhone: iranianMobileSchema,
  clientAddress: z.string().min(15, 'اقامتگاه را کامل بنویسید (شهر، خیابان، پلاک)'),
  title: z.string().min(5, 'عنوان / خواسته پرونده را کامل‌تر بنویسید'),
  claimType: z.enum(
    [
      'الزام به ایفای تعهد',
      'مطالبه وجه / خسارت',
      'خلع ید / تصرف عدوانی',
      'تنظیم سند رسمی',
      'طلاق / حضانت / نفقه',
      'شکایت کیفری',
      'اعتراض به رای / تجدیدنظر',
      'سایر',
    ],
    { required_error: 'نوع خواسته را انتخاب کنید' },
  ),
  category: z.enum(['ملکی', 'خانواده', 'تجاری', 'کیفری', 'سایر']),
  proceedingType: z.enum(
    ['حقوقی', 'کیفری', 'خانواده', 'اجرای احکام', 'دیوان عدالت اداری', 'سایر'],
    { required_error: 'نوع رسیدگی را مشخص کنید' },
  ),
  summary: z.string().min(40, 'شرح وقایع حداقل ۴۰ نویسه باشد'),
  legalBasis: z
    .string()
    .min(15, 'مبنای حقوقی یا قرارداد را مختصر توضیح دهید')
    .describe('مثلاً قرارداد اجاره، چک، تعهد شفاهی مستند، ماده قانونی مرتبط'),
  opponentName: z.string().min(2, 'نام طرف مقابل را وارد کنید'),
  opponentAddress: z.string().optional(),
  city: z.string().min(2, 'شهر اقامتگاه یا محل وقوع را وارد کنید'),
  courtHint: z.string().optional(),
  urgency: z.enum(['عادی', 'فوری', 'خیلی فوری']),
  hasThanaAccount: z.enum(['بله', 'خیر', 'نامشخص']),
  priorCaseNumber: z.string().optional(),
}

/** Step 1 — intake form only (file rules validated on upload step). */
export const createCaseIntakeSchema = z.object(createCaseIntakeFields)

export const createCaseSchema = createCaseIntakeSchema.extend({
  acceptFileRules: z.boolean().refine((value) => value === true, {
    message: 'پذیرش قوانین ارسال فایل الزامی است',
  }),
})

/**
 * Fields inspired by Art. 51 Civil Procedure Code (دادخواست)
 * and practical اظهارنامه requirements before litigation.
 */
export const documentRequestFieldsSchema = z.object({
  documentType: z.enum(['petition', 'declaration', 'complaint', 'brief', 'power-of-attorney']),
  plaintiffName: z.string().min(3, 'نام خواهان / اظهارکننده الزامی است'),
  plaintiffFatherName: z.string().min(2, 'نام پدر را وارد کنید'),
  plaintiffNationalId: z
    .string()
    .regex(/^\d{10}$/, 'کد ملی باید ۱۰ رقم باشد'),
  plaintiffAddress: z.string().min(15, 'اقامتگاه را کامل بنویسید (شهر، خیابان، پلاک)'),
  defendantName: z.string().min(2, 'نام خوانده / مخاطب الزامی است'),
  defendantAddress: z.string().min(10, 'اقامتگاه طرف مقابل را وارد کنید'),
  defendantPhone: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^09\d{9}$/.test(value), {
      message: 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد',
    }),
  claimTitle: z.string().min(5, 'خواسته را مشخص کنید'),
  claimAmount: z.string().optional(),
  claimBasis: z.string().min(20, 'مبنای استحقاق / تعهد را توضیح دهید'),
  courtRequest: z.string().min(10, 'درخواست از مرجع را بنویسید'),
  evidenceSummary: z.string().min(10, 'ادله و منضمات را خلاصه کنید'),
  notes: z.string().optional(),
})

export const documentRequestSchema = documentRequestFieldsSchema.extend({
  acceptFileRules: z.boolean().refine((value) => value === true, {
    message: 'پذیرش قوانین ارسال فایل الزامی است',
  }),
})

export const ticketSchema = z.object({
  subject: z.string().min(5, 'موضوع تیکت را وارد کنید'),
  category: z.enum(['عمومی', 'مالی', 'فنی', 'پرونده']),
  message: z.string().min(15, 'متن پیام را کامل‌تر بنویسید'),
})

export const chatMessageSchema = z.object({
  body: z.string().max(2000, 'پیام بیش از حد طولانی است'),
})

export type ConsultationRequestValues = z.infer<typeof consultationRequestSchema>
export type CreateCaseIntakeValues = z.infer<typeof createCaseIntakeSchema>
export type CreateCaseValues = z.infer<typeof createCaseSchema>
export type DocumentRequestFieldsValues = z.infer<typeof documentRequestFieldsSchema>
export type DocumentRequestValues = z.infer<typeof documentRequestSchema>
export type TicketValues = z.infer<typeof ticketSchema>
