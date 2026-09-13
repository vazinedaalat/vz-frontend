import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui'
import { Container } from '@/components/shared/container'
import { Reveal } from '@/components/animated/reveal'
import { toPersianDigits } from '@/lib/format'
import { cn } from '@/lib/utils'
import { CTA, LOGIN_PATH, PROCESS_STEPS, SECTION_IDS } from '../constants'
import { SectionHeading } from './section-heading'

/** Visual journey: six clear steps from signup to case notifications. */
export function ProcessSection() {
  return (
    <section id={SECTION_IDS.process} className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 12% 20%, rgb(201 168 108 / 0.18), transparent 36%), radial-gradient(circle at 88% 70%, rgb(11 28 44 / 0.06), transparent 40%)',
        }}
      />

      <Container className="relative">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <Reveal from="right">
            <SectionHeading
              align="start"
              eyebrow="مراحل کار"
              title={
                <>
                  از ثبت‌نام تا اطلاع‌رسانی؛
                  <br />
                  مسیر کاملاً شفاف
                </>
              }
              description="شش گام ساده تا مدیریت پرونده بدون حضور در دفتر. هر مرحله کوتاه، قابل فهم و کاملاً آنلاین است."
            />
            <Button variant="accent" size="lg" className="mt-8" asChild>
              <Link to={LOGIN_PATH}>
                {CTA.login}
                <ArrowLeft />
              </Link>
            </Button>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-sm leading-7 text-navy-600 lg:max-w-md lg:text-start lg:ms-auto">
              نیازی به مراجعه حضوری نیست؛ بعد از ثبت‌نام، مشاوره، تشکیل پرونده و پیگیری را از داخل اپ انجام می‌دهید.
            </p>
          </Reveal>
        </div>

        <ol className="relative mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {/* Continuous connector on large screens */}
          <div
            className="pointer-events-none absolute top-[4.25rem] right-[8%] left-[8%] hidden h-px bg-linear-to-l from-transparent via-gold-400/50 to-transparent lg:block"
            aria-hidden="true"
          />

          {PROCESS_STEPS.map((step, index) => {
            const Icon = step.icon

            return (
              <Reveal key={step.id} delay={index * 0.07}>
                <li className="group relative h-full list-none">
                  <article
                    className={cn(
                      'relative flex h-full flex-col gap-5 overflow-hidden rounded-[1.5rem] border border-navy-200 bg-navy-50/60 p-6 transition-all duration-300 lg:p-7',
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
