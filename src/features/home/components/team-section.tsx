import { Container } from '@/components/shared/container'
import { Reveal } from '@/components/animated/reveal'
import { toPersianDigits } from '@/lib/format'
import { SECTION_IDS, TEAM } from '../constants'
import { SectionHeading } from './section-heading'

export function TeamSection() {
  return (
    <section id={SECTION_IDS.team} className="relative bg-navy-50/50 py-16 sm:py-20 lg:bg-white lg:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-l from-transparent via-navy-200 to-transparent"
        aria-hidden="true"
      />
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="بنیانگذاران"
            title="وکیل متخصص، کنار شما — حتی از راه دور"
            description="پرونده آنلاین به وکیلی می‌رسد که تمرکز حرفه‌ای‌اش دقیقاً با موضوع دعوا منطبق است."
          />
        </Reveal>

        <div className="mt-11 grid gap-3.5 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {TEAM.map((member, index) => (
            <Reveal key={member.id} delay={index * 0.05}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-200/90 bg-white shadow-soft transition-all duration-300 sm:rounded-[1.35rem] sm:hover:-translate-y-1 hover:shadow-lift">
                <div className="relative flex aspect-[5/4] items-end bg-linear-to-b from-navy-100 via-navy-300 to-navy-900 p-5 sm:aspect-[4/5] sm:p-6">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-50"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 30% 20%, rgb(201 168 108 / 0.4), transparent 42%)',
                    }}
                  />
                  <span className="font-display pointer-events-none absolute top-5 left-1/2 -translate-x-1/2 text-5xl font-extrabold tracking-tight text-white/10 select-none sm:text-6xl">
                    {member.initials}
                  </span>
                  <div className="relative">
                    <p className="font-display text-lg font-bold text-white">{member.name}</p>
                    <p className="mt-1 text-sm text-gold-300">{member.role}</p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1 border-t border-navy-100 bg-white p-5 sm:p-6">
                  <p className="text-sm font-medium text-navy-900">{member.expertise}</p>
                  <p className="text-sm text-navy-600">
                    {toPersianDigits(member.experienceYears)} سال سابقه حرفه‌ای
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
