import { useState } from 'react'
import { Container } from '@/components/shared/container'
import { Reveal } from '@/components/animated/reveal'
import { scrollToSection } from '@/utils/scroll'
import { PRACTICE_AREAS, SECTION_IDS } from '../constants'
import type { ServiceId } from '../types'
import { SectionHeading } from './section-heading'
import { ServiceCard } from './service-card'
import { ServiceSelector } from './service-selector'

export function PracticeAreas() {
  const [activeServiceId, setActiveServiceId] = useState<ServiceId | null>(null)

  const handleSelect = (id: ServiceId) => {
    setActiveServiceId(id)
    requestAnimationFrame(() => {
      scrollToSection(`service-${id}`)
    })
  }

  return (
    <section id={SECTION_IDS.services} className="bg-white py-14 sm:py-16 lg:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="خدمات آنلاین"
            title="هر خدمت حقوقی، بدون حضور و با دقت حرفه‌ای"
            description="مشاوره، لایحه، دادخواست، قرارداد و پیگیری پرونده را سریع و کاملاً آنلاین دریافت کنید — با وکیل متخصص همان موضوع."
          />
        </Reveal>

        <Reveal delay={0.08} className="mt-8 sm:mt-10">
          <p className="mb-3 text-sm font-medium text-navy-600 sm:mb-4">
            خدمت مورد نیاز را انتخاب کنید
          </p>
          <ServiceSelector activeId={activeServiceId} onSelect={handleSelect} />
        </Reveal>

        <div className="mt-8 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4 lg:gap-6">
          {PRACTICE_AREAS.map((area, index) => (
            <Reveal key={area.id} delay={index * 0.04}>
              <ServiceCard
                id={area.id}
                title={area.title}
                description={area.description}
                icon={area.icon}
                highlighted={activeServiceId === area.id}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
