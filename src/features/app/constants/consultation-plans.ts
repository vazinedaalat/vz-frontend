import type { ConsultationPlan, ConsultationPlanId } from '../types'

export const CONSULTATION_PLANS: readonly ConsultationPlan[] = [
  {
    id: 'free-online',
    title: 'مشاوره رایگان آنلاین',
    subtitle: 'اولین ارزیابی حقوقی کوتاه برای مشخص‌شدن مسیر پرونده',
    channel: 'online',
    channelLabel: 'آنلاین',
    requiresTime: false,
    isFree: true,
    requiresPayment: false,
    price: 0,
    durationMinutes: 15,
    lawyerName: 'تیم مشاوران وزین عدالت',
    highlights: ['فقط انتخاب روز', 'بدون پرداخت', 'هماهنگی لینک جلسه پس از تایید'],
    badge: 'شروع سریع',
  },
  {
    id: 'specialist-online',
    title: 'مشاوره آنلاین تخصصی',
    subtitle: 'جلسه تخصصی با وکیل حوزه موضوع دعوا — بررسی مدارک و راهبرد',
    channel: 'online',
    channelLabel: 'آنلاین',
    requiresTime: false,
    isFree: false,
    requiresPayment: true,
    price: 890_000,
    durationMinutes: 30,
    lawyerName: 'وکیل پایه یک دادگستری',
    highlights: ['فقط انتخاب روز', 'تحلیل تخصصی موضوع', 'پرداخت آنلاین پیش از جلسه'],
    badge: 'پیشنهادی',
  },
  {
    id: 'in-person',
    title: 'مشاوره حضوری',
    subtitle: 'جلسه حضوری در دفتر با تعیین روز و ساعت دقیق',
    channel: 'in-person',
    channelLabel: 'حضوری',
    requiresTime: true,
    isFree: false,
    requiresPayment: true,
    price: 1_450_000,
    durationMinutes: 45,
    lawyerName: 'وکیل پایه یک دادگستری',
    highlights: ['انتخاب روز و ساعت', 'بررسی حضوری مدارک', 'پرداخت هنگام رزرو'],
  },
  {
    id: 'dargahi-premium',
    title: 'مشاوره فوق‌تخصصی آقای درگاهی',
    subtitle: 'جلسه حضوری اختصاصی با آقای درگاهی برای پرونده‌های پیچیده',
    channel: 'in-person',
    channelLabel: 'حضوری',
    requiresTime: true,
    isFree: false,
    requiresPayment: true,
    price: 3_500_000,
    durationMinutes: 60,
    lawyerName: 'آقای درگاهی',
    highlights: ['انتخاب روز و ساعت', 'ظرفیت محدود', 'پرداخت هنگام رزرو'],
    badge: 'فوق‌تخصصی',
  },
] as const

export function getConsultationPlan(id: ConsultationPlanId): ConsultationPlan {
  const plan = CONSULTATION_PLANS.find((item) => item.id === id)
  if (!plan) throw new Error(`Unknown consultation plan: ${id}`)
  return plan
}

export function planRequiresTime(id: ConsultationPlanId): boolean {
  return getConsultationPlan(id).requiresTime
}
