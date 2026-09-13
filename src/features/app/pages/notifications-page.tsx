import { Link } from 'react-router-dom'
import { getNotifications } from '../mocks/data'
import { AppEmptyState } from '../components/app-empty-state'
import { PageHeader } from '../components/page-header'
import { cn } from '@/lib/utils'

export default function NotificationsPage() {
  const items = getNotifications()

  return (
    <div>
      <PageHeader
        eyebrow="اطلاع‌رسانی"
        title="اطلاعیه‌های پرونده"
        description="هر به‌روزرسانی مهم پرونده — مدارک، وضعیت، جلسه و پیام — اینجا می‌آید."
      />

      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                to={`/app/cases/${item.caseId}`}
                className={cn(
                  'block rounded-[1.25rem] border p-5 transition-all hover:shadow-lift',
                  item.read
                    ? 'border-navy-200 bg-white'
                    : 'border-gold-300 bg-gold-100/40 shadow-soft'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-navy-500">{item.caseTitle}</p>
                    <h3 className="mt-1 font-semibold text-navy-900">{item.title}</h3>
                  </div>
                  {!item.read ? (
                    <span className="rounded-full bg-gold-500 px-2 py-0.5 text-[0.65rem] font-bold text-navy-900">
                      جدید
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-7 text-navy-600">{item.body}</p>
                <p className="mt-3 text-xs text-navy-400">{item.createdAt}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <AppEmptyState
          title="اطلاعیه‌ای نیست"
          description="در محیط تولید، اعلان‌ها از سرویس پیام‌رسانی دریافت می‌شوند."
        />
      )}
    </div>
  )
}
