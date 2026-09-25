import type { CSSProperties } from 'react'
import { Skeleton } from '../skeleton'
import { SkeletonRegion } from '../skeleton-region'
import { cn } from '@/lib/utils'

function staggerStyle(index: number): CSSProperties | undefined {
  if (index <= 0) return undefined
  return { animationDelay: `${Math.min(index, 4) * 70}ms` }
}

export function CaseCardSkeleton({ className, index = 0 }: { className?: string; index?: number }) {
  return (
    <div
      className={cn(
        'flex h-full flex-col gap-4 rounded-[1.5rem] border border-navy-100 bg-white p-5 shadow-soft',
        className,
      )}
      style={staggerStyle(index)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-[85%]" />
        </div>
        <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between gap-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-10" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      <Skeleton className="h-3 w-2/3" />
      <div className="mt-auto grid grid-cols-1 gap-2 border-t border-navy-100 pt-4 sm:grid-cols-2">
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </div>
  )
}

export function CaseCardSkeletonGrid({
  count = 6,
  className,
  label = 'در حال بارگذاری پرونده‌ها',
}: {
  count?: number
  className?: string
  label?: string
}) {
  return (
    <SkeletonRegion label={label} className={cn('grid gap-4 md:grid-cols-2 xl:grid-cols-3', className)}>
      {Array.from({ length: count }, (_, index) => (
        <CaseCardSkeleton key={index} index={index} />
      ))}
    </SkeletonRegion>
  )
}
