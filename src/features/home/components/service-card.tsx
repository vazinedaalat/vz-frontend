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
        'group flex h-full flex-col gap-5 rounded-[1.5rem] border p-7 scroll-mt-32 transition-all duration-300 lg:p-8',
        highlighted
          ? 'border-gold-400 bg-white shadow-lift ring-1 ring-gold-400/40'
          : 'border-navy-200 bg-white shadow-soft hover:-translate-y-1 hover:border-gold-300 hover:shadow-lift'
      )}
    >
      <span
        className={cn(
          'grid size-12 place-items-center rounded-2xl transition-colors',
          highlighted
            ? 'bg-navy-900 text-gold-400'
            : 'bg-navy-50 text-navy-800 group-hover:bg-navy-900 group-hover:text-gold-400'
        )}
      >
        <Icon className="size-6" strokeWidth={1.55} />
      </span>
      <div className="flex flex-col gap-3">
        <h3 className="font-display text-xl font-bold text-navy-900">{title}</h3>
        <p className="text-sm leading-7 text-navy-600">{description}</p>
      </div>
    </article>
  )
}
