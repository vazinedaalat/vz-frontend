import type { CSSProperties } from 'react'
import { Skeleton } from '../skeleton'
import { SkeletonRegion } from '../skeleton-region'
import { cn } from '@/lib/utils'

function staggerStyle(index: number): CSSProperties | undefined {
  if (index <= 0) return undefined
  return { animationDelay: `${Math.min(index, 4) * 70}ms` }
}

export function BlogPostCardSkeleton({
  featured = false,
  index = 0,
  tone = 'default',
}: {
  featured?: boolean
  index?: number
  tone?: 'default' | 'onDark'
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[1.5rem] border shadow-soft',
        tone === 'onDark' ? 'border-white/10 bg-white/5' : 'border-navy-100 bg-white',
        featured && 'lg:col-span-2 lg:flex lg:flex-row',
      )}
      style={staggerStyle(index)}
    >
      <Skeleton
        tone={tone}
        className={cn(
          'rounded-none',
          featured
            ? 'aspect-[16/10] w-full lg:aspect-auto lg:min-h-[16rem] lg:w-[42%]'
            : 'aspect-[16/10] w-full',
        )}
      />
      <div className={cn('flex flex-1 flex-col gap-4 p-6 sm:p-7', featured && 'lg:justify-center lg:p-9')}>
        <Skeleton tone={tone} className="h-5 w-24 rounded-lg" />
        <Skeleton tone={tone} className={cn('h-7 w-[90%]', featured && 'lg:h-9')} />
        <Skeleton tone={tone} className="h-3 w-full" />
        <Skeleton tone={tone} className="h-3 w-[85%]" />
        <Skeleton tone={tone} className="mt-2 h-3 w-32" />
      </div>
    </div>
  )
}

export function BlogPostCardSkeletonGrid({
  count = 6,
  className,
  label = 'در حال بارگذاری مطالب بلاگ',
  withFeatured = true,
}: {
  count?: number
  className?: string
  label?: string
  withFeatured?: boolean
}) {
  return (
    <SkeletonRegion label={label} className={cn('grid gap-5 lg:grid-cols-2 lg:gap-6', className)}>
      {Array.from({ length: count }, (_, index) => (
        <BlogPostCardSkeleton key={index} featured={withFeatured && index === 0} index={index} />
      ))}
    </SkeletonRegion>
  )
}

export function BlogHomeStripSkeleton({
  count = 3,
  className,
  label = 'در حال بارگذاری مطالب بلاگ',
}: {
  count?: number
  className?: string
  label?: string
}) {
  return (
    <SkeletonRegion
      label={label}
      className={cn('mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6', className)}
    >
      {Array.from({ length: count }, (_, index) => (
        <BlogPostCardSkeleton key={index} index={index} />
      ))}
    </SkeletonRegion>
  )
}

export function BlogPostDetailSkeleton({
  className,
  label = 'در حال بارگذاری مطلب',
}: {
  className?: string
  label?: string
}) {
  return (
    <SkeletonRegion label={label} className={cn('mx-auto max-w-3xl space-y-5', className)}>
      <Skeleton className="h-8 w-40 rounded-lg" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-5 w-48" />
      <Skeleton className="aspect-[16/9] w-full rounded-[1.5rem]" />
      <div className="space-y-3 pt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[95%]" />
        <Skeleton className="h-4 w-[88%]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[70%]" />
      </div>
    </SkeletonRegion>
  )
}
