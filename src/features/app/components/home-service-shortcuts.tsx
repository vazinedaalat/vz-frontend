import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { APP_HOME_SERVICES } from '../constants/home-services'

interface HomeServiceShortcutsProps {
  className?: string
}

/**
 * Blubank-style responsive service icon grid for the app home (below the hero banner).
 * Compact icon + label tiles — one tap to each panel destination.
 */
export function HomeServiceShortcuts({ className }: HomeServiceShortcutsProps) {
  return (
    <nav
      aria-label="خدمات پنل"
      className={cn(
        'rounded-[1.35rem] border border-navy-200 bg-white p-3 shadow-soft sm:rounded-[1.5rem] sm:p-4',
        className,
      )}
    >
      <ul className="grid grid-cols-4 gap-y-4 gap-x-1 sm:grid-cols-4 sm:gap-x-2 md:grid-cols-7 md:gap-y-3">
        {APP_HOME_SERVICES.map((service) => {
          const Icon = service.icon
          return (
            <li key={service.id} className="min-w-0">
              <Link
                to={service.to}
                className={cn(
                  'group flex flex-col items-center gap-2 rounded-2xl px-1 py-1.5 text-center',
                  'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/40',
                  'hover:bg-navy-50/80',
                )}
              >
                <span
                  className={cn(
                    'grid size-12 place-items-center rounded-2xl bg-navy-900 text-gold-300 shadow-soft sm:size-[3.25rem]',
                    'transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lift',
                    'group-active:translate-y-0 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0',
                  )}
                >
                  <Icon className="size-[1.15rem] sm:size-5" strokeWidth={1.7} aria-hidden />
                </span>
                <span className="max-w-full truncate text-[0.68rem] font-semibold leading-4 text-navy-800 sm:text-xs">
                  {service.label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
