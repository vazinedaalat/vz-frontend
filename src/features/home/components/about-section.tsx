import { CircleCheck } from 'lucide-react'
import { Container } from '@/components/shared/container'
import { Reveal } from '@/components/animated/reveal'
import { toPersianDigits } from '@/lib/format'
import { BRAND, SECTION_IDS } from '../constants'
import { SectionHeading } from './section-heading'

const HIGHLIGHTS = [
  'تیم وکلای پایه یک دادگستری با تخصص موضوعی',
  'گزارش‌دهی منظم و شفاف در تمام مراحل پرونده',
  'ارزیابی واقع‌بینانه پیش از پذیرش هر دعوا',
  'تنظیم اسناد و لوایح مستند به قانون و رویه قضایی',
] as const

export function AboutSection() {
  return (
    <section id={SECTION_IDS.about} className="py-20 lg:py-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
          <Reveal from="right">
            <SectionHeading
              align="start"
              eyebrow="درباره مؤسسه"
              title={
                <>
                  اعتماد، تخصص و نتیجه؛
                  <br />
                  سه اصل {BRAND.name}
                </>
              }
              description="ما پرونده را پروژه نمی‌دانیم؛ مسئولیت حرفه‌ای می‌دانیم. از نخستین جلسه مشاوره، مسیر حقوقی با زبانی روشن تبیین می‌شود تا موکل بداند در کجا ایستاده و به کجا می‌رود."
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
              <p className="font-display text-gold-400 text-sm font-semibold">بیانیه مؤسسه</p>
              <blockquote className="font-display mt-6 text-2xl leading-relaxed font-bold text-balance text-white lg:text-[1.85rem]">
                «هر پرونده شایسته وکیلی است که موضوع را بشناسد، ریسک را صادقانه بگوید و تا نتیجه کنار موکل بماند.»
              </blockquote>
              <p className="text-navy-200 mt-8 text-sm leading-7">
                فعالیت مستمر از سال {toPersianDigits(BRAND.establishedYear)} در مراجع قضایی تهران و شهرستان‌ها؛
                با تمرکز بر دعاوی حقوقی، ملکی، تجاری و خدمات تنظیم اسناد.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
