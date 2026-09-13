import { withMockData } from '@/lib/mock'
import type {
  AppUser,
  BlogCard,
  CaseNotification,
  ConsultationSlot,
  DiscountCode,
  LegalCase,
  SpecialOffer,
  SupportTicket,
} from '../types'

const MOCK_USER: AppUser = {
  id: 'usr-1001',
  fullName: 'علی رضایی',
  phone: '09121234567',
  nationalIdMasked: '۰۰۱******۴۵',
}

const MOCK_OFFERS: SpecialOffer[] = [
  {
    id: 'off-1',
    title: 'مشاوره اولیه خانواده',
    subtitle: '۳۰ دقیقه گفتگوی تخصصی با وکیل پایه یک',
    discountPercent: 40,
    badge: 'پیشنهاد ویژه',
    expiresAt: '۱۴۰۴/۰۷/۳۰',
    ctaLabel: 'رزرو مشاوره',
    href: '/app/consultation',
  },
  {
    id: 'off-2',
    title: 'تنظیم اظهارنامه ملکی',
    subtitle: 'تنظیم و بازبینی اظهارنامه پیش از طرح دعوا',
    discountPercent: 25,
    badge: 'محدود',
    expiresAt: '۱۴۰۴/۰۸/۱۵',
    ctaLabel: 'ثبت درخواست',
    href: '/app/documents',
  },
  {
    id: 'off-3',
    title: 'پکیج پیگیری پرونده',
    subtitle: 'گزارش هفتگی + پاسخگویی تیکت تا پایان ماه',
    discountPercent: 15,
    badge: 'پرطرفدار',
    expiresAt: '۱۴۰۴/۰۷/۲۰',
    ctaLabel: 'مشاهده جزئیات',
    href: '/app/offers',
  },
]

const MOCK_DISCOUNTS: DiscountCode[] = [
  {
    id: 'dc-1',
    code: 'VAZIN40',
    title: 'تخفیف مشاوره اول',
    description: 'برای اولین جلسه مشاوره آنلاین حقوقی',
    percent: 40,
    maxUsage: 1,
    usedCount: 0,
    expiresAt: '۱۴۰۴/۰۷/۳۰',
    applicableTo: 'مشاوره',
    isActive: true,
  },
  {
    id: 'dc-2',
    code: 'DADKHAST15',
    title: 'تخفیف تنظیم دادخواست',
    description: 'قابل استفاده روی درخواست تنظیم دادخواست حقوقی',
    percent: 15,
    maxUsage: 3,
    usedCount: 1,
    expiresAt: '۱۴۰۴/۰۸/۳۰',
    applicableTo: 'درخواست اسناد',
    isActive: true,
  },
  {
    id: 'dc-3',
    code: 'EZHAR20',
    title: 'تخفیف اظهارنامه',
    description: 'برای تنظیم اظهارنامه مطالبه وجه یا الزام به تعهد',
    percent: 20,
    maxUsage: 2,
    usedCount: 2,
    expiresAt: '۱۴۰۴/۰۶/۳۱',
    applicableTo: 'اظهارنامه',
    isActive: false,
  },
]

