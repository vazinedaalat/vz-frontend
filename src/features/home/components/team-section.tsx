import { Container } from '@/components/shared/container'
import { Reveal } from '@/components/animated/reveal'
import { toPersianDigits } from '@/lib/format'
import { SECTION_IDS, TEAM } from '../constants'
import { SectionHeading } from './section-heading'

export function TeamSection() {
  return (
    <section id={SECTION_IDS.team} className="bg-white py-20 lg:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="تیم وکلا"
            title="وکیل متخصص، کنار شما — حتی از راه دور"
            description="پرونده آنلاین به وکیلی می‌رسد که تمرکز حرفه‌ای‌اش دقیقاً با موضوع دعوا منطبق است."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
          {TEAM.map((member, index) => (
            <Reveal key={member.id} delay={index * 0.06}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-navy-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div className="relative flex aspect-[4/5] items-end bg-linear-to-b from-navy-100 via-navy-200 to-navy-800 p-6">
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 30% 20%, rgb(201 168 108 / 0.45), transparent 42%)',
                    }}
                  />
                  <span className="font-display pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 text-6xl font-extrabold text-navy-700/30 select-none">
                    {member.initials}
                  </span>
                  <div className="relative">
                    <p className="font-display text-lg font-bold text-white">{member.name}</p>
                    <p className="mt-1 text-sm text-gold-300">{member.role}</p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1 bg-white p-6">
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
