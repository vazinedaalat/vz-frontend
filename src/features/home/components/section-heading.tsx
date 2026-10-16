import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow: string
  title: ReactNode
  description?: string
  align?: 'start' | 'center'
  tone?: 'light' | 'dark'
  className?: string
}

/** Editorial section intro — hairline gold rule, display title, lead. Copy stays caller-owned. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'light',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex max-w-3xl flex-col',
        align === 'center' ? 'mx-auto items-center text-center' : 'items-start text-start',
        className
      )}
    >
      <span
        className={cn(
          'inline-flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.18em] uppercase sm:text-xs',
          tone === 'dark' ? 'text-gold-400' : 'text-gold-600'
        )}
      >
        <span
          className={cn(
            'h-px w-7 sm:w-10',
            tone === 'dark' ? 'bg-gold-400/70' : 'bg-gold-500'
          )}
          aria-hidden="true"
        />
        {eyebrow}
      </span>

      <h2
        className={cn(
          'font-display mt-4 text-[1.7rem] leading-[1.3] font-extrabold tracking-tight text-balance sm:mt-5 sm:text-[2.35rem] sm:leading-[1.22] lg:text-[2.85rem] lg:leading-[1.18]',
          tone === 'dark' ? 'text-white' : 'text-navy-900'
        )}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={cn(
            'mt-4 max-w-2xl text-[0.95rem] leading-8 sm:mt-5 sm:text-base lg:text-lg lg:leading-9',
            tone === 'dark' ? 'text-white/75' : 'text-navy-600'
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
