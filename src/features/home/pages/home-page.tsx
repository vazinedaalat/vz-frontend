import { useMemo } from 'react'
import { DocumentHead } from '@/components/shared/document-head'
import { BlogSection } from '@/features/blog'
import {
  absoluteUrl,
  breadcrumbJsonLd,
  organizationJsonLd,
  SITE_SEO,
  websiteJsonLd,
} from '@/lib/seo'
import { SiteHeader } from '../components/site-header'
import { HeroSection } from '../components/hero-section'
import { AboutSection } from '../components/about-section'
import { PracticeAreas } from '../components/practice-areas'
import { ProcessSection } from '../components/process-section'
import { WhyUsSection } from '../components/why-us-section'
import { TeamSection } from '../components/team-section'
import { CtaSection } from '../components/cta-section'
import { SiteFooter } from '../components/site-footer'

export default function HomePage() {
  const seo = useMemo(
    () => ({
      title: SITE_SEO.defaultTitle,
      description: SITE_SEO.defaultDescription,
      canonicalPath: '/',
      type: 'website' as const,
      jsonLd: [
        organizationJsonLd(),
        websiteJsonLd(),
        breadcrumbJsonLd([{ name: 'خانه', path: '/' }]),
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${absoluteUrl('/')}#webpage`,
          name: SITE_SEO.defaultTitle,
          description: SITE_SEO.defaultDescription,
          url: absoluteUrl('/'),
          inLanguage: SITE_SEO.language,
          isPartOf: { '@id': `${absoluteUrl('/')}#website` },
          about: { '@id': `${absoluteUrl('/')}#organization` },
        },
      ],
    }),
    []
  )

  return (
    <div className="min-h-dvh bg-navy-50 text-navy-900 antialiased">
      <DocumentHead {...seo} />
      <SiteHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <PracticeAreas />
        <ProcessSection />
        <WhyUsSection />
        <TeamSection />
        <BlogSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  )
}
