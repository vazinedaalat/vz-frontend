import { cn } from '@/lib/utils'
import { SERVICES } from '../constants'
import type { ServiceId } from '../types'

interface ServiceSelectorProps {
  activeId?: ServiceId | null
  onSelect: (id: ServiceId) => void
}

/** Horizontal quick-selector for the six core legal services. */
export function ServiceSelector({ activeId, onSelect }: ServiceSelectorProps) {
  return (
    <div className="relative">
      <div
        className="no-scrollbar flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-6"
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
                'group flex min-w-40 flex-col items-start gap-3 rounded-2xl border px-4 py-4 text-start transition-all duration-300 md:min-w-0',
                isActive
                  ? 'border-gold-400 bg-navy-900 text-white shadow-lift'
                  : 'border-navy-200 bg-white text-navy-900 shadow-soft hover:-translate-y-0.5 hover:border-gold-400 hover:shadow-lift'
              )}
            >
              <span
                className={cn(
                  'grid size-10 place-items-center rounded-xl transition-colors',
                  isActive
                    ? 'bg-gold-500/15 text-gold-400'
                    : 'bg-navy-50 text-navy-800 group-hover:bg-gold-100 group-hover:text-gold-700'
                )}
              >
                <Icon className="size-5" strokeWidth={1.6} />
              </span>
              <span className="text-sm font-semibold">{service.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
