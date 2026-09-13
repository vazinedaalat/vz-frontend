import * as React from 'react'
import { cn } from '@/lib/utils'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        'flex min-h-28 w-full rounded-xl border border-navy-200 bg-white px-3.5 py-3 text-sm text-navy-900 shadow-soft transition-colors',
        'placeholder:text-navy-400 focus-visible:border-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/30',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'

export { Textarea }
