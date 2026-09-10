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
    <section id={SECTION_IDS.about} className="py-20 lg:py-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
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

            <ul className="mt-10 grid gap-4">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-7 text-navy-800 lg:text-base">
                  <CircleCheck className="mt-0.5 size-5 shrink-0 text-gold-600" strokeWidth={1.7} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal from="left" delay={0.1}>
            <div className="relative overflow-hidden rounded-[2rem] border border-navy-800 bg-navy-900 p-8 text-white shadow-lift lg:p-12">
              <div className="bg-gold-500/20 absolute -top-16 -left-10 size-48 rounded-full blur-3xl" />
              <p className="font-display text-sm font-semibold text-gold-300">بیانیه {BRAND.name}</p>
              <blockquote className="font-display mt-6 text-2xl leading-relaxed font-bold text-balance text-white lg:text-[1.85rem]">
                «عدالت را حرفه‌ای پیگیری کنید؛ این‌بار سریع، دقیق و بدون حضور.»
              </blockquote>
              <p className="mt-8 text-sm leading-7 text-white/80">
                فعالیت مستمر از سال {toPersianDigits(BRAND.establishedYear)}؛ امروز همان تخصص، به‌صورت آنلاین و بدون حضور.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
