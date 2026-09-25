import type { CSSProperties } from 'react'
import { Skeleton } from '../skeleton'
import { SkeletonRegion } from '../skeleton-region'
import { cn } from '@/lib/utils'

function staggerStyle(index: number): CSSProperties | undefined {
  if (index <= 0) return undefined
  return { animationDelay: `${Math.min(index, 4) * 70}ms` }
}

export function DocumentCardSkeleton({
  index = 0,
  compact = false,
}: {
  index?: number
  compact?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-navy-100 bg-white shadow-soft',
        compact ? 'p-4' : 'p-5 sm:p-6',
      )}
      style={staggerStyle(index)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-24 rounded-lg" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className={cn('h-5', compact ? 'w-[75%]' : 'w-[85%]')} />
          {!compact ? (
            <>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-[70%]" />
            </>
          ) : null}
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="flex gap-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  )
}

export function DocumentCardSkeletonStack({
  count = 5,
  className,
  label = 'در حال بارگذاری درخواست‌های سند',
  compact = false,
}: {
  count?: number
  className?: string
  label?: string
  compact?: boolean
}) {
  return (
    <SkeletonRegion
      label={label}
      className={cn(compact ? 'grid gap-3 md:grid-cols-2' : 'grid gap-3 sm:gap-4', className)}
    >
      {Array.from({ length: count }, (_, index) => (
        <DocumentCardSkeleton key={index} index={index} compact={compact} />
      ))}
    </SkeletonRegion>
  )
}
