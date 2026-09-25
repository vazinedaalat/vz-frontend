import * as React from 'react'
import { Input, type InputProps } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { formatAmountInput, parseAmountDigits } from '@/lib/format'

export type AmountInputProps = Omit<InputProps, 'value' | 'onChange' | 'type' | 'inputMode'> & {
  /** ASCII digits only (form / API-ready). Display is formatted with thousand separators. */
  value: string
  onChange: (digits: string) => void
}

/**
 * Money field with live Persian digit + thousand-separator display.
 * Stores/emits raw ASCII digits so the backend is never affected.
 */
export const AmountInput = React.forwardRef<HTMLInputElement, AmountInputProps>(
  ({ value, onChange, className, dir = 'ltr', ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        spellCheck={false}
        dir={dir}
        className={cn('text-left tabular-nums tracking-wide', className)}
        value={formatAmountInput(value)}
        onChange={(event) => {
          onChange(parseAmountDigits(event.target.value))
        }}
        {...props}
      />
    )
  },
)
AmountInput.displayName = 'AmountInput'
