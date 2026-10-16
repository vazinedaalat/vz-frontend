import { Container } from '@/components/shared/container'
import { Reveal } from '@/components/animated/reveal'
import { CountUp } from '@/components/animated/count-up'
import { SECTION_IDS, STATS, TRUST_POINTS } from '../constants'
import { SectionHeading } from './section-heading'

export function WhyUsSection() {
  return (
    <section id={SECTION_IDS.whyUs} className="py-14 sm:py-16 lg:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="چرا وزین عدالت؟"
            title="حرفه‌ای مثل دفتر حقوقی؛ سریع مثل یک استارتاپ"
            description="همان دقت لایحه‌نویسی و وکالت پایه یک، با تجربه آنلاین: بدون حضور، بدون صف، با پیگیری لحظه‌ای."
          />
        </Reveal>

        {/* Mobile: compact 2×2 stats; desktop: 4-col */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:mt-14 lg:grid-cols-4 lg:gap-6">
          {STATS.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Reveal key={stat.id} delay={index * 0.05}>
                <article className="flex h-full flex-col gap-3 rounded-2xl border border-navy-200 bg-white p-4 text-navy-900 shadow-soft sm:gap-4 sm:rounded-[1.5rem] sm:p-7">
                  <span className="grid size-9 place-items-center rounded-lg bg-gold-100 text-gold-700 sm:size-11 sm:rounded-xl">
                    <Icon className="size-4 sm:size-5" strokeWidth={1.6} />
                  </span>
                  <p className="font-display text-2xl font-extrabold tracking-tight text-navy-900 sm:text-4xl lg:text-5xl">
                    <CountUp to={stat.value} />
                    {stat.suffix ? (
                      <span className="text-xl text-gold-600 sm:text-3xl">{stat.suffix}</span>
                    ) : null}
                  </p>
                  <div>
                    <h3 className="font-display text-sm font-bold text-navy-900 sm:text-lg">
                      {stat.title}
                    </h3>
                    <p className="mt-1 hidden text-sm leading-7 text-navy-600 sm:mt-2 sm:block">
                      {stat.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>

        <div className="mt-4 grid gap-3 sm:mt-8 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {TRUST_POINTS.map((point, index) => {
            const Icon = point.icon
            return (
              <Reveal key={point.id} delay={0.08 + index * 0.05}>
                <article className="flex h-full gap-3.5 rounded-2xl border border-navy-800/90 bg-navy-900 p-5 text-white sm:gap-4 sm:rounded-[1.5rem] sm:p-7">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-gold-300 sm:size-11">
                    <Icon className="size-5" strokeWidth={1.6} />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-white sm:text-lg">
                      {point.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-7 text-white/80 sm:mt-2">
                      {point.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
