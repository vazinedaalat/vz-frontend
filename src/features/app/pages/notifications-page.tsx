import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import { ErrorBadge } from '@/components/shared/error-badge'
import { Pagination } from '@/components/shared/pagination'
import { ListRowSkeletonStack } from '@/components/shared/skeletons'
import { useLazySkeleton } from '@/hooks/use-lazy-skeleton'
import { usePagination } from '@/hooks/use-pagination'
import { isMockEnabled } from '@/config/env'
import { formatFaDateTime } from '@/lib/jalali'
import { AppError } from '@/services/api/errors'
import { appKeys, fetchNotifications, markAllNotificationsRead, markNotificationRead } from '../api'
import { getNotifications } from '../mocks/data'
import { AppEmptyState } from '../components/app-empty-state'
import { PageHeader } from '../components/page-header'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 8

export default function NotificationsPage() {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const { data: items = [], isPending } = useQuery({
    queryKey: appKeys.notifications,
    queryFn: isMockEnabled ? async () => getNotifications() : fetchNotifications,
  })

  const showSkeleton = useLazySkeleton(isPending)
  const pagination = usePagination(items, PAGE_SIZE)

  const markAll = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: appKeys.notifications })
    },
    onError: (err) => {
      setError(err instanceof AppError ? err.message : 'خطا در خواندن اعلان‌ها')
    },
  })

  const onOpen = async (id: string, read: boolean) => {
    if (isMockEnabled || read) return
    try {
      await markNotificationRead(id)
      await queryClient.invalidateQueries({ queryKey: appKeys.notifications })
    } catch {
      // non-blocking
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="اطلاع‌رسانی"
        title="اطلاعیه‌های پرونده"
        description="هر به‌روزرسانی مهم پرونده — مدارک، وضعیت، جلسه و پیام — اینجا می‌آید."
        action={
          !isMockEnabled && items.some((item) => !item.read) ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={markAll.isPending}
              onClick={() => markAll.mutate()}
            >
              همه را خواندم
            </Button>
          ) : null
        }
      />

      {error ? (
        <ErrorBadge variant="page" className="mb-4 rounded-xl px-3 py-2 text-xs">
          {error}
        </ErrorBadge>
      ) : null}

      {showSkeleton ? (
        <ListRowSkeletonStack count={PAGE_SIZE} label="در حال بارگذاری اطلاعیه‌ها" />
      ) : null}

      {!showSkeleton && items.length > 0 ? (
        <div className="space-y-5">
          <ul id="notifications-list" className="space-y-3">
            {pagination.pageItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.caseId ? `/app/cases/${item.caseId}` : '/app/notifications'}
                  onClick={() => void onOpen(item.id, item.read)}
                  className={cn(
                    'block rounded-[1.25rem] border p-5 transition-all hover:shadow-lift',
                    item.read
                      ? 'border-navy-200 bg-white'
                      : 'border-gold-300 bg-gold-100/40 shadow-soft',
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
                  <p className="mt-3 text-xs text-navy-400">{formatFaDateTime(item.createdAt)}</p>
                </Link>
              </li>
            ))}
          </ul>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            from={pagination.from}
            to={pagination.to}
            onPageChange={pagination.setPage}
            listId="notifications-list"
          />
        </div>
      ) : null}

      {!showSkeleton && !isPending && items.length === 0 ? (
        <AppEmptyState title="اطلاعیه‌ای نیست" description="اعلان‌ها از سرویس پیام‌رسانی دریافت می‌شوند." />
      ) : null}
    </div>
  )
}