const MOCK_CASES: LegalCase[] = [
  {
    id: 'case-901',
    title: 'الزام به تنظیم سند رسمی ملک',
    caseNumber: 'VZ-۱۴۰۴-۰۹۰۱',
    category: 'ملکی',
    status: 'in-review',
    statusLabel: 'در حال بررسی',
    progress: 65,
    lawyerName: 'دکتر سیاوش وزیری',
    updatedAt: '۱۴۰۴/۰۶/۱۸ · ۱۴:۲۰',
    nextAction: 'تکمیل پیوست مبایعه‌نامه و رسیدهای پرداخت',
    stages: [
      { id: 's1', title: 'پذیرش', description: 'پرونده ثبت و مدارک اولیه دریافت شد', completed: true, at: '۱۴۰۴/۰۵/۰۲' },
      { id: 's2', title: 'مشاوره', description: 'راهبرد دعوا مشخص شد', completed: true, at: '۱۴۰۴/۰۵/۰۵' },
      { id: 's3', title: 'تشکیل پرونده', description: 'پرونده در سامانه داخلی ایجاد شد', completed: true, at: '۱۴۰۴/۰۵/۰۸' },
      { id: 's4', title: 'بررسی و تنظیم', description: 'پیش‌نویس دادخواست در حال تکمیل است', completed: false },
      { id: 's5', title: 'پیگیری', description: 'ثبت در دفتر خدمات / ثنا', completed: false },
      { id: 's6', title: 'اطلاع‌رسانی', description: 'ابلاغ و گزارش به موکل', completed: false },
    ],
  },
  {
    id: 'case-874',
    title: 'مطالبه وجه چک برگشتی',
    caseNumber: 'VZ-۱۴۰۴-۰۸۷۴',
    category: 'تجاری',
    status: 'follow-up',
    statusLabel: 'پیگیری قضایی',
    progress: 80,
    lawyerName: 'امیرحسین کاظمی',
    updatedAt: '۱۴۰۴/۰۶/۱۷ · ۱۰:۰۵',
    nextAction: 'منتظر ابلاغ وقت رسیدگی',
    stages: [
      { id: 's1', title: 'پذیرش', description: 'پرونده پذیرش شد', completed: true, at: '۱۴۰۴/۰۴/۱۲' },
      { id: 's2', title: 'مشاوره', description: 'ارزیابی ریسک انجام شد', completed: true, at: '۱۴۰۴/۰۴/۱۳' },
      { id: 's3', title: 'تشکیل پرونده', description: 'مدارک چک و گواهی عدم پرداخت بارگذاری شد', completed: true, at: '۱۴۰۴/۰۴/۱۵' },
      { id: 's4', title: 'بررسی و تنظیم', description: 'دادخواست تنظیم و تایید شد', completed: true, at: '۱۴۰۴/۰۴/۲۰' },
      { id: 's5', title: 'پیگیری', description: 'پرونده در مرجع قضایی در جریان است', completed: false },
      { id: 's6', title: 'اطلاع‌رسانی', description: 'اطلاع از نتیجه جلسات', completed: false },
    ],
  },
  {
    id: 'case-812',
    title: 'طلاق توافقی و حضانت',
    caseNumber: 'VZ-۱۴۰۴-۰۸۱۲',
    category: 'خانواده',
    status: 'consultation',
    statusLabel: 'مرحله مشاوره',
    progress: 30,
    lawyerName: 'مریم رادمنش',
    updatedAt: '۱۴۰۴/۰۶/۱۵ · ۱۹:۴۰',
    nextAction: 'جلسه مشاوره آنلاین فردا ساعت ۱۱',
    stages: [
      { id: 's1', title: 'پذیرش', description: 'درخواست ثبت شد', completed: true, at: '۱۴۰۴/۰۶/۱۰' },
      { id: 's2', title: 'مشاوره', description: 'زمان مشاوره رزرو شده است', completed: false },
      { id: 's3', title: 'تشکیل پرونده', description: 'پس از مشاوره فعال می‌شود', completed: false },
      { id: 's4', title: 'بررسی و تنظیم', description: '—', completed: false },
      { id: 's5', title: 'پیگیری', description: '—', completed: false },
      { id: 's6', title: 'اطلاع‌رسانی', description: '—', completed: false },
    ],
  },
]

const MOCK_CONSULTATIONS: ConsultationSlot[] = [
  {
    id: 'con-1',
    topic: 'مشاوره دعاوی ملکی',
    mode: 'video',
    modeLabel: 'ویدیویی',
    lawyerName: 'دکتر سیاوش وزیری',
    startsAt: 'سه‌شنبه ۲۱ شهریور · ۱۷:۰۰',
    durationMinutes: 30,
    price: 890000,
    discountedPrice: 534000,
    status: 'available',
  },
  {
    id: 'con-2',
    topic: 'مشاوره قرارداد تجاری',
    mode: 'chat',
    modeLabel: 'چت آنلاین',
    lawyerName: 'امیرحسین کاظمی',
    startsAt: 'چهارشنبه ۲۲ شهریور · ۱۲:۳۰',
    durationMinutes: 20,
    price: 490000,
    status: 'available',
  },
  {
    id: 'con-3',
    topic: 'مشاوره خانواده',
    mode: 'voice',
    modeLabel: 'تلفنی',
    lawyerName: 'مریم رادمنش',
    startsAt: 'پنجشنبه ۲۳ شهریور · ۱۰:۰۰',
    durationMinutes: 25,
    price: 650000,
    discountedPrice: 520000,
    status: 'booked',
  },
]

