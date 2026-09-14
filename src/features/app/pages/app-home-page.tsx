import { Link } from 'react-router-dom'
import { Bell, FileText, FolderPlus, MessagesSquare } from 'lucide-react'
import { Button } from '@/components/ui'
import { isMockEnabled } from '@/config/env'
import { formatFaNumber } from '@/lib/format'
import {
  getBlogCards,
  getCases,
  getConsultations,
  getNotifications,
  getSpecialOffers,
} from '../mocks/data'
import { useAuthStore } from '../store/auth-store'
import { AppEmptyState } from '../components/app-empty-state'
import { CaseCard } from '../components/case-card'
import { OfferBanner } from '../components/offer-banner'
import { PageHeader } from '../components/page-header'

export default function AppHomePage() {
  const user = useAuthStore((s) => s.user)
  const offers = getSpecialOffers()
  const cases = getCases()
  const consultations = getConsultations().filter((item) => item.status !== 'done')
  const blogs = getBlogCards()
  const unread = getNotifications().filter((item) => !item.read).length

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow={isMockEnabled ? 'پنل آزمایشی' : 'پنل موکل'}
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
            description="در محیط تولید، پیشنهادها از سرور بارگذاری می‌شوند."
          />
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { to: '/app/consultation', label: 'درخواست مشاوره', icon: MessagesSquare },
          { to: '/app/cases/new', label: 'ایجاد پرونده', icon: FolderPlus },
          { to: '/app/documents', label: 'درخواست سند', icon: FileText },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-2xl border border-navy-200 bg-white p-4 shadow-soft transition-all hover:border-gold-400 hover:shadow-lift"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-navy-900 text-gold-300">
                <Icon className="size-4" />
              </span>
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          )
        })}
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
            description="پس از اتصال API، فهرست پرونده‌ها اینجا نمایش داده می‌شود."
            action={
              <Button variant="accent" asChild>
                <Link to="/app/cases/new">ایجاد پرونده</Link>
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
                    <span className="text-xs font-semibold text-gold-700">{item.status === 'available' ? 'آزاد' : 'رزرو شده'}</span>
                  </div>
                  <p className="mt-3 text-sm text-navy-600">{item.startsAt}</p>
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
                    {item.publishedAt} · {formatFaNumber(item.readMinutes)} دقیقه مطالعه
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <AppEmptyState title="مطلبی موجود نیست" description="محتوای بلاگ در محیط تولید از CMS می‌آید." />
          )}
        </div>
      </section>
    </div>
  )
}
