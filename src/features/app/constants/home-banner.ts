import type { HomeHeroBannerSlide } from '../types'

/** Autoplay duration per slide (ms). */
export const HOME_BANNER_INTERVAL_MS = 7000

export const HOME_HERO_BANNERS: readonly HomeHeroBannerSlide[] = [
  {
    id: 'banner-consult',
    eyebrow: 'مشاوره تخصصی',
    title: 'اولین گفتگو با وکیل، آنلاین و بدون اتلاف وقت',
    description:
      'زمان مناسب را انتخاب کنید و همان روز با وکیل پایه یک گفتگو کنید — شفاف، سریع و قابل پیگیری در پنل.',
    ctaLabel: 'رزرو مشاوره',
    ctaTo: '/app/consultation',
    imageSrc: '/images/app-home-banner-consult.jpg',
    imageAlt: 'اتاق مشاوره حقوقی با نور ملایم و فضای حرفه‌ای',
  },
  {
    id: 'banner-docs',
    eyebrow: 'تنظیم اسناد',
    title: 'دادخواست و اظهارنامه، دقیق و آماده ثبت',
    description:
      'درخواست تنظیم سند حقوقی را ثبت کنید؛ تیم وزین عدالت متن را بازبینی و برای ارائه آماده می‌کند.',
    ctaLabel: 'درخواست سند',
    ctaTo: '/app/documents',
    imageSrc: '/images/app-home-banner-docs.jpg',
    imageAlt: 'پرونده‌ها و اسناد حقوقی روی میز با جزئیات طلایی',
  },
  {
    id: 'banner-cases',
    eyebrow: 'پیگیری پرونده',
    title: 'پرونده‌تان را از خانه، با شفافیت کامل دنبال کنید',
    description:
      'ایجاد پرونده، گفتگو با تیم پیگیری و مشاهده مراحل — همه در یک مسیر یکپارچه و قابل اعتماد.',
    ctaLabel: 'ایجاد پرونده',
    ctaTo: '/app/cases/new',
    imageSrc: '/images/app-home-banner.jpg',
    imageAlt: 'دفتر حقوقی مدرن با مقیاس عدالت و نور طبیعی',
  },
] as const
