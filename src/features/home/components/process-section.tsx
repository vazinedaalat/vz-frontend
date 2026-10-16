import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui'
import { Container } from '@/components/shared/container'
import { Reveal } from '@/components/animated/reveal'
import { toPersianDigits } from '@/lib/format'
import { cn } from '@/lib/utils'
import { CTA, LOGIN_PATH, PROCESS_STEPS, SECTION_IDS } from '../constants'
import { SectionHeading } from './section-heading'

/** Visual journey: timeline on mobile, card grid on desktop. */
export function ProcessSection() {
  return (
    <section id={SECTION_IDS.process} className="relative overflow-hidden bg-navy-50/70 py-14 sm:py-16 lg:bg-white lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 hidden opacity-40 lg:block"
        style={{
          backgroundImage:
            'radial-gradient(circle at 12% 20%, rgb(201 168 108 / 0.18), transparent 36%), radial-gradient(circle at 88% 70%, rgb(11 28 44 / 0.06), transparent 40%)',
        }}
      />

      <Container className="relative">
        <Reveal from="right">
          <SectionHeading
            align="start"
            eyebrow="مراحل کار"
            title={
              <>
                از ثبت‌نام تا اطلاع‌رسانی؛
                <br className="hidden sm:block" />
                {' '}مسیر کاملاً شفاف
              </>
            }
            description="شش گام ساده تا مدیریت پرونده بدون حضور در دفتر. هر مرحله کوتاه، قابل فهم و کاملاً آنلاین است."
          />
          <Button variant="accent" size="lg" className="mt-7 w-full sm:mt-8 sm:w-auto" asChild>
            <Link to={LOGIN_PATH}>
              {CTA.login}
              <ArrowLeft />
            </Link>
          </Button>
        </Reveal>

        {/* Mobile: vertical timeline */}
        <ol className="relative mt-10 space-y-0 lg:hidden">
          <div
            className="pointer-events-none absolute top-3 bottom-3 right-[1.35rem] w-px bg-linear-to-b from-gold-400/80 via-navy-200 to-navy-200"
            aria-hidden="true"
          />
          {PROCESS_STEPS.map((step, index) => {
            const Icon = step.icon
            return (
              <Reveal key={step.id} delay={index * 0.05}>
                <li className="relative flex gap-4 pb-7 last:pb-0">
                  <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-xl bg-navy-900 text-gold-300 shadow-soft">
                    <Icon className="size-5" strokeWidth={1.6} />
                  </span>
                  <div className="min-w-0 flex-1 rounded-2xl border border-navy-200 bg-white p-4 shadow-soft">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-base font-bold text-navy-900">{step.title}</h3>
                      <span className="font-display text-sm font-bold text-gold-600">
                        {toPersianDigits(String(step.step))}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-navy-600">{step.description}</p>
                  </div>
                </li>
              </Reveal>
            )
          })}
        </ol>

        {/* Desktop: card grid (lighter touch — keep existing rhythm) */}
        <ol className="relative mt-14 hidden gap-6 lg:mt-16 lg:grid lg:grid-cols-3">
          <div
            className="pointer-events-none absolute top-[4.25rem] right-[8%] left-[8%] h-px bg-linear-to-l from-transparent via-gold-400/50 to-transparent"
            aria-hidden="true"
          />

          {PROCESS_STEPS.map((step, index) => {
            const Icon = step.icon

            return (
              <Reveal key={step.id} delay={index * 0.07}>
                <li className="group relative h-full list-none">
                  <article
                    className={cn(
                      'relative flex h-full flex-col gap-5 overflow-hidden rounded-[1.5rem] border border-navy-200 bg-navy-50/60 p-7 transition-all duration-300',
                      'hover:-translate-y-1 hover:border-gold-400 hover:bg-white hover:shadow-lift'
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid size-12 place-items-center rounded-2xl bg-navy-900 text-gold-300 transition-colors group-hover:bg-gold-500 group-hover:text-navy-900">
                        <Icon className="size-5" strokeWidth={1.6} />
                      </span>
                      <span className="font-display text-4xl leading-none font-extrabold text-navy-200 transition-colors group-hover:text-gold-400">
                        {toPersianDigits(String(step.step).padStart(2, '0'))}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-xl font-bold text-navy-900">{step.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-navy-600">{step.description}</p>
                    </div>
                  </article>
                </li>
              </Reveal>
            )
          })}
        </ol>
      </Container>
    </section>
  )
}
