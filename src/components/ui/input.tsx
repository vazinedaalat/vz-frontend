import * as React from 'react'
import { cn } from '@/lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl border border-navy-200 bg-white px-3.5 text-sm text-navy-900 shadow-soft transition-colors',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-navy-900',
          'placeholder:text-navy-400 focus-visible:border-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
