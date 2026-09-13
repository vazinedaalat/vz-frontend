import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function AppEmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-[1.5rem] border border-dashed border-navy-200 bg-white px-6 py-14 text-center',
        className
      )}
    >
      <h3 className="font-display text-lg font-bold text-navy-900">{title}</h3>
      <p className="max-w-md text-sm leading-7 text-navy-600">{description}</p>
      {action}
    </div>
  )
}
