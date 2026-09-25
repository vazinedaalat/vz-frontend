import type { CSSProperties } from 'react'
import { Skeleton } from '../skeleton'
import { SkeletonRegion } from '../skeleton-region'
import { cn } from '@/lib/utils'

function staggerStyle(index: number): CSSProperties | undefined {
  if (index <= 0) return undefined
  return { animationDelay: `${Math.min(index, 4) * 70}ms` }
}

export function BookingCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="flex h-full min-w-0 flex-col gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-soft sm:gap-4 sm:p-5"
      style={staggerStyle(index)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-[80%]" />
          <Skeleton className="h-3 w-40" />
        </div>
        <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
      </div>
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="mt-auto h-4 w-28" />
    </div>
  )
}

export function BookingCardSkeletonGrid({
  count = 6,
  className,
  label = 'در حال بارگذاری رزروها',
}: {
  count?: number
  className?: string
  label?: string
}) {
  return (
    <SkeletonRegion
      label={label}
      className={cn('grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3', className)}
    >
      {Array.from({ length: count }, (_, index) => (
        <BookingCardSkeleton key={index} index={index} />
      ))}
    </SkeletonRegion>
  )
}
