import { ChevronDown } from 'lucide-react'
import { CASE_DELIVERY_METHODS, CASE_FILE_RULE_SECTIONS } from '../constants/case-intake'

/** Expandable guidance for file rules and delivery methods. */
export function CaseRulesDropdowns() {
  return (
    <div className="space-y-3">
      <details className="group rounded-2xl border border-navy-200 bg-white shadow-soft open:shadow-lift">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-semibold text-navy-900 marker:content-none [&::-webkit-details-marker]:hidden">
          <span>قوانین ارسال فایل</span>
          <ChevronDown
            className="size-4 shrink-0 text-navy-500 transition-transform duration-200 group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <div className="space-y-4 border-t border-navy-100 px-4 py-4">
          {CASE_FILE_RULE_SECTIONS.map((section) => (
            <div key={section.id}>
              <h3 className="text-sm font-semibold text-navy-900">{section.title}</h3>
              <ul className="mt-2 space-y-1.5">
                {section.body.map((line) => (
                  <li key={line} className="flex gap-2 text-xs leading-6 text-navy-600">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-gold-500" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>

      <details className="group rounded-2xl border border-navy-200 bg-white shadow-soft open:shadow-lift">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-semibold text-navy-900 marker:content-none [&::-webkit-details-marker]:hidden">
          <span>روش‌های ارسال مدارک</span>
          <ChevronDown
            className="size-4 shrink-0 text-navy-500 transition-transform duration-200 group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <div className="space-y-3 border-t border-navy-100 px-4 py-4">
          {CASE_DELIVERY_METHODS.map((method) => (
            <article
              key={method.id}
              className="rounded-xl border border-navy-100 bg-navy-50/60 px-3.5 py-3"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-navy-900">{method.title}</h3>
                {method.recommended ? (
                  <span className="rounded-lg bg-navy-900 px-2 py-0.5 text-[0.65rem] font-semibold text-gold-300">
                    پیشنهادی
                  </span>
                ) : null}
              </div>
              <p className="mt-1.5 text-xs leading-6 text-navy-600">{method.description}</p>
            </article>
          ))}
        </div>
      </details>
    </div>
  )
}
