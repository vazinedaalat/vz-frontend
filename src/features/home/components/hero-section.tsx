import { Link } from 'react-router-dom'
import { LogIn, Phone, Scale } from 'lucide-react'
import { Button } from '@/components/ui'
import { Container } from '@/components/shared/container'
import { Reveal } from '@/components/animated/reveal'
import { BRAND, CONTACT_INFO, CTA, HERO_PROMISES, LOGIN_PATH, SECTION_IDS } from '../constants'
import { HeroBackdrop } from './hero-backdrop'
import { HeroVisual } from './hero-visual'

/**
 * Landing first composition: brand-forward hero.
 * Mobile gets the full composition (brand mark + copy + CTAs); desktop adds a quieter side visual.
 * Service quick-select lives in the services section — keeps the first viewport uncluttered.
 */
export function HeroSection() {
  return (
    <section
      id={SECTION_IDS.home}
      className="relative overflow-hidden pt-8 pb-12 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-20"
    >
      <HeroBackdrop />

      <Container className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="flex flex-col items-start">
            {/* Mobile brand emblem — hero-level signal when the side visual is hidden */}
            <Reveal className="mb-7 w-full md:hidden">
              <div className="flex items-center gap-4">
                <span className="grid size-14 place-items-center rounded-2xl bg-navy-900 text-gold-400 shadow-soft">
                  <Scale className="size-7" strokeWidth={1.35} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display text-xl font-extrabold text-navy-900">
                    {BRAND.nameLead}{' '}
                    <span className="text-gold-600">{BRAND.nameTrail}</span>
                  </p>
                  <p className="mt-0.5 text-sm text-navy-600">{BRAND.tagline}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.04}>
              <p className="text-sm font-semibold tracking-wide text-gold-700">
                مؤسسه حقوقی آنلاین
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="font-display mt-4 text-[1.85rem] leading-[1.35] font-extrabold text-balance text-navy-900 sm:mt-5 sm:text-4xl sm:leading-[1.25] lg:text-[3.1rem] lg:leading-[1.2]">
                {BRAND.slogan}
              </h1>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-5 max-w-xl text-[0.95rem] leading-8 text-navy-600 sm:mt-6 sm:text-base lg:text-lg">
                {BRAND.sloganSupport}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:gap-3">
                <Button variant="accent" size="xl" className="w-full sm:w-auto" asChild>
                  <Link to={LOGIN_PATH}>
                    <LogIn />
                    {CTA.login}
                  </Link>
                </Button>
                <Button variant="outline" size="xl" className="w-full sm:w-auto" asChild>
                  <a href={CONTACT_INFO.phoneHref}>
                    <Phone />
                    {CTA.contact}
                  </a>
                </Button>
              </div>

              {/* Quiet trust line — not a pill cluster */}
              <p className="mt-5 text-sm leading-7 text-navy-600">
                {HERO_PROMISES.join(' · ')}
              </p>
            </Reveal>
          </div>

          <Reveal from="left" delay={0.1} className="hidden md:block">
            <HeroVisual />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
