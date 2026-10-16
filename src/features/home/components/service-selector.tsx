import { cn } from '@/lib/utils'
import { SERVICES } from '../constants'
import type { ServiceId } from '../types'

interface ServiceSelectorProps {
  activeId?: ServiceId | null
  onSelect: (id: ServiceId) => void
}

/** Quick service chips — snap scroll on mobile, grid on desktop. */
export function ServiceSelector({ activeId, onSelect }: ServiceSelectorProps) {
  return (
    <div className="relative">
      <div
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:gap-3 sm:px-0 md:grid md:snap-none md:grid-cols-3 md:overflow-visible lg:grid-cols-6"
        role="tablist"
        aria-label="انتخاب سریع خدمات"
      >
        {SERVICES.map((service) => {
          const Icon = service.icon
          const isActive = activeId === service.id

          return (
            <button
              key={service.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(service.id)}
              className={cn(
                'group flex min-h-11 min-w-[8.5rem] shrink-0 snap-start cursor-pointer flex-col items-start gap-2.5 rounded-2xl border px-3.5 py-3.5 text-start transition-all duration-200 md:min-w-0',
                isActive
                  ? 'border-gold-400 bg-navy-900 text-white shadow-lift'
                  : 'border-navy-200 bg-navy-50/80 text-navy-900 hover:border-gold-400 hover:bg-white hover:shadow-soft'
              )}
            >
              <span
                className={cn(
                  'grid size-9 place-items-center rounded-xl transition-colors',
                  isActive
                    ? 'bg-gold-500/20 text-gold-300'
                    : 'bg-white text-navy-800 group-hover:bg-gold-100 group-hover:text-gold-700'
                )}
              >
                <Icon className="size-4" strokeWidth={1.6} />
              </span>
              <span className="text-sm font-semibold leading-6">{service.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
