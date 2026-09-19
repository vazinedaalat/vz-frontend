import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Bell, FileText } from 'lucide-react'
import { Button } from '@/components/ui'
import { env, isMockEnabled } from '@/config/env'
import { formatFaNumber } from '@/lib/format'
import { formatFaDate, formatFaDateTime } from '@/lib/jalali'
import { appKeys, fetchHomeBanners, fetchHomeBlog, fetchHomeOffers } from '../api'
import { fetchCases } from '../api/cases'
import { fetchConsultationBookings } from '../api/consultation'
import { fetchDocuments } from '../api/documents'
import { fetchNotifications } from '../api/notifications'
import {
  getBlogCards,
  getCases,
  getConsultations,
  getHomeHeroBanners,
  getNotifications,
  getSpecialOffers,
} from '../mocks/data'
import { useAuthStore } from '../store/auth-store'
import { AppEmptyState } from '../components/app-empty-state'
import { BookingCodeDisplay } from '../components/booking-code-display'
import { BookingStatusChip } from '../components/booking-status-chip'
import { CaseCard } from '../components/case-card'
import { DocumentRequestCard } from '../components/document-request-card'
import { DocumentStatusChip } from '../components/document-status-chip'
import { HomeHeroBanner } from '../components/home-hero-banner'
import { HomeServiceShortcuts } from '../components/home-service-shortcuts'
import { OfferBanner } from '../components/offer-banner'
import { PageHeader } from '../components/page-header'
import { isDocumentPending } from '../lib/document-status'

