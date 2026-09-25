import type { CSSProperties } from 'react'
import { Skeleton } from '../skeleton'
import { SkeletonRegion } from '../skeleton-region'
import { cn } from '@/lib/utils'

function staggerStyle(index: number): CSSProperties | undefined {
  if (index <= 0) return undefined
  return { animationDelay: `${Math.min(index, 4) * 70}ms` }
}

export function ListRowSkeleton({ index = 0, className }: { index?: number; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-[1.25rem] border border-navy-100 bg-white p-5 shadow-soft',
        className,
      )}
      style={staggerStyle(index)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-5 w-[70%]" />
        </div>
        <Skeleton className="h-5 w-12 shrink-0 rounded-full" />
      </div>
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-[88%]" />
      <Skeleton className="mt-3 h-3 w-24" />
    </div>
  )
}

export function ListRowSkeletonStack({
  count = 8,
  className,
  label = 'در حال بارگذاری فهرست',
}: {
  count?: number
  className?: string
  label?: string
}) {
  return (
    <SkeletonRegion label={label} className={cn('space-y-3', className)}>
      {Array.from({ length: count }, (_, index) => (
        <ListRowSkeleton key={index} index={index} />
      ))}
    </SkeletonRegion>
  )
}
