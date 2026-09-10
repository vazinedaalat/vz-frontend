import { Container } from '@/components/shared/container'
import { Reveal } from '@/components/animated/reveal'
import { PRACTICE_AREAS, SECTION_IDS } from '../constants'
import type { ServiceId } from '../types'
import { SectionHeading } from './section-heading'
import { ServiceCard } from './service-card'

interface PracticeAreasProps {
  activeServiceId: ServiceId | null
}

export function PracticeAreas({ activeServiceId }: PracticeAreasProps) {
  return (
    <section id={SECTION_IDS.services} className="bg-white py-20 lg:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="خدمات آنلاین"
            title="هر خدمت حقوقی، بدون حضور و با دقت حرفه‌ای"
            description="مشاوره، لایحه، دادخواست، قرارداد و پیگیری پرونده را سریع و کاملاً آنلاین دریافت کنید — با وکیل متخصص همان موضوع."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4 lg:mt-16 lg:gap-6">
          {PRACTICE_AREAS.map((area, index) => (
            <Reveal key={area.id} delay={index * 0.05}>
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
