import { useState } from 'react'
import { SiteHeader } from '../components/site-header'
import { HeroSection } from '../components/hero-section'
import { AboutSection } from '../components/about-section'
import { PracticeAreas } from '../components/practice-areas'
import { ProcessSection } from '../components/process-section'
import { WhyUsSection } from '../components/why-us-section'
import { TeamSection } from '../components/team-section'
import { CtaSection } from '../components/cta-section'
import { SiteFooter } from '../components/site-footer'
import { scrollToSection } from '@/utils/scroll'
import type { ServiceId } from '../types'

export default function HomePage() {
  const [activeServiceId, setActiveServiceId] = useState<ServiceId | null>(null)

  const handleSelectService = (id: ServiceId) => {
    setActiveServiceId(id)
    requestAnimationFrame(() => {
      scrollToSection(`service-${id}`)
    })
  }

  return (
    <div className="min-h-screen bg-navy-50 text-navy-900">
      <SiteHeader />
      <main>
        <HeroSection activeServiceId={activeServiceId} onSelectService={handleSelectService} />
        <AboutSection />
        <PracticeAreas activeServiceId={activeServiceId} />
        <ProcessSection />
        <WhyUsSection />
        <TeamSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  )
}
