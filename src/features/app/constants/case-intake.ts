import type { CaseFileRuleSection, CaseDeliveryMethod, CasePrepaymentInvoice } from '../types'

/** Intake options inspired by Iranian civil/criminal procedure practice. */
export const CLIENT_ROLE_OPTIONS = [
  'خواهان',
  'خوانده',
  'شاکی',
  'مشتکی‌عنه',
  'متقاضی',
  'وکیل / نماینده',
  'سایر',
] as const

export const PROCEEDING_TYPE_OPTIONS = [
  'حقوقی',
  'کیفری',
  'خانواده',
  'اجرای احکام',
  'دیوان عدالت اداری',
  'سایر',
] as const

export const CLAIM_TYPE_OPTIONS = [
  'الزام به ایفای تعهد',
  'مطالبه وجه / خسارت',
  'خلع ید / تصرف عدوانی',
  'تنظیم سند رسمی',
  'طلاق / حضانت / نفقه',
  'شکایت کیفری',
  'اعتراض به رای / تجدیدنظر',
  'سایر',
] as const

export const CASE_FILE_ACCEPT = '.pdf,.jpg,.jpeg,.png,.webp,.zip'
export const CASE_FILE_ACCEPT_MIME = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/zip',
  'application/x-zip-compressed',
] as const

export const CASE_FILE_MAX_BYTES = 10 * 1024 * 1024
export const CASE_FILE_MAX_COUNT = 10

export const CASE_FILE_RULE_SECTIONS: readonly CaseFileRuleSection[] = [
  {
    id: 'formats',
    title: 'فرمت و حجم مجاز',
    body: [
      'فرمت‌های مجاز: PDF، JPG، PNG، WEBP و ZIP.',
      'حداکثر حجم هر فایل ۱۰ مگابایت و حداکثر ۱۰ فایل در هر ارسال.',
      'تصاویر باید خوانا باشند؛ اسکن تار یا ناقص ممکن است رد شود.',
    ],
  },
  {
    id: 'content',
    title: 'محتوای توصیه‌شده مدارک',
    body: [
      'مدارک هویتی: کارت ملی و صفحه اول شناسنامه موکل.',
      'اسناد موضوع دعوا: قرارداد، چک، سفته، مبایعه‌نامه، رای قبلی، ابلاغیه.',
      'در دعاوی کیفری: شکواییه، گزارش مرجع انتظامی یا مدارک وقوع جرم (در صورت وجود).',
      'نام فایل را شفاف بنویسید؛ مثلاً «قرارداد-اجاره.pdf».',
    ],
  },
  {
    id: 'privacy',
    title: 'محرمانگی و مسئولیت',
    body: [
      'مدارک در چارچوب رابطه موکل–وکیل و محرمانه تلقی می‌شوند.',
      'از ارسال رمز کارت بانکی، رمز پویا یا اطلاعات غیرمرتبط خودداری کنید.',
      'مسئولیت صحت و اصالت مدارک با ارسال‌کننده است.',
    ],
  },
  {
    id: 'legal',
    title: 'نکته حقوقی (آیین دادرسی)',
    body: [
      'طبق ماده ۵۱ قانون آیین دادرسی دادگاه‌های عمومی و انقلاب در امور مدنی، دادخواست باید مشخصات طرفین، اقامتگاه، خواسته و ادله را روشن کند.',
      'آپلود مدارک در این مرحله برای تشکیل پرونده داخلی و بررسی وکیل است؛ ثبت نهایی در دفاتر خدمات الکترونیک قضایی / ثنا در مراحل بعد انجام می‌شود.',
      'در امور کیفری، طرح شکایت تابع قانون آیین دادرسی کیفری و صلاحیت مرجع مربوط است.',
    ],
  },
] as const

export const CASE_DELIVERY_METHODS: readonly CaseDeliveryMethod[] = [
  {
    id: 'app-upload',
    title: 'ارسال از داخل اپ',
    description: 'آپلود مستقیم فایل‌ها در همین صفحه — سریع‌ترین مسیر برای شروع بررسی.',
    recommended: true,
  },
  {
    id: 'chat-followup',
    title: 'تکمیل بعدی از چت / تیکت',
    description: 'اگر فایلی جا ماند، می‌توانید پس از تشکیل پرونده از بخش پیام‌ها ارسال کنید.',
  },
  {
    id: 'original-later',
    title: 'اصل مدارک در مرحله قضایی',
    description: 'برای ثبت رسمی، ممکن است ارائه اصل یا تصویر مصدق در دفتر خدمات الکترونیک لازم شود.',
  },
]

export const MOCK_CASE_PREPAYMENT: CasePrepaymentInvoice = {
  id: 'inv-pre-1001',
  title: 'پیش‌فاکتور تشکیل پرونده',
  description: 'بررسی اولیه مدارک، تشکیل پرونده داخلی و تخصیص وکیل مسئول',
  amount: 2_500_000,
  currencyLabel: 'تومان',
  issuedAtLabel: 'همین لحظه',
  dueLabel: '۴۸ ساعت',
  items: [
    { label: 'پذیرش و تشکیل پرونده', amount: 900_000 },
    { label: 'بررسی اولیه مدارک', amount: 1_100_000 },
    { label: 'هماهنگی وکیل مسئول', amount: 500_000 },
  ],
}
