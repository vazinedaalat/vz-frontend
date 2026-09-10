import { Container } from '@/components/shared/container'
import { Reveal } from '@/components/animated/reveal'
import { CountUp } from '@/components/animated/count-up'
import { SECTION_IDS, STATS, TRUST_POINTS } from '../constants'
import { SectionHeading } from './section-heading'

export function WhyUsSection() {
  return (
    <section id={SECTION_IDS.whyUs} className="py-20 lg:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="چرا وزین عدالت؟"
            title="اعتماد، وقتی با عدد و رویه ثابت شود"
            description="سال‌ها حضور در مراجع قضایی، پرونده‌های مختومه و تیمی که هر موضوع را به متخصص همان حوزه می‌سپارد."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
          {STATS.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Reveal key={stat.id} delay={index * 0.06}>
                <article className="flex h-full flex-col gap-4 rounded-[1.5rem] border border-navy-200 bg-white p-7 text-navy-900 shadow-soft">
                  <span className="grid size-11 place-items-center rounded-xl bg-gold-100 text-gold-700">
                    <Icon className="size-5" strokeWidth={1.6} />
                  </span>
                  <p className="font-display text-4xl font-extrabold tracking-tight text-navy-900 lg:text-5xl">
                    <CountUp to={stat.value} />
                    {stat.suffix ? (
                      <span className="text-3xl text-gold-600">{stat.suffix}</span>
                    ) : null}
                  </p>
                  <div>
                    <h3 className="font-display text-lg font-bold text-navy-900">{stat.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-navy-500">{stat.description}</p>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {TRUST_POINTS.map((point, index) => {
            const Icon = point.icon
            return (
              <Reveal key={point.id} delay={0.1 + index * 0.06}>
                <article className="flex h-full gap-4 rounded-[1.5rem] border border-navy-800/90 bg-navy-900 p-7 text-white">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/8 text-gold-400">
                    <Icon className="size-5" strokeWidth={1.6} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">{point.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-navy-200">{point.description}</p>
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
