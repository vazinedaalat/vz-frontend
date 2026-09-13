import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui'

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
  children: ReactNode
}

/** Consistent labeled field wrapper for app forms. */
export function Field({ label, htmlFor, error, hint, required, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={htmlFor} className="flex items-center gap-1">
        {label}
        {required ? <span className="text-destructive">*</span> : null}
      </Label>
      {children}
      {hint && !error ? <p className="text-xs leading-6 text-navy-500">{hint}</p> : null}
      {error ? (
        <p className="text-xs leading-6 text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
