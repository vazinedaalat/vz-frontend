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
            eyebrow="حوزه‌های فعالیت"
            title="خدمات تخصصی حقوقی و قضایی"
            description="هر خدمت توسط وکیلی ارائه می‌شود که سابقه و تمرکز حرفه‌ای‌اش با موضوع پرونده هم‌خوان است."
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
