import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ServiceCardProps {
  id: string
  title: string
  description: string
  icon: LucideIcon
  highlighted?: boolean
}

export function ServiceCard({ id, title, description, icon: Icon, highlighted = false }: ServiceCardProps) {
  return (
    <article
      id={`service-${id}`}
      className={cn(
        'group flex h-full flex-col gap-4 rounded-2xl border p-5 scroll-mt-28 transition-all duration-200 sm:gap-5 sm:rounded-[1.5rem] sm:p-7 lg:scroll-mt-32 lg:p-8',
        highlighted
          ? 'border-gold-400 bg-white shadow-lift ring-1 ring-gold-400/40'
          : 'border-navy-200 bg-white shadow-soft hover:border-gold-300 hover:shadow-lift sm:hover:-translate-y-1'
      )}
    >
      <span
        className={cn(
          'grid size-11 place-items-center rounded-xl transition-colors sm:size-12 sm:rounded-2xl',
          highlighted
            ? 'bg-navy-900 text-gold-400'
            : 'bg-navy-50 text-navy-800 group-hover:bg-navy-900 group-hover:text-gold-400'
        )}
      >
        <Icon className="size-5 sm:size-6" strokeWidth={1.55} />
      </span>
      <div className="flex flex-col gap-2 sm:gap-3">
        <h3 className="font-display text-lg font-bold text-navy-900 sm:text-xl">{title}</h3>
        <p className="text-sm leading-7 text-navy-600">{description}</p>
      </div>
    </article>
  )
}
