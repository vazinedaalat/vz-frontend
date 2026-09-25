import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SkeletonRegionProps = {
  label: string
  className?: string
  children: ReactNode
}

/** Accessible wrapper for a loading region (`aria-busy` + Persian label). */
export function SkeletonRegion({ label, className, children }: SkeletonRegionProps) {
  return (
    <div className={cn(className)} aria-busy="true" aria-label={label} role="status">
      {children}
    </div>
  )
}
