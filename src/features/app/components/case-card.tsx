import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { formatFaNumber } from '@/lib/format'
import type { LegalCase } from '../types'

interface CaseCardProps {
  item: LegalCase
}

export function CaseCard({ item }: CaseCardProps) {
  return (
    <Link
      to={`/app/cases/${item.id}`}
      className="group flex h-full flex-col gap-4 rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-gold-400 hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-navy-500">{item.caseNumber}</p>
          <h3 className="font-display mt-1 text-base font-bold text-navy-900 group-hover:text-navy-800">
            {item.title}
          </h3>
        </div>
        <span className="shrink-0 rounded-full bg-gold-100 px-2.5 py-1 text-[0.7rem] font-semibold text-gold-700">
          {item.statusLabel}
        </span>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-navy-500">
          <span>پیشرفت پرونده</span>
          <span>{formatFaNumber(item.progress)}٪</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-navy-100">
          <div className="h-full rounded-full bg-gold-500 transition-all" style={{ width: `${item.progress}%` }} />
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-navy-100 pt-4 text-xs text-navy-500">
        <span>{item.lawyerName}</span>
        <span className="inline-flex items-center gap-1 font-medium text-navy-800">
          جزئیات
          <ArrowLeft className="size-3.5" />
        </span>
      </div>
    </Link>
  )
}
