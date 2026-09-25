import type { BlogFaqItem } from '../types'

interface BlogKeyTakeawaysProps {
  items: string[]
}

/** Visible GEO block — also targeted by SpeakableSpecification cssSelector. */
export function BlogKeyTakeaways({ items }: BlogKeyTakeawaysProps) {
  if (items.length === 0) return null

  return (
    <aside
      data-seo-takeaways
      className="rounded-[1.5rem] border border-gold-200 bg-gold-50/80 p-6 sm:p-7"
      aria-labelledby="blog-key-takeaways-heading"
    >
      <h2 id="blog-key-takeaways-heading" className="font-display text-lg font-extrabold text-navy-900">
        جمع‌بندی سریع
      </h2>
      <ul className="mt-4 list-disc space-y-2 ps-5 text-sm leading-7 text-navy-700 marker:text-gold-600 sm:text-base">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  )
}

interface BlogFaqSectionProps {
  items: BlogFaqItem[]
}

export function BlogFaqSection({ items }: BlogFaqSectionProps) {
  if (items.length === 0) return null

  return (
    <section className="mt-12 border-t border-navy-100 pt-10" aria-labelledby="blog-faq-heading">
      <h2 id="blog-faq-heading" className="font-display text-2xl font-extrabold text-navy-900">
        پرسش‌های پرتکرار
      </h2>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <details
            key={item.question}
            className="group rounded-2xl border border-navy-200 bg-white p-4 shadow-soft open:shadow-lift sm:p-5"
          >
            <summary className="cursor-pointer list-none font-display text-base font-bold text-navy-900 marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                {item.question}
                <span
                  className="mt-0.5 size-6 shrink-0 rounded-lg bg-navy-50 text-center text-sm leading-6 text-navy-500 transition group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-8 text-navy-600 sm:text-base">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
