import { ArrowUpLeft, Phone } from 'lucide-react'
import { Button } from '@/components/ui'
import { Container } from '@/components/shared/container'
import { Reveal } from '@/components/animated/reveal'
import { scrollToSection } from '@/utils/scroll'
import { CONTACT_INFO, SECTION_IDS } from '../constants'
import { HeroVisual } from './hero-visual'
import { ServiceSelector } from './service-selector'
import type { ServiceId } from '../types'

interface HeroSectionProps {
  activeServiceId: ServiceId | null
  onSelectService: (id: ServiceId) => void
}

export function HeroSection({ activeServiceId, onSelectService }: HeroSectionProps) {
  return (
    <section id={SECTION_IDS.home} className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="from-background pointer-events-none absolute inset-0 bg-linear-to-b to-transparent" />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
          <div className="flex flex-col items-start">
            <Reveal>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gold-100/80 px-4 py-1.5 text-sm font-medium text-gold-700">
                مؤسسه خدمات حقوقی و قضایی
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="font-display text-navy-900 text-4xl leading-[1.2] font-extrabold text-balance sm:text-5xl lg:text-[3.5rem] lg:leading-[1.18]">
                عدالت را{' '}
                <span className="text-gold-600">حرفه‌ای</span>
                <br />
                پیگیری کنید
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-7 max-w-xl text-base leading-8 text-navy-500 lg:text-lg">
                وزین عدالت با تیمی از وکلای پایه یک دادگستری، مسیر پرونده را از نخستین مشاوره تا صدور حکم
                شفاف، مستند و نتیجه‌محور پیش می‌برد.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button
                  variant="accent"
                  size="xl"
                  className="w-full sm:w-auto"
                  onClick={() => scrollToSection(SECTION_IDS.contact)}
                >
                  درخواست مشاوره
                  <ArrowUpLeft />
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  className="w-full sm:w-auto"
                  asChild
                >
                  <a href={CONTACT_INFO.phoneHref}>
                    <Phone />
                    تماس مستقیم
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal from="left" delay={0.12} className="hidden md:block">
            <HeroVisual />
          </Reveal>
        </div>

        <Reveal delay={0.2} className="mt-14 lg:mt-20">
          <p className="mb-4 text-sm font-medium text-navy-500">انتخاب سریع خدمت</p>
          <ServiceSelector activeId={activeServiceId} onSelect={onSelectService} />
        </Reveal>
      </Container>
    </section>
  )
}
