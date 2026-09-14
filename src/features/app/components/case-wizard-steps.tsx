import { cn } from '@/lib/utils'
import { toPersianDigits } from '@/lib/format'
import type { CreateCaseWizardStep } from '../types'

const STEPS: Array<{ id: CreateCaseWizardStep; label: string }> = [
  { id: 'intake', label: 'اطلاعات پرونده' },
  { id: 'upload', label: 'آپلود مدارک' },
  { id: 'prepayment', label: 'پیش‌پرداخت' },
  { id: 'completed', label: 'ادامه مسیر' },
]

interface CaseWizardStepsProps {
  current: CreateCaseWizardStep
}

export function CaseWizardSteps({ current }: CaseWizardStepsProps) {
  const currentIndex = STEPS.findIndex((step) => step.id === current)

  return (
    <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {STEPS.map((step, index) => {
        const active = index === currentIndex
        const done = index < currentIndex
        return (
          <li
            key={step.id}
            className={cn(
              'rounded-2xl border px-3 py-3 transition-colors',
              active && 'border-gold-400 bg-gold-100/80 shadow-soft',
              done && 'border-navy-200 bg-white',
              !active && !done && 'border-navy-100 bg-navy-50/50',
            )}
          >
            <p className={cn('text-[0.65rem] font-semibold', active ? 'text-gold-700' : 'text-navy-500')}>
              مرحله {toPersianDigits(index + 1)}
            </p>
            <p className={cn('mt-1 text-sm font-semibold', active || done ? 'text-navy-900' : 'text-navy-400')}>
              {step.label}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
