import type { CSSProperties } from 'react'
import { Skeleton } from '../skeleton'
import { SkeletonRegion } from '../skeleton-region'
import { cn } from '@/lib/utils'

function staggerStyle(index: number): CSSProperties | undefined {
  if (index <= 0) return undefined
  return { animationDelay: `${Math.min(index, 4) * 70}ms` }
}

export function DiscountCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="min-w-0 overflow-hidden rounded-[1.5rem] border border-navy-100 bg-white p-4 shadow-soft sm:p-5"
      style={staggerStyle(index)}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-20 rounded-lg" />
          <Skeleton className="h-5 w-[80%]" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-[90%]" />
        </div>
        <Skeleton className="h-8 w-12 shrink-0" />
      </div>
      <div className="mt-5 flex gap-2">
        <Skeleton className="h-10 min-w-0 flex-1 rounded-xl" />
        <Skeleton className="h-10 w-20 shrink-0 rounded-xl" />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  )
}

export function DiscountCardSkeletonGrid({
  count = 6,
  className,
  label = 'در حال بارگذاری کدهای تخفیف',
}: {
  count?: number
  className?: string
  label?: string
}) {
  return (
    <SkeletonRegion label={label} className={cn('grid gap-4 md:grid-cols-2', className)}>
      {Array.from({ length: count }, (_, index) => (
        <DiscountCardSkeleton key={index} index={index} />
      ))}
    </SkeletonRegion>
  )
}
