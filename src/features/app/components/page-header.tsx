import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="text-sm font-semibold text-gold-700">{eyebrow}</p> : null}
        <h1 className="font-display mt-1 text-2xl font-extrabold text-navy-900 sm:text-3xl">{title}</h1>
        {description ? <p className="mt-2 text-sm leading-7 text-navy-600 sm:text-base">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}
