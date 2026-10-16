import { Link } from 'react-router-dom'
import { LogIn, Phone, Scale } from 'lucide-react'
import { Button } from '@/components/ui'
import { Container } from '@/components/shared/container'
import { Reveal } from '@/components/animated/reveal'
import { BRAND, CONTACT_INFO, CTA, HERO_PROMISES, LOGIN_PATH, SECTION_IDS } from '../constants'
import { HeroBackdrop } from './hero-backdrop'
import { HeroVisual } from './hero-visual'

/**
 * Premium editorial hero — same copy, stronger hierarchy and atmosphere.
 * Mobile: brand emblem in composition. Desktop: calm side visual.
 */
export function HeroSection() {
  return (
    <section
      id={SECTION_IDS.home}
      className="relative overflow-hidden pt-9 pb-14 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24"
    >
      <HeroBackdrop />

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-20">
          <div className="flex flex-col items-start">
            <Reveal className="mb-8 w-full md:hidden">
              <div className="flex items-center gap-4 rounded-2xl border border-navy-200/80 bg-white/70 p-3.5 shadow-soft backdrop-blur-md">
                <span className="grid size-12 place-items-center rounded-xl bg-navy-900 text-gold-400 shadow-soft">
                  <Scale className="size-6" strokeWidth={1.35} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-lg font-extrabold tracking-tight text-navy-900">
                    {BRAND.nameLead}{' '}
                    <span className="text-gold-600">{BRAND.nameTrail}</span>
                  </p>
                  <p className="mt-0.5 truncate text-xs text-navy-600">{BRAND.tagline}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.04}>
              <p className="inline-flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.18em] text-gold-700 uppercase sm:text-xs">
                <span className="h-px w-8 bg-gold-500" aria-hidden="true" />
                مؤسسه حقوقی آنلاین
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="font-display mt-5 text-[clamp(1.85rem,5.2vw,3.35rem)] leading-[1.28] font-extrabold tracking-tight text-balance text-navy-900 sm:mt-6 sm:leading-[1.2]">
                {BRAND.slogan}
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-6 h-px w-16 bg-linear-to-l from-gold-500 to-transparent sm:mt-7" aria-hidden="true" />
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-6 max-w-xl text-[0.95rem] leading-8 text-navy-600 sm:mt-7 sm:text-base sm:leading-9 lg:text-lg">
                {BRAND.sloganSupport}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-9 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row">
                <Button
                  variant="accent"
                  size="xl"
                  className="w-full rounded-2xl sm:w-auto"
                  asChild
                >
                  <Link to={LOGIN_PATH}>
                    <LogIn />
                    {CTA.login}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  className="w-full rounded-2xl border-navy-300/80 bg-white/80 backdrop-blur-sm sm:w-auto"
                  asChild
                >
                  <a href={CONTACT_INFO.phoneHref}>
                    <Phone />
                    {CTA.contact}
                  </a>
                </Button>
              </div>

              <ul className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-navy-600">
                {HERO_PROMISES.map((item, index) => (
                  <li key={item} className="inline-flex items-center gap-3">
                    {index > 0 ? (
                      <span className="size-1 rounded-full bg-gold-500/80" aria-hidden="true" />
                    ) : null}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
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
