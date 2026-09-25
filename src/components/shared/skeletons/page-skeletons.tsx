import { Skeleton } from '../skeleton'
import { SkeletonRegion } from '../skeleton-region'
import { cn } from '@/lib/utils'
import { CaseCardSkeletonGrid } from './case-card-skeleton'
import { DocumentCardSkeletonStack } from './document-card-skeleton'
import { ListRowSkeleton } from './list-row-skeleton'

export function CaseDetailSkeleton({
  className,
  label = 'در حال بارگذاری پرونده',
}: {
  className?: string
  label?: string
}) {
  return (
    <SkeletonRegion label={label} className={cn('space-y-8', className)}>
      <div className="space-y-3">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-8 w-[70%] max-w-xl" />
        <Skeleton className="h-4 w-56" />
        <div className="flex flex-wrap gap-2 pt-1">
          <Skeleton className="h-11 w-32 rounded-xl" />
          <Skeleton className="h-11 w-36 rounded-xl" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4 rounded-[1.5rem] border border-navy-100 bg-white p-5 shadow-soft sm:p-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="space-y-3 pt-2">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="flex gap-3">
                <Skeleton className="size-8 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-[55%]" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <ListRowSkeleton />
          <ListRowSkeleton index={1} />
          <ListRowSkeleton index={2} />
        </div>
      </div>
    </SkeletonRegion>
  )
}

export function AppHomeSkeleton({
  className,
  label = 'در حال بارگذاری داشبورد',
}: {
  className?: string
  label?: string
}) {
  return (
    <SkeletonRegion label={label} className={cn('space-y-8 sm:space-y-10', className)}>
      <Skeleton className="aspect-[21/9] w-full rounded-[1.5rem] sm:aspect-[3/1]" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-24 rounded-2xl" />
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-28 rounded-[1.5rem]" />
          <Skeleton className="h-28 rounded-[1.5rem]" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <CaseCardSkeletonGrid count={3} label="در حال بارگذاری پرونده‌ها" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-24" />
        </div>
        <DocumentCardSkeletonStack count={2} compact label="در حال بارگذاری اسناد" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <Skeleton className="h-6 w-28" />
          <ListRowSkeleton />
          <ListRowSkeleton index={1} />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-32" />
          <ListRowSkeleton />
          <ListRowSkeleton index={1} />
        </div>
      </div>
    </SkeletonRegion>
  )
}

/** In-app route Suspense fallback — keeps perceived shell, not a lone spinner. */
export function AppRouteSkeleton({
  className,
  label = 'در حال بارگذاری صفحه',
}: {
  className?: string
  label?: string
}) {
  return (
    <SkeletonRegion label={label} className={cn('space-y-6 py-2', className)}>
      <div className="space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-44 rounded-[1.5rem]" />
        <Skeleton className="h-44 rounded-[1.5rem]" />
        <Skeleton className="hidden h-44 rounded-[1.5rem] xl:block" />
      </div>
    </SkeletonRegion>
  )
}

/** Marketing / full-page Suspense fallback. */
export function MarketingRouteSkeleton({
  className,
  label = 'در حال بارگذاری صفحه',
}: {
  className?: string
  label?: string
}) {
  return (
    <div className={cn('min-h-screen bg-navy-50', className)}>
      <SkeletonRegion label={label}>
        <div className="border-b border-navy-100 bg-navy-900 px-4 py-5 sm:px-8">
          <div className="mx-auto flex max-w-(--container-page) items-center justify-between gap-4">
            <Skeleton tone="onDark" className="h-9 w-36" />
            <div className="hidden gap-3 md:flex">
              <Skeleton tone="onDark" className="h-4 w-16" />
              <Skeleton tone="onDark" className="h-4 w-16" />
              <Skeleton tone="onDark" className="h-4 w-16" />
            </div>
            <Skeleton tone="onDark" className="h-10 w-28 rounded-xl" />
          </div>
        </div>
        <div className="mx-auto max-w-(--container-page) space-y-6 px-4 py-12 sm:px-8 lg:py-16">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-12 w-full max-w-2xl" />
          <Skeleton className="h-4 w-full max-w-xl" />
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Skeleton className="h-12 w-full rounded-xl sm:w-40" />
            <Skeleton className="h-12 w-full rounded-xl sm:w-40" />
          </div>
          <div className="grid gap-5 pt-8 lg:grid-cols-2">
            <Skeleton className="h-64 rounded-[1.5rem]" />
            <Skeleton className="h-64 rounded-[1.5rem]" />
          </div>
        </div>
      </SkeletonRegion>
    </div>
  )
}
