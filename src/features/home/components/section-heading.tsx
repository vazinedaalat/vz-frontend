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

/** Shared section intro: small gold eyebrow, large display title, lead paragraph. */
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
        'flex max-w-3xl flex-col gap-5',
        align === 'center' ? 'mx-auto items-center text-center' : 'items-start text-start',
        className
      )}
    >
      <span
        className={cn(
          'inline-flex items-center gap-2 text-sm font-semibold',
          tone === 'dark' ? 'text-gold-400' : 'text-gold-600'
        )}
      >
        <span
          className={cn('h-px w-8', tone === 'dark' ? 'bg-gold-400/60' : 'bg-gold-500/70')}
          aria-hidden="true"
        />
        {eyebrow}
      </span>

      <h2
        className={cn(
          'font-display text-3xl leading-[1.25] font-extrabold text-balance sm:text-4xl lg:text-[2.75rem]',
          tone === 'dark' ? 'text-white' : 'text-navy-900'
        )}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={cn(
            'max-w-2xl text-base leading-8 lg:text-lg',
            tone === 'dark' ? 'text-navy-200' : 'text-navy-500'
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
