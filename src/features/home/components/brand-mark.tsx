import { Scale } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BRAND } from '../constants'

interface BrandMarkProps {
  /** `dark` renders the wordmark for navy surfaces (footer, overlays). */
  tone?: 'light' | 'dark'
  className?: string
  onClick?: () => void
  href?: string
}

/** Typographic logo: gold scales emblem + «وزین عدالت» wordmark. */
export function BrandMark({ tone = 'light', className, onClick, href = '#home' }: BrandMarkProps) {
  return (
    <a
      href={href}
      onClick={(event) => {
        if (!onClick) return
        event.preventDefault()
        onClick()
      }}
      className={cn('group flex shrink-0 items-center gap-3 rounded-2xl', className)}
      aria-label={BRAND.name}
    >
      <span
        className={cn(
          'grid size-11 place-items-center rounded-2xl transition-transform duration-500 group-hover:-rotate-6 lg:size-12',
          tone === 'dark'
            ? 'bg-white/10 text-gold-400 ring-1 ring-white/15'
            : 'bg-navy-900 text-gold-400 shadow-soft'
        )}
      >
        <Scale className="size-5 lg:size-6" strokeWidth={1.6} />
      </span>

      <span className="flex flex-col">
        <span
          className={cn(
            'font-display text-lg leading-tight font-extrabold lg:text-xl',
            tone === 'dark' ? 'text-white' : 'text-navy-900'
          )}
        >
          {BRAND.nameLead}{' '}
          <span className={tone === 'dark' ? 'text-gold-400' : 'text-gold-600'}>
            {BRAND.nameTrail}
          </span>
        </span>
        <span
          className={cn(
            'text-[0.7rem] leading-tight font-medium',
            tone === 'dark' ? 'text-navy-200' : 'text-navy-500'
          )}
        >
          {BRAND.tagline}
        </span>
      </span>
    </a>
  )
}
