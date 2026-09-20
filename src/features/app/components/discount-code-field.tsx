import { CheckCircle2, Loader2, Percent, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button, Input } from '@/components/ui'
import { formatFaNumber, toPersianDigits } from '@/lib/format'
import { Field } from './field'
import { computeDiscountAmount, computeDiscountedPrice } from '../lib/discount-preview'

interface DiscountCodeFieldProps {
  id?: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  fieldError?: string
  validateError?: string | null
  isValidating?: boolean
  isApplied?: boolean
  previewPercent?: number
  previewTitle?: string
  basePrice?: number
  disabled?: boolean
  onValidate: () => void
  onClear: () => void
}

/**
 * Discount input + apply control for payment/booking forms.
 * Calls validate (preview) before submit; does not consume the code.
 */
export function DiscountCodeField({
  id = 'discountCode',
  value,
  onChange,
  onBlur,
  fieldError,
  validateError,
  isValidating = false,
  isApplied = false,
  previewPercent,
  previewTitle,
  basePrice = 0,
  disabled = false,
  onValidate,
  onClear,
}: DiscountCodeFieldProps) {
  const discounted =
    isApplied && previewPercent != null ? computeDiscountedPrice(basePrice, previewPercent) : null
  const savings =
    isApplied && previewPercent != null ? computeDiscountAmount(basePrice, previewPercent) : null
  const errorMessage = fieldError || validateError || undefined

  return (
    <Field
      label="کد تخفیف (اختیاری)"
      htmlFor={id}
      error={errorMessage}
      hint={
        isApplied
          ? undefined
          : 'قبل از پرداخت، کد را اعمال کنید تا مبلغ تخفیف‌خورده را ببینید.'
      }
    >
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch">
        <div className="relative min-w-0 flex-1">
          <Input
            id={id}
            name={id}
            value={value}
            onChange={(event) => onChange(event.target.value.toUpperCase())}
            onBlur={onBlur}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                if (!isApplied && !isValidating && value.trim()) onValidate()
              }
            }}
            placeholder="مثلاً VAZIN40"
            autoComplete="off"
            spellCheck={false}
            disabled={disabled || isValidating}
            className="ps-3 pe-10 uppercase tracking-wide"
            dir="ltr"
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={isApplied ? `${id}-preview` : undefined}
          />
          {isApplied ? (
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gold-600">
              <CheckCircle2 className="size-4" aria-hidden />
            </span>
          ) : (
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-navy-400">
              <Percent className="size-4" aria-hidden />
            </span>
          )}
        </div>

        {isApplied ? (
          <Button
            type="button"
            variant="outline"
            className="w-full shrink-0 sm:w-auto"
            onClick={onClear}
            disabled={disabled}
          >
            <X className="size-4" aria-hidden />
            حذف کد
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full shrink-0 sm:min-w-[7.5rem] sm:w-auto"
            onClick={onValidate}
            disabled={disabled || isValidating || !value.trim()}
          >
            {isValidating ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                بررسی…
              </>
            ) : (
              'اعمال کد'
            )}
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isApplied && previewPercent != null ? (
          <motion.div
            key="applied"
            id={`${id}-preview`}
            role="status"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
            className="mt-1 rounded-xl border border-gold-300 bg-gold-100/80 px-3 py-3 sm:px-3.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy-900">
                  {toPersianDigits(previewPercent)}٪ تخفیف اعمال شد
                </p>
                {previewTitle ? (
                  <p className="mt-0.5 truncate text-xs text-navy-600" title={previewTitle}>
                    {previewTitle}
                  </p>
                ) : null}
              </div>
              <span className="font-display shrink-0 text-lg font-extrabold text-gold-700">
                {toPersianDigits(previewPercent)}٪
              </span>
            </div>
            {basePrice > 0 && discounted != null && savings != null ? (
              <p className="mt-2 text-xs leading-6 text-navy-700">
                مبلغ پس از تخفیف:{' '}
                <span className="font-semibold text-navy-900">{formatFaNumber(discounted)} تومان</span>
                <span className="text-navy-500"> · صرفه‌جویی {formatFaNumber(savings)} تومان</span>
              </p>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Field>
  )
}
