import { Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatFaNumber, toPersianDigits } from '@/lib/format'
import { formatFaDateTime } from '@/lib/jalali'
import { reconcileCaseStages } from '../lib/case-process'
import type { LegalCase } from '../types'

interface CaseProcessPanelProps {
  item: LegalCase
}

/** Timeline for case stages — driven by Nest `GET /cases/:id` status + stages. */
export function CaseProcessPanel({ item }: CaseProcessPanelProps) {
  const stages = reconcileCaseStages(item.stages, item.status)
  const completedCount = stages.filter((stage) => stage.completed).length
  const progress = Math.max(0, Math.min(100, item.progress))

  return (
    <section className="rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold">فرآیند پرونده</h2>
        <span className="rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-700">
          {item.statusLabel}
        </span>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-navy-500">
          <span>پیشرفت</span>
          <span className="font-medium text-navy-700">
            {stages.length > 0
              ? `${toPersianDigits(completedCount)} از ${toPersianDigits(stages.length)} · ${formatFaNumber(progress)}٪`
              : `${formatFaNumber(progress)}٪`}
          </span>
        </div>
        <div
          className="h-2.5 overflow-hidden rounded-full bg-navy-100"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`پیشرفت پرونده: ${formatFaNumber(progress)} درصد`}
        >
          <div
            className="h-full rounded-full bg-gold-500 transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {stages.length === 0 ? (
        <p className="mt-6 text-sm leading-7 text-navy-500">هنوز مرحله‌ای برای این پرونده ثبت نشده است.</p>
      ) : (
        <ol className="relative mt-8 space-y-0">
          {stages.map((stage, index) => {
            const isLast = index === stages.length - 1
            const lineDone = stage.state === 'done'
            return (
              <li
                key={stage.id}
                className="relative flex gap-4 pb-8 last:pb-0"
                aria-current={stage.state === 'current' ? 'step' : undefined}
              >
                {!isLast ? (
                  <span
                    className={cn(
                      'absolute top-8 right-[0.95rem] h-[calc(100%-1.5rem)] w-px',
                      lineDone ? 'bg-gold-400' : 'bg-navy-200',
                    )}
                    aria-hidden
                  />
                ) : null}

                <span
                  className={cn(
                    'relative z-10 mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border text-xs font-bold',
                    stage.state === 'done' && 'border-gold-500 bg-gold-500 text-navy-900',
                    stage.state === 'current' &&
                      'border-navy-900 bg-navy-900 text-gold-300 shadow-soft ring-4 ring-gold-200/70',
                    stage.state === 'upcoming' && 'border-navy-200 bg-white text-navy-400',
                  )}
                  aria-hidden
                >
                  {stage.state === 'done' ? (
                    <Check className="size-4" strokeWidth={2.4} />
                  ) : stage.state === 'current' ? (
                    <Circle className="size-2.5 fill-current" />
                  ) : (
                    toPersianDigits(index + 1)
                  )}
                </span>

                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={cn(
                        'font-semibold',
                        stage.state === 'upcoming' ? 'text-navy-500' : 'text-navy-900',
                      )}
                    >
                      {stage.title}
                    </h3>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[0.65rem] font-semibold',
                        stage.state === 'done' && 'bg-gold-100 text-gold-800',
                        stage.state === 'current' && 'bg-navy-900 text-gold-300',
                        stage.state === 'upcoming' && 'bg-navy-50 text-navy-500',
                      )}
                    >
                      {stage.state === 'done' ? 'انجام‌شده' : stage.state === 'current' ? 'در جریان' : 'آینده'}
                    </span>
                  </div>
                  <p
                    className={cn(
                      'mt-1 text-sm leading-7',
                      stage.state === 'upcoming' ? 'text-navy-400' : 'text-navy-600',
                    )}
                  >
                    {stage.description}
                  </p>
                  {stage.at ? (
                    <p className="mt-1 text-xs text-navy-400">{formatFaDateTime(stage.at)}</p>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
