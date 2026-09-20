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
          {codes.map((item) => {
            const sectionLabel =
              item.applicableTo || SECTION_HINT[item.section] || item.section
            const planLabel = item.planIds?.length
              ? item.planIds.join('، ')
              : 'همه پلن‌های پولی'
            const expiryLabel = item.expiresAtLabel || formatFaDate(item.expiresAt)

            return (
              <article
                key={item.id}
                className={cn(
                  'min-w-0 overflow-hidden rounded-[1.5rem] border p-4 shadow-soft sm:p-5',
                  item.isActive
                    ? 'border-navy-200 bg-white'
                    : 'border-navy-100 bg-navy-50 opacity-70',
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1">
                      {item.audience === 'user' ? (
                        <span className="inline-block max-w-full truncate rounded-lg bg-gold-100 px-2 py-0.5 text-[11px] font-medium text-gold-800">
                          اختصاصی شما
                        </span>
                      ) : (
                        <span className="inline-block max-w-full truncate rounded-lg bg-navy-100 px-2 py-0.5 text-[11px] font-medium text-navy-700">
                          سراسری
                        </span>
                      )}
                    </div>
                    <h3
                      className="font-display truncate text-base font-bold text-navy-900 sm:text-lg md:whitespace-normal md:break-words"
                      title={item.title}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="mt-1 line-clamp-2 text-sm leading-6 text-navy-600 md:line-clamp-none md:leading-7"
                      title={item.description}
                    >
                      {item.description}
                    </p>
                  </div>
                  <span className="font-display shrink-0 text-xl font-extrabold text-gold-600 sm:text-2xl">
                    {item.percent}٪
                  </span>
                </div>

                <div className="mt-4 flex min-w-0 items-center gap-2 sm:mt-5 sm:gap-3">
                  <code
                    className="min-w-0 flex-1 truncate rounded-xl bg-navy-900 px-3 py-2 text-xs tracking-wider text-gold-300 sm:text-sm"
                    dir="ltr"
                    title={item.code}
                  >
                    {item.code}
                  </code>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    disabled={!item.isActive}
                    onClick={() => copyCode(item.code)}
                  >
                    {copied === item.code ? 'کپی شد' : 'کپی کد'}
                  </Button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-navy-500 sm:flex sm:flex-wrap sm:gap-x-4 sm:gap-y-1">
                  <span className="min-w-0 truncate" title={`بخش: ${sectionLabel}`}>
                    بخش: {sectionLabel}
                  </span>
                  {item.section === 'consultation' ? (
                    <span className="min-w-0 truncate" title={`پلن: ${planLabel}`}>
                      پلن: {planLabel}
                    </span>
                  ) : null}
                  <span className="min-w-0 truncate">
                    مصرف: {item.usedCount}/{item.maxUsage}
                  </span>
                  <span className="min-w-0 truncate" title={`انقضا: ${expiryLabel}`}>
                    انقضا: {expiryLabel}
                  </span>
                  <span className="min-w-0 truncate col-span-2 sm:col-span-1">
                    {item.isActive ? 'فعال' : 'منقضی / تمام‌شده'}
                  </span>
                </div>
              </article>
            )
          })}
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
