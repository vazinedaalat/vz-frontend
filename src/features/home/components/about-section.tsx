import { CircleCheck } from 'lucide-react'
import { Container } from '@/components/shared/container'
import { Reveal } from '@/components/animated/reveal'
import { toPersianDigits } from '@/lib/format'
import { BRAND, SECTION_IDS } from '../constants'
import { SectionHeading } from './section-heading'

const HIGHLIGHTS = [
  'خدمات کاملاً آنلاین؛ بدون نیاز به حضور در دفتر',
  'پاسخ سریع و تنظیم دقیق اسناد و لوایح',
  'گزارش‌دهی شفاف در تمام مراحل پرونده',
  'وکیل متخصص همان موضوع، از راه دور در کنار شما',
] as const

export function AboutSection() {
  return (
    <section id={SECTION_IDS.about} className="relative py-16 sm:py-20 lg:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-l from-transparent via-navy-200 to-transparent"
        aria-hidden="true"
      />
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
          <Reveal from="right">
            <SectionHeading
              align="start"
              eyebrow="درباره پلتفرم"
              title={
                <>
                  حرفه‌ای بودن حضوری؛
                  <br />
                  سرعت و دقت، آنلاین
                </>
              }
              description="شعار ما ساده است: لذت خدمات قضایی سریع و دقیق — آنلاین و بدون حضور. همان اعتبار وکالت پایه یک، بدون صف دفتر و بدون اتلاف وقت."
            />

            <ul className="mt-9 grid gap-3 sm:mt-10 sm:gap-3.5">
              {HIGHLIGHTS.map((item) => (
                <li
                  key={item}
                  className="group flex items-start gap-3.5 rounded-2xl border border-navy-100/90 bg-white/80 px-4 py-3.5 shadow-soft transition-colors duration-200 hover:border-gold-300/70 sm:px-5"
                >
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-gold-100 text-gold-700 transition-colors group-hover:bg-navy-900 group-hover:text-gold-300">
                    <CircleCheck className="size-4" strokeWidth={1.8} />
                  </span>
                  <span className="text-sm leading-7 text-navy-800 lg:text-[0.95rem]">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal from="left" delay={0.1}>
            <div className="relative overflow-hidden rounded-[1.75rem] border border-navy-800 bg-navy-900 p-8 text-white shadow-lift sm:rounded-[2rem] sm:p-10 lg:p-12">
              <div className="pointer-events-none absolute -top-20 -left-12 size-56 rounded-full bg-gold-500/15 blur-3xl" />
              <div className="pointer-events-none absolute -right-8 -bottom-16 size-48 rounded-full bg-navy-500/40 blur-3xl" />
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-l from-transparent via-gold-400/40 to-transparent" />

              <p className="font-display relative text-xs font-semibold tracking-[0.16em] text-gold-300 uppercase">
                بیانیه {BRAND.name}
              </p>
              <blockquote className="font-display relative mt-7 text-[1.35rem] leading-[1.55] font-bold text-balance text-white sm:mt-8 sm:text-2xl lg:text-[1.9rem] lg:leading-[1.45]">
                «عدالت را حرفه‌ای پیگیری کنید؛ این‌بار سریع، دقیق و بدون حضور.»
              </blockquote>
              <p className="relative mt-8 border-t border-white/10 pt-6 text-sm leading-7 text-white/75">
                فعالیت مستمر از سال {toPersianDigits(BRAND.establishedYear)}؛ امروز همان تخصص، به‌صورت
                آنلاین و بدون حضور.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
