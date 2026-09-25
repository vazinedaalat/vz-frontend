import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  /** Soft brand shimmer bone (default) or static fill on dark heroes. */
  tone?: 'default' | 'onDark'
}

/**
 * Base skeleton bone — brand tokens + RTL-friendly shimmer.
 * Decorative only; parent region should set `aria-busy`.
 */
export function Skeleton({ className, tone = 'default', ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'skeleton-bone rounded-xl',
        tone === 'onDark' ? 'skeleton-bone--on-dark' : 'skeleton-bone--default',
        className,
      )}
      {...props}
    />
  )
}
