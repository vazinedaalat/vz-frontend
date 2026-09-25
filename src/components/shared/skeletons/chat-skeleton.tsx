import type { CSSProperties } from 'react'
import { Skeleton } from '../skeleton'
import { SkeletonRegion } from '../skeleton-region'
import { cn } from '@/lib/utils'

function staggerStyle(index: number): CSSProperties | undefined {
  if (index <= 0) return undefined
  return { animationDelay: `${Math.min(index, 4) * 70}ms` }
}

export function ChatThreadListSkeleton({
  count = 6,
  className,
  label = 'در حال بارگذاری چت پرونده‌ها',
}: {
  count?: number
  className?: string
  label?: string
}) {
  return (
    <SkeletonRegion label={label} className={cn('grid gap-3 md:grid-cols-2', className)}>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-4 shadow-soft"
          style={staggerStyle(index)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
            <Skeleton className="size-8 shrink-0 rounded-xl" />
          </div>
          <Skeleton className="mt-3 h-3 w-36" />
          <Skeleton className="mt-2 h-3 w-full" />
          <Skeleton className="mt-1 h-3 w-[70%]" />
          <Skeleton className="mt-3 h-3 w-28" />
        </div>
      ))}
    </SkeletonRegion>
  )
}

export function SupportTicketListSkeleton({
  count = 8,
  className,
  label = 'در حال بارگذاری تیکت‌ها',
}: {
  count?: number
  className?: string
  label?: string
}) {
  return (
    <SkeletonRegion label={label} className={cn('space-y-2.5', className)}>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-navy-100 bg-white p-4 shadow-soft"
          style={staggerStyle(index)}
        >
          <div className="flex items-start justify-between gap-3">
            <Skeleton className="h-4 w-[65%]" />
            <Skeleton className="h-5 w-14 shrink-0 rounded-lg" />
          </div>
          <Skeleton className="mt-3 h-3 w-40" />
          <Skeleton className="mt-2 h-3 w-full" />
          <Skeleton className="mt-1 h-3 w-[75%]" />
        </div>
      ))}
    </SkeletonRegion>
  )
}

export function ChatThreadPanelSkeleton({
  className,
  label = 'در حال بارگذاری گفتگو',
}: {
  className?: string
  label?: string
}) {
  return (
    <SkeletonRegion
      label={label}
      className={cn(
        'flex min-h-[28rem] flex-col overflow-hidden rounded-[1.5rem] border border-navy-100 bg-white shadow-soft',
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-navy-100 p-4">
        <Skeleton className="size-10 shrink-0 rounded-2xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Skeleton className="ms-auto h-16 w-[72%] rounded-2xl" />
        <Skeleton className="me-auto h-20 w-[78%] rounded-2xl" />
        <Skeleton className="ms-auto h-12 w-[55%] rounded-2xl" />
        <Skeleton className="me-auto h-16 w-[68%] rounded-2xl" />
      </div>
      <div className="border-t border-navy-100 p-4">
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </SkeletonRegion>
  )
}
