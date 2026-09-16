import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Hash, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface BookingCodeDisplayProps {
  code: string
  /** `hero` after successful booking; `compact` inside lists/cards */
  variant?: 'hero' | 'compact'
  className?: string
}

/** Premium display for the unique consultation booking code from the API. */
export function BookingCodeDisplay({ code, variant = 'compact', className }: BookingCodeDisplayProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  if (variant === 'hero') {
    return (
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={cn(
          'w-full max-w-full min-w-0 overflow-hidden rounded-[1.25rem] border border-navy-800 bg-navy-900 text-white shadow-lift sm:rounded-[1.5rem]',
          className,
        )}
        aria-label="کد یکتای رزرو"
      >
        <div className="relative px-4 py-5 sm:px-7 sm:py-8">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--color-gold-500)_0%,transparent_55%)] opacity-20"
            aria-hidden
          />
          <div className="relative flex min-w-0 flex-col gap-4 sm:gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-gold-500/15 text-gold-300">
                  <ShieldCheck className="size-4" strokeWidth={1.7} aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-[0.7rem] font-semibold tracking-wide text-gold-300">کد پیگیری رزرو</p>
                  <p className="mt-0.5 text-xs leading-5 text-white/65">
                    این کد را برای مراجعه و پیگیری نگه دارید
                  </p>
                </div>
              </div>

              <p
                dir="ltr"
                className="font-display max-w-full break-all text-lg font-extrabold tracking-wide text-gold-300 sm:text-2xl sm:tracking-[0.12em] md:text-3xl"
              >
                {code}
              </p>
            </div>

            <Button
              type="button"
              variant="accent"
              size="lg"
              className="h-11 w-full shrink-0 sm:h-12 sm:w-auto"
              onClick={() => void copy()}
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="ok"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="inline-flex items-center gap-2"
                  >
                    <Check className="size-4" aria-hidden />
                    کپی شد
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="inline-flex items-center gap-2"
                  >
                    <Copy className="size-4" aria-hidden />
                    کپی کد
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </motion.section>
    )
  }

  return (
    <div
      className={cn(
        'flex min-w-0 max-w-full items-center gap-2 rounded-xl border border-navy-200 bg-navy-50/80 p-2 ps-2.5',
        className,
      )}
    >
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-gold-300">
        <Hash className="size-3.5" strokeWidth={1.8} aria-hidden />
      </span>
      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="text-[0.65rem] font-medium text-navy-500">کد رزرو</p>
        <p
          dir="ltr"
          className="truncate font-display text-xs font-bold tracking-wide text-navy-900 sm:text-sm sm:tracking-wider"
        >
          {code}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-9 shrink-0"
        aria-label={copied ? 'کپی شد' : 'کپی کد رزرو'}
        onClick={() => void copy()}
      >
        {copied ? <Check className="size-4 text-gold-700" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      </Button>
    </div>
  )
}
