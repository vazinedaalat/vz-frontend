import { useState } from 'react'
import { Button } from '@/components/ui'
import { getDiscountCodes } from '../mocks/data'
import { AppEmptyState } from '../components/app-empty-state'
import { PageHeader } from '../components/page-header'
import { cn } from '@/lib/utils'

export default function DiscountsPage() {
  const codes = getDiscountCodes()
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
        description="کد را کپی کنید و هنگام رزرو مشاوره یا ثبت درخواست سند اعمال کنید."
      />

      {codes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {codes.map((item) => (
            <article
              key={item.id}
              className={cn(
                'rounded-[1.5rem] border p-5 shadow-soft',
                item.isActive ? 'border-navy-200 bg-white' : 'border-navy-100 bg-navy-50 opacity-70'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-navy-600">{item.description}</p>
                </div>
                <span className="font-display text-2xl font-extrabold text-gold-600">{item.percent}٪</span>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <code className="rounded-xl bg-navy-900 px-3 py-2 text-sm tracking-wider text-gold-300" dir="ltr">
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
                <span>قابل استفاده در: {item.applicableTo}</span>
                <span>
                  مصرف: {item.usedCount}/{item.maxUsage}
                </span>
                <span>انقضا: {item.expiresAt}</span>
                <span>{item.isActive ? 'فعال' : 'منقضی / تمام‌شده'}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <AppEmptyState
          title="کد تخفیفی موجود نیست"
          description="کدهای تخفیف در محیط تولید از سرویس کمپین دریافت می‌شوند."
        />
      )}
    </div>
  )
}
