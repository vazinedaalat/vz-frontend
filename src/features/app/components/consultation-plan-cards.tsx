import { Check, Gift, MapPin, Sparkles, Video } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatFaNumber, toPersianDigits } from '@/lib/format'
import type { ConsultationPlan, ConsultationPlanId } from '../types'
import { CONSULTATION_PLANS } from '../constants/consultation-plans'

const PLAN_ICON = {
  'free-online': Gift,
  'specialist-online': Video,
  'in-person': MapPin,
  'dargahi-premium': Sparkles,
} as const

interface ConsultationPlanCardsProps {
  value?: ConsultationPlanId
  onChange: (planId: ConsultationPlanId) => void
  plans?: readonly ConsultationPlan[]
}

export function ConsultationPlanCards({
  value,
  onChange,
  plans = CONSULTATION_PLANS,
}: ConsultationPlanCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          selected={value === plan.id}
          onSelect={() => onChange(plan.id)}
        />
      ))}
    </div>
  )
}

function PlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: ConsultationPlan
  selected: boolean
  onSelect: () => void
}) {
  const Icon = PLAN_ICON[plan.id]

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'relative flex h-full min-w-0 w-full flex-col rounded-2xl border p-3.5 text-right transition-all duration-300 sm:p-5',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/40',
        selected
          ? 'border-gold-400 bg-gold-100/70 shadow-soft'
          : 'border-navy-200 bg-white shadow-soft hover:border-gold-300 hover:shadow-lift',
      )}
    >
      {plan.badge ? (
        <span className="absolute start-3 top-3 max-w-[calc(100%-3.5rem)] truncate rounded-lg bg-navy-900 px-2 py-0.5 text-[0.65rem] font-semibold text-gold-300 sm:start-4 sm:top-4">
          {plan.badge}
        </span>
      ) : null}

      <div className="mb-3 flex items-start justify-between gap-3">
        <span
          className={cn(
            'inline-flex size-10 shrink-0 items-center justify-center rounded-xl',
            selected ? 'bg-navy-900 text-gold-300' : 'bg-navy-50 text-navy-700',
          )}
        >
          <Icon className="size-5" aria-hidden />
        </span>
        {selected ? (
          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-gold-500 text-navy-900">
            <Check className="size-3.5" aria-hidden />
          </span>
        ) : null}
      </div>

      <h3 className="font-display text-base font-bold text-navy-900 sm:text-lg">{plan.title}</h3>
      <p className="mt-2 text-sm leading-6 text-navy-600 sm:leading-7">{plan.subtitle}</p>

      <ul className="mt-3 space-y-1.5">
        {plan.highlights.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs leading-6 text-navy-500">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-gold-500" aria-hidden />
            <span className="min-w-0">{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-end justify-between gap-3 pt-4">
        <div className="min-w-0">
          <p className="text-[0.7rem] text-navy-500">{plan.channelLabel}</p>
          <p className="text-xs text-navy-600">{toPersianDigits(plan.durationMinutes)} دقیقه</p>
        </div>
        <p className="shrink-0 font-display text-sm font-bold text-navy-900 sm:text-base">
          {plan.isFree ? (
            <span className="text-gold-700">رایگان</span>
          ) : (
            <>
              {formatFaNumber(plan.price)}
              <span className="mr-1 text-xs font-medium text-navy-500">تومان</span>
            </>
          )}
        </p>
      </div>
    </button>
  )
}
