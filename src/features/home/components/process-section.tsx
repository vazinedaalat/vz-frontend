import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui'
import { Container } from '@/components/shared/container'
import { Reveal } from '@/components/animated/reveal'
import { toPersianDigits } from '@/lib/format'
import { cn } from '@/lib/utils'
import { CTA, LOGIN_PATH, PROCESS_STEPS, SECTION_IDS } from '../constants'
import { SectionHeading } from './section-heading'

/** Timeline on mobile, refined card grid on desktop — same step copy. */
export function ProcessSection() {
  return (
    <section
      id={SECTION_IDS.process}
      className="relative overflow-hidden bg-navy-50/80 py-16 sm:py-20 lg:bg-navy-50/40 lg:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(circle at 12% 18%, rgb(201 168 108 / 0.14), transparent 34%), radial-gradient(circle at 88% 72%, rgb(11 28 44 / 0.05), transparent 38%)',
        }}
      />

      <Container className="relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <Reveal from="right" className="max-w-xl">
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
            <Button variant="accent" size="lg" className="mt-8 w-full rounded-2xl sm:w-auto" asChild>
              <Link to={LOGIN_PATH}>
                {CTA.login}
                <ArrowLeft />
              </Link>
            </Button>
          </Reveal>

          <Reveal delay={0.1} className="hidden max-w-sm lg:block">
            <p className="text-sm leading-8 text-navy-600">
              نیازی به مراجعه حضوری نیست؛ بعد از ثبت‌نام، مشاوره، تشکیل پرونده و پیگیری را از داخل اپ انجام
              می‌دهید.
            </p>
          </Reveal>
        </div>

        {/* Mobile timeline */}
        <ol className="relative mt-12 space-y-0 lg:hidden">
          <div
            className="pointer-events-none absolute top-4 bottom-4 right-[1.35rem] w-px bg-linear-to-b from-gold-500 via-gold-300/60 to-navy-200"
            aria-hidden="true"
          />
          {PROCESS_STEPS.map((step, index) => {
            const Icon = step.icon
            return (
              <Reveal key={step.id} delay={index * 0.05}>
                <li className="relative flex gap-4 pb-6 last:pb-0">
                  <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-xl bg-navy-900 text-gold-300 shadow-soft ring-4 ring-navy-50">
                    <Icon className="size-5" strokeWidth={1.55} />
                  </span>
                  <div className="min-w-0 flex-1 rounded-2xl border border-navy-200/90 bg-white/95 p-4 shadow-soft">
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

        {/* Desktop grid */}
        <ol className="relative mt-16 hidden gap-6 lg:grid lg:grid-cols-3">
          <div
            className="pointer-events-none absolute top-[4.5rem] right-[8%] left-[8%] h-px bg-linear-to-l from-transparent via-gold-400/55 to-transparent"
            aria-hidden="true"
          />

          {PROCESS_STEPS.map((step, index) => {
            const Icon = step.icon

            return (
              <Reveal key={step.id} delay={index * 0.06}>
                <li className="group relative h-full list-none">
                  <article
                    className={cn(
                      'relative flex h-full flex-col gap-5 overflow-hidden rounded-[1.35rem] border border-navy-200/90 bg-white/90 p-7 shadow-soft transition-all duration-300',
                      'hover:-translate-y-1 hover:border-gold-400/70 hover:shadow-lift'
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid size-12 place-items-center rounded-2xl bg-navy-900 text-gold-300 transition-colors group-hover:bg-gold-500 group-hover:text-navy-900">
                        <Icon className="size-5" strokeWidth={1.55} />
                      </span>
                      <span className="font-display text-4xl leading-none font-extrabold text-navy-100 transition-colors group-hover:text-gold-400">
                        {toPersianDigits(String(step.step).padStart(2, '0'))}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-xl font-bold tracking-tight text-navy-900">
                        {step.title}
                      </h3>
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
