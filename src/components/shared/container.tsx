import type { ElementType, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Render as a different element (e.g. `section`, `header`, `footer`). */
  as?: ElementType
}

/** Page-level width constraint: generous max-width with breathing padding. */
export function Container({ as: Tag = 'div', className, ...props }: ContainerProps) {
  return (
    <Tag
      className={cn('mx-auto w-full max-w-(--container-page) px-5 sm:px-8 lg:px-12', className)}
      {...props}
    />
  )
}