export default function AppHomePage() {
  const user = useAuthStore((s) => s.user)

  const bannersQuery = useQuery({
    queryKey: appKeys.home.banners,
    queryFn: isMockEnabled ? async () => getHomeHeroBanners() : fetchHomeBanners,
  })
  const offersQuery = useQuery({
    queryKey: appKeys.home.offers,
    queryFn: isMockEnabled ? async () => getSpecialOffers() : fetchHomeOffers,
  })
  const casesQuery = useQuery({
    queryKey: appKeys.cases.all,
    queryFn: isMockEnabled ? async () => getCases() : fetchCases,
  })
  const bookingsQuery = useQuery({
    queryKey: appKeys.consultation.bookings,
    queryFn: isMockEnabled ? async () => getConsultations() : fetchConsultationBookings,
  })
  const blogsQuery = useQuery({
    queryKey: appKeys.home.blog,
    queryFn: isMockEnabled ? async () => getBlogCards() : fetchHomeBlog,
  })
  const notificationsQuery = useQuery({
    queryKey: appKeys.notifications,
    queryFn: isMockEnabled ? async () => getNotifications() : fetchNotifications,
  })
  const documentsQuery = useQuery({
    queryKey: appKeys.documents,
    queryFn: fetchDocuments,
    enabled: !isMockEnabled,
  })

  const banners = bannersQuery.data ?? []
  const offers = offersQuery.data ?? []
  const cases = casesQuery.data ?? []
  const consultations = (bookingsQuery.data ?? []).filter((item) => item.status !== 'done')
  const blogs = blogsQuery.data ?? []
  const unread = (notificationsQuery.data ?? []).filter((item) => !item.read).length
  const pendingDocuments = (documentsQuery.data ?? []).filter((doc) => isDocumentPending(doc.status))
  const loading =
    bannersQuery.isLoading ||
    offersQuery.isLoading ||
    casesQuery.isLoading ||
    bookingsQuery.isLoading

  return (
    <div className="space-y-8 sm:space-y-10">
      {banners.length > 0 ? <HomeHeroBanner slides={banners} /> : null}

      <HomeServiceShortcuts />

      <PageHeader
        eyebrow={env.VITE_APP_ENV === 'production' ? 'پنل موکل' : 'پنل موکل · توسعه'}
        title={`سلام${user?.fullName ? `، ${user.fullName}` : ''}`}
        description="پیشنهادهای ویژه، پرونده‌ها، مشاوره‌ها و مطالب حقوقی — همه در یک نگاه."
        action={
          <Button variant="outline" asChild>
            <Link to="/app/notifications">
              <Bell />
              اطلاعیه‌ها
              {unread > 0 ? (
                <span className="rounded-full bg-gold-500 px-1.5 text-[0.65rem] text-navy-900">
                  {formatFaNumber(unread)}
                </span>
              ) : null}
            </Link>
          </Button>
        }
      />

      {loading ? (
        <p className="text-sm text-navy-500">در حال بارگذاری…</p>
      ) : null}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">پیشنهادهای ویژه</h2>
          <Link to="/app/discounts" className="text-sm font-medium text-gold-700 hover:text-gold-600">
            دیدن تخفیف‌ها
          </Link>
        </div>
        {offers.length > 0 ? (
          <OfferBanner offers={offers} />
        ) : (
          <AppEmptyState
            title="پیشنهادی فعال نیست"
            description="پیشنهادهای ویژه از سرور بارگذاری می‌شوند."
          />
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">پرونده‌های من</h2>
          <Link to="/app/cases" className="text-sm font-medium text-gold-700">
            مشاهده همه
          </Link>
        </div>
        {cases.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cases.map((item) => (
              <CaseCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <AppEmptyState
            title="هنوز پرونده‌ای ندارید"
            description="پس از ایجاد پرونده، فهرست اینجا نمایش داده می‌شود."
            action={
              <Button variant="accent" asChild>
                <Link to="/app/cases/new">ایجاد پرونده</Link>
              </Button>
            }
          />
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold">اسناد در انتظار</h2>
            <p className="mt-0.5 text-sm text-navy-500">وضعیت درخواست‌های سند به‌صورت فارسی</p>
          </div>
          <Link to="/app/documents" className="shrink-0 text-sm font-medium text-gold-700 hover:text-gold-600">
            مشاهده همه
          </Link>
        </div>

        {!isMockEnabled && documentsQuery.isLoading ? (
          <p className="text-sm text-navy-500">در حال بارگذاری اسناد…</p>
        ) : pendingDocuments.length > 0 ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gold-200/80 bg-gold-100/50 px-4 py-3">
              <FileText className="size-4 shrink-0 text-gold-700" aria-hidden />
              <p className="text-sm text-navy-800">
                <span className="font-semibold">{formatFaNumber(pendingDocuments.length)}</span>
                {' '}درخواست در جریان است
              </p>
              <div className="ms-auto flex flex-wrap gap-1.5">
                {pendingDocuments.slice(0, 3).map((doc) => (
                  <DocumentStatusChip key={doc.id} status={doc.status} />
                ))}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {pendingDocuments.slice(0, 4).map((doc) => (
                <DocumentRequestCard key={doc.id} item={doc} compact />
              ))}
            </div>
          </div>
        ) : (
          <AppEmptyState
            title="اسناد در انتظاری ندارید"
            description="پس از ثبت درخواست سند، وضعیت آن اینجا نمایش داده می‌شود."
            action={
              <Button variant="outline" asChild>
                <Link to="/app/documents">درخواست سند</Link>
              </Button>
            }
          />
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <h2 className="font-display text-lg font-bold">مشاوره‌ها</h2>
          {consultations.length > 0 ? (
            <div className="space-y-3">
              {consultations.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-navy-200 bg-white p-4 shadow-soft"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-navy-900">{item.topic}</h3>
                      <p className="mt-1 text-xs text-navy-500">
                        {item.lawyerName} · {item.modeLabel} · {item.durationMinutes} دقیقه
                      </p>
                    </div>
                    <BookingStatusChip status={item.status} />
                  </div>
                  <p className="mt-3 text-sm text-navy-600">{formatFaDateTime(item.startsAt)}</p>
                  {item.bookingCode ? (
                    <div className="mt-3">
                      <BookingCodeDisplay code={item.bookingCode} />
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <AppEmptyState title="مشاوره‌ای ثبت نشده" description="برای رزرو، به بخش مشاوره بروید." />
          )}
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-lg font-bold">از بلاگ حقوقی</h2>
          {blogs.length > 0 ? (
            <div className="space-y-3">
              {blogs.map((item) => (
                <article key={item.id} className="rounded-2xl border border-navy-200 bg-white p-4 shadow-soft">
                  <p className="text-[0.7rem] font-semibold text-gold-700">{item.category}</p>
                  <h3 className="font-display mt-1 text-base font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-navy-600">{item.excerpt}</p>
                  <p className="mt-3 text-xs text-navy-400">
                    {formatFaDate(item.publishedAt)} · {formatFaNumber(item.readMinutes)} دقیقه مطالعه
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <AppEmptyState title="مطلبی موجود نیست" description="محتوای بلاگ از سرور می‌آید." />
          )}
        </div>
      </section>
    </div>
  )
}
