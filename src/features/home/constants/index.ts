import {
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  Clock,
  FileCheck2,
  FolderSearch,
  Gavel,
  Landmark,
  Lock,
  MessagesSquare,
  PenLine,
  Scale,
  ScrollText,
  Users,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type {
  ContactInfo,
  NavLink,
  PracticeArea,
  ServiceItem,
  Stat,
  TeamMember,
  Testimonial,
  TrustPoint,
} from '../types'

export const BRAND = {
  name: 'وزین عدالت',
  nameLead: 'وزین',
  nameTrail: 'عدالت',
  tagline: 'آنلاین، سریع، دقیق، بدون حضور',
  slogan: 'عدالت را آنلاین، سریع و حرفه‌ای پیگیری کنید',
  sloganSupport:
    'لذت خدمات قضایی دقیق را بدون مراجعه حضوری تجربه کنید. از مشاوره تا لایحه و پیگیری پرونده، همه‌چیز آنلاین، شفاف و نتیجه‌محور پیش می‌رود.',
  establishedYear: 1390,
} as const

export const SECTION_IDS = {
  home: 'home',
  about: 'about',
  services: 'services',
  whyUs: 'why-us',
  team: 'team',
  testimonials: 'testimonials',
  contact: 'contact',
} as const

export const NAV_LINKS: readonly NavLink[] = [
  { label: 'خانه', href: `#${SECTION_IDS.home}` },
  { label: 'خدمات', href: `#${SECTION_IDS.services}` },
  { label: 'درباره ما', href: `#${SECTION_IDS.about}` },
  { label: 'تماس', href: `#${SECTION_IDS.contact}` },
]

/** Stable list of in-page section ids used by the sticky header. */
export const NAV_SECTION_IDS: readonly string[] = NAV_LINKS.map((link) => link.href.slice(1))

export const LOGIN_PATH = '/login' as const

export const HERO_PROMISES = ['کاملاً آنلاین', 'بدون حضور در دفتر', 'سریع و دقیق'] as const

/** Six core services powering the quick selector at the top of the page. */
export const SERVICES: readonly ServiceItem[] = [
  {
    id: 'legal-affairs',
    label: 'امور حقوقی',
    title: 'امور حقوقی',
    description:
      'پذیرش، تحلیل و مدیریت کامل دعاوی حقوقی — آنلاین، از نخستین جلسه تا صدور حکم.',
    icon: Scale,
  },
  {
    id: 'brief-writing',
    label: 'لایحه‌نویسی',
    title: 'لایحه‌نویسی',
    description:
      'تدوین لوایح دفاعی مستند، سریع و دقیق؛ بدون نیاز به مراجعه حضوری.',
    icon: PenLine,
  },
  {
    id: 'petition',
    label: 'دادخواست',
    title: 'تنظیم دادخواست',
    description:
      'تنظیم و ثبت دادخواست، شکواییه و اظهارنامه به‌صورت آنلاین در سامانه ثنا.',
    icon: ScrollText,
  },
  {
    id: 'consultation',
    label: 'مشاوره حقوقی',
    title: 'مشاوره حقوقی',
    description:
      'مشاوره حقوقی آنلاین: ارزیابی پرونده، تبیین ریسک‌ها و راهبرد روشن — بدون حضور در دفتر.',
    icon: MessagesSquare,
  },
  {
    id: 'contracts',
    label: 'تنظیم قرارداد',
    title: 'تنظیم قرارداد',
    description:
      'طراحی و بازبینی قراردادها به‌صورت آنلاین، با پوشش ریسک و ضمانت اجرای دقیق.',
    icon: FileCheck2,
  },
  {
    id: 'case-tracking',
    label: 'پیگیری پرونده',
    title: 'پیگیری پرونده',
    description:
      'پیگیری پرونده از راه دور، با گزارش لحظه‌ای و بدون معطلی حضور در مراجع.',
    icon: FolderSearch,
  },
]

/** Full practice-area grid: the six core services plus two specialised desks. */
export const PRACTICE_AREAS: readonly PracticeArea[] = [
  ...SERVICES.map(({ id, title, description, icon }) => ({ id, title, description, icon })),
  {
    id: 'property',
    title: 'دعاوی ملکی و ثبتی',
    description:
      'خلع ید، الزام به تنظیم سند رسمی، افراز و تقسیم املاک مشاع و اعتراض به عملیات ثبتی.',
    icon: Building2,
  },
  {
    id: 'corporate',
    title: 'امور شرکت‌ها و تجاری',
    description: 'ثبت و تغییرات شرکت‌ها، دعاوی تجاری، مطالبه وجه اسناد تجاری و امور ورشکستگی.',
    icon: Briefcase,
  },
]

export const STATS: readonly Stat[] = [
  {
    id: 'experience',
    value: 14,
    suffix: '+',
    title: 'سال تجربه حقوقی',
    description: 'خدمات آنلاین از سال ۱۳۹۰؛ تجربه حضوری، سرعت دیجیتال.',
    icon: Clock,
  },
  {
    id: 'cases',
    value: 2400,
    suffix: '+',
    title: 'پرونده مختومه',
    description: 'پرونده‌های حقوقی، کیفری و ملکی که به نتیجه رسیده‌اند.',
    icon: BadgeCheck,
  },
  {
    id: 'success-rate',
    value: 96,
    suffix: '٪',
    title: 'رضایت موکلین',
    description: 'بر پایه نظرسنجی سالانه از موکلین پرونده‌های مختومه.',
    icon: Award,
  },
  {
    id: 'lawyers',
    value: 18,
    suffix: '',
    title: 'وکیل و کارشناس',
    description: 'تیم تخصصی وکلای پایه یک؛ پرونده شما آنلاین به متخصص همان موضوع می‌رسد.',
    icon: Users,
  },
]

export const TRUST_POINTS: readonly TrustPoint[] = [
  {
    id: 'transparency',
    title: 'سریع، آنلاین، بدون حضور',
    description: 'مشاوره، ارسال مدارک و پیگیری پرونده از هرجا؛ بدون صف دفتر و بدون مراجعه حضوری.',
    icon: Zap,
  },
  {
    id: 'confidentiality',
    title: 'محرمانگی مطلق اطلاعات',
    description: 'اسناد و اطلاعات موکل بر اساس اصل رازداری حرفه‌ای وکالت حفاظت می‌شود.',
    icon: Lock,
  },
  {
    id: 'specialization',
    title: 'وکیل متخصص هر پرونده',
    description: 'هر پرونده به وکیلی سپرده می‌شود که تخصص و سابقه او با موضوع دعوا منطبق است.',
    icon: Gavel,
  },
]

export const TEAM: readonly TeamMember[] = [
  {
    id: 'siavash-vaziri',
    name: 'دکتر سیاوش وزیری',
    initials: 'س و',
    role: 'وکیل پایه یک دادگستری',
    expertise: 'دعاوی حقوقی و ملکی',
    experienceYears: 21,
  },
  {
    id: 'maryam-radmanesh',
    name: 'مریم رادمنش',
    initials: 'م ر',
    role: 'وکیل پایه یک دادگستری',
    expertise: 'حقوق خانواده و ارث',
    experienceYears: 15,
  },
  {
    id: 'amirhossein-kazemi',
    name: 'امیرحسین کاظمی',
    initials: 'ا ک',
    role: 'وکیل و مشاور حقوقی',
    expertise: 'قراردادها و امور تجاری',
    experienceYears: 12,
  },
  {
    id: 'sara-mahdavi',
    name: 'سارا مهدوی',
    initials: 'س م',
    role: 'مشاور ارشد حقوقی',
    expertise: 'دعاوی کیفری',
    experienceYears: 9,
  },
]

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: 'testimonial-1',
    quote:
      'پرونده ملکی ما سه سال بی‌نتیجه مانده بود. تیم وزین عدالت با تنظیم دقیق لایحه و پیگیری منظم، پرونده را در کمتر از یک سال به نتیجه رساند.',
    author: 'محمدرضا ط.',
    role: 'مالک مجتمع تجاری، تهران',
    rating: 5,
  },
  {
    id: 'testimonial-2',
    quote:
      'قراردادهای شرکت ما پیش از همکاری، ریسک‌های جدی داشت. بازبینی حقوقی و بازنویسی قراردادها، ما را از چند دعوای پرهزینه نجات داد.',
    author: 'شرکت آرمان صنعت',
    role: 'مدیر امور قراردادها',
    rating: 5,
  },
  {
    id: 'testimonial-3',
    quote:
      'از همان جلسه اول، وضعیت پرونده و احتمال موفقیت را صادقانه توضیح دادند. این شفافیت و گزارش‌دهی مرحله‌به‌مرحله، اعتماد کامل ایجاد کرد.',
    author: 'نگار ا.',
    role: 'موکل پرونده خانواده',
    rating: 5,
  },
]

export const CONTACT_INFO: ContactInfo = {
  phone: '۰۲۱ - ۹۱۰۰ ۲۲۳۳',
  phoneHref: 'tel:+982191002233',
  email: 'info@vazinedalat.ir',
  address: 'تهران، خیابان ولیعصر، بالاتر از میدان ونک، برج نگین، طبقه ۹، واحد ۹۰۴',
  workingHours: 'شنبه تا چهارشنبه، ۹ تا ۱۸ · پنجشنبه، ۹ تا ۱۳',
}

export const FOOTER_HIGHLIGHTS: readonly { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'bar-association', label: 'عضو کانون وکلای دادگستری مرکز', icon: Landmark },
  { id: 'certified', label: 'دارای پروانه رسمی مؤسسه حقوقی', icon: BadgeCheck },
]
