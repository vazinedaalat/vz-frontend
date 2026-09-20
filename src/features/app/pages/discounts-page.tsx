import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui'
import { isMockEnabled } from '@/config/env'
import { formatFaDate } from '@/lib/jalali'
import { appKeys, fetchMyDiscounts } from '../api'
import { getDiscountCodes } from '../mocks/data'
import { AppEmptyState } from '../components/app-empty-state'
import { PageHeader } from '../components/page-header'
import { cn } from '@/lib/utils'

const SECTION_HINT: Record<string, string> = {
  consultation: 'مشاوره (پلن‌های پولی)',
  documents: 'درخواست اسناد',
  declaration: 'اظهارنامه',
  cases: 'پرونده',
}

export default function DiscountsPage() {
  const { data: codes = [], isLoading } = useQuery({
    queryKey: appKeys.discounts,
    queryFn: isMockEnabled ? async () => getDiscountCodes() : fetchMyDiscounts,
  })
  const [copied, setCopied] = useState<string | null>(null)

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(code)
      window.setTimeout(() => setCopied(null), 2000)
    } catch {
      setCopied(null)
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="کد تخفیف"
        title="کدهای تخفیف من"
        description="کدهای سراسری و اختصاصی شما. هر کد فقط در بخش خودش قابل استفاده است."
      />

      {isLoading ? <p className="text-sm text-navy-500">در حال بارگذاری…</p> : null}

      {codes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {codes.map((item) => (
            <article
              key={item.id}
              className={cn(
                'rounded-[1.5rem] border p-5 shadow-soft',
                item.isActive ? 'border-navy-200 bg-white' : 'border-navy-100 bg-navy-50 opacity-70',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mb-1 flex flex-wrap gap-2">
                    {item.audience === 'user' ? (
                      <span className="rounded-lg bg-gold-100 px-2 py-0.5 text-[11px] font-medium text-gold-800">
                        اختصاصی شما
                      </span>
                    ) : (
                      <span className="rounded-lg bg-navy-100 px-2 py-0.5 text-[11px] font-medium text-navy-700">
                        سراسری
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-navy-600">{item.description}</p>
                </div>
                <span className="font-display text-2xl font-extrabold text-gold-600">{item.percent}٪</span>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <code
                  className="rounded-xl bg-navy-900 px-3 py-2 text-sm tracking-wider text-gold-300"
                  dir="ltr"
                >
                  {item.code}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!item.isActive}
                  onClick={() => copyCode(item.code)}
                >
                  {copied === item.code ? 'کپی شد' : 'کپی کد'}
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-500">
                <span>
                  بخش:{' '}
                  {item.applicableTo ||
                    SECTION_HINT[item.section] ||
                    item.section}
                </span>
                {item.section === 'consultation' ? (
                  <span>
                    پلن:{' '}
                    {item.planIds?.length
                      ? item.planIds.join('، ')
                      : 'همه پلن‌های پولی'}
                  </span>
                ) : null}
                <span>
                  مصرف: {item.usedCount}/{item.maxUsage}
                </span>
                <span>
                  انقضا: {item.expiresAtLabel || formatFaDate(item.expiresAt)}
                </span>
                <span>{item.isActive ? 'فعال' : 'منقضی / تمام‌شده'}</span>
              </div>
            </article>
          ))}
        </div>
      ) : !isLoading ? (
        <AppEmptyState
          title="کد تخفیفی موجود نیست"
          description="کدهای سراسری فعال و کدهای اختصاصی شما اینجا نمایش داده می‌شوند."
        />
      ) : null}
    </div>
  )
}
