import { Link } from 'react-router-dom'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui'
import { formatFaNumber } from '@/lib/format'
import type { LegalCase } from '../types'

interface CaseCardProps {
  item: LegalCase
}

export function CaseCard({ item }: CaseCardProps) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft transition-all hover:border-gold-300 hover:shadow-lift">
      <Link to={`/app/cases/${item.id}`} className="group block min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-navy-500">{item.caseNumber}</p>
            <h3 className="font-display mt-1 text-base font-bold text-navy-900 group-hover:text-navy-800">
              {item.title}
            </h3>
          </div>
          <span className="shrink-0 rounded-full bg-gold-100 px-2.5 py-1 text-[0.7rem] font-semibold text-gold-700">
            {item.statusLabel}
          </span>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs text-navy-500">
            <span>پیشرفت پرونده</span>
            <span>{formatFaNumber(item.progress)}٪</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-navy-100">
            <div className="h-full rounded-full bg-gold-500 transition-all" style={{ width: `${item.progress}%` }} />
          </div>
        </div>

        <p className="mt-3 text-xs text-navy-500">{item.lawyerName}</p>
      </Link>

      <div className="mt-auto flex flex-col gap-2 border-t border-navy-100 pt-4 sm:flex-row">
        <Button variant="outline" size="sm" className="w-full flex-1" asChild>
          <Link to={`/app/cases/${item.id}`}>
            جزئیات
            <ArrowLeft className="size-3.5" aria-hidden />
          </Link>
        </Button>
        <Button variant="accent" size="sm" className="w-full flex-1" asChild>
          <Link to={`/app/cases/${item.id}/chat`}>
            <MessageCircle className="size-3.5" aria-hidden />
            چت پیگیری
          </Link>
        </Button>
      </div>
    </article>
  )
}