const MOCK_BLOGS: BlogCard[] = [
  {
    id: 'blog-1',
    title: 'تفاوت اظهارنامه و دادخواست چیست؟',
    excerpt: 'اظهارنامه ابزار اخطار رسمی قبل از دعواست؛ دادخواست شروع رسیدگی در دادگاه.',
    category: 'آموزش حقوقی',
    readMinutes: 5,
    publishedAt: '۱۴۰۴/۰۶/۱۰',
  },
  {
    id: 'blog-2',
    title: 'مدارک لازم برای ثبت دادخواست در ثنا',
    excerpt: 'حساب ثنا، مدارک هویتی، منضمات دعوا و پرداخت هزینه؛ چک‌لیست عملی.',
    category: 'راهنما',
    readMinutes: 7,
    publishedAt: '۱۴۰۴/۰۶/۰۵',
  },
  {
    id: 'blog-3',
    title: 'چگونه وضعیت پرونده را آنلاین پیگیری کنیم؟',
    excerpt: 'از ابلاغ الکترونیک تا گزارش مرحله‌ای وکیل؛ مسیر شفاف پیگیری برای موکل.',
    category: 'اپلیکیشن',
    readMinutes: 4,
    publishedAt: '۱۴۰۴/۰۵/۲۸',
  },
]

const MOCK_NOTIFICATIONS: CaseNotification[] = [
  {
    id: 'n1',
    caseId: 'case-901',
    caseTitle: 'الزام به تنظیم سند رسمی ملک',
    title: 'درخواست تکمیل مدارک',
    body: 'لطفاً تصویر مبایعه‌نامه و رسیدهای بانکی را تا ۴۸ ساعت آینده بارگذاری کنید.',
    createdAt: '۱۴۰۴/۰۶/۱۸ · ۱۴:۲۰',
    read: false,
    kind: 'document',
  },
  {
    id: 'n2',
    caseId: 'case-874',
    caseTitle: 'مطالبه وجه چک برگشتی',
    title: 'به‌روزرسانی وضعیت',
    body: 'پرونده وارد مرحله پیگیری قضایی شد. نتیجه ابلاغ به‌محض وصول اعلام می‌گردد.',
    createdAt: '۱۴۰۴/۰۶/۱۷ · ۱۰:۰۵',
    read: false,
    kind: 'status',
  },
  {
    id: 'n3',
    caseId: 'case-812',
    caseTitle: 'طلاق توافقی و حضانت',
    title: 'یادآوری جلسه مشاوره',
    body: 'جلسه مشاوره آنلاین فردا ساعت ۱۱ برگزار می‌شود. لینک ورود از اپ ارسال خواهد شد.',
    createdAt: '۱۴۰۴/۰۶/۱۵ · ۱۹:۴۰',
    read: true,
    kind: 'hearing',
  },
]

const MOCK_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-12',
    subject: 'سوال درباره هزینه تنظیم دادخواست',
    category: 'مالی',
    status: 'answered',
    statusLabel: 'پاسخ داده شده',
    updatedAt: '۱۴۰۴/۰۶/۱۶ · ۱۶:۱۰',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        body: 'هزینه تنظیم دادخواست ملکی تقریباً چقدر است؟',
        createdAt: '۱۴۰۴/۰۶/۱۶ · ۱۵:۰۲',
      },
      {
        id: 'm2',
        sender: 'admin',
        body: 'پس از بررسی مدارک، تعرفه دقیق اعلام می‌شود. برای شروع می‌توانید از بخش درخواست اسناد اقدام کنید.',
        createdAt: '۱۴۰۴/۰۶/۱۶ · ۱۶:۱۰',
      },
    ],
  },
  {
    id: 'tkt-09',
    subject: 'مشکل مشاهده وضعیت پرونده',
    category: 'فنی',
    status: 'open',
    statusLabel: 'باز',
    updatedAt: '۱۴۰۴/۰۶/۱۴ · ۰۹:۲۲',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        body: 'وضعیت پرونده ۸۷۴ برای من به‌روز نمی‌شود.',
        createdAt: '۱۴۰۴/۰۶/۱۴ · ۰۹:۲۲',
      },
    ],
  },
]

export function getMockUser(): AppUser | null {
  return withMockData(() => MOCK_USER, null)
}

export function getSpecialOffers(): SpecialOffer[] {
  return withMockData(() => MOCK_OFFERS, [])
}

export function getDiscountCodes(): DiscountCode[] {
  return withMockData(() => MOCK_DISCOUNTS, [])
}

export function getCases(): LegalCase[] {
  return withMockData(() => MOCK_CASES, [])
}

export function getCaseById(id: string): LegalCase | undefined {
  return getCases().find((item) => item.id === id)
}

export function getConsultations(): ConsultationSlot[] {
  return withMockData(() => MOCK_CONSULTATIONS, [])
}

export function getBlogCards(): BlogCard[] {
  return withMockData(() => MOCK_BLOGS, [])
}

export function getNotifications(): CaseNotification[] {
  return withMockData(() => MOCK_NOTIFICATIONS, [])
}

export function getTickets(): SupportTicket[] {
  return withMockData(() => MOCK_TICKETS, [])
}

export function getTicketById(id: string): SupportTicket | undefined {
  return getTickets().find((item) => item.id === id)
}
