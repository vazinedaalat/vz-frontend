import { Link } from 'react-router-dom'
import { ArrowLeft, MessagesSquare } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui'
import { Reveal } from '@/components/animated/reveal'
import { HOME_HERO_BANNER } from '../constants/home-banner'

export function HomeHeroBanner() {
  const reduceMotion = useReducedMotion()
  const banner = HOME_HERO_BANNER

  return (
    <section
      aria-labelledby="home-hero-banner-title"
      className="relative overflow-hidden rounded-[1.75rem] border border-navy-800 bg-navy-900 shadow-lift"
    >
      {/* Atmospheric layers — decorative only */}
      <div
        className="pointer-events-none absolute -inset-s-24 top-1/2 size-72 -translate-y-1/2 rounded-full bg-gold-500/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-e-0 top-0 size-64 rounded-full bg-gold-400/10 blur-3xl"
        aria-hidden
      />

      <div className="relative grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="flex flex-col justify-center px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <Reveal>
            <p className="font-display text-xs font-semibold tracking-wide text-gold-400 sm:text-sm">
              {banner.eyebrow}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h2
              id="home-hero-banner-title"
              className="font-display mt-3 max-w-xl text-2xl leading-[1.35] font-extrabold text-balance text-white sm:text-3xl lg:text-[2.05rem]"
            >
              {banner.title}
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-4 max-w-lg text-sm leading-8 text-white/75 sm:text-base sm:leading-8">
              {banner.description}
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Button variant="accent" size="lg" className="w-full sm:w-auto" asChild>
                <Link to={banner.ctaTo}>
                  <MessagesSquare />
                  {banner.ctaLabel}
                </Link>
              </Button>
              <Button variant="outlineOnDark" size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/app/cases/new">
                  ایجاد پرونده
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>
            </div>
          </Reveal>

          <div
            className="mt-8 h-px w-16 bg-linear-to-l from-transparent via-gold-400 to-transparent sm:mt-10"
            aria-hidden
          />
        </div>

        <div className="relative min-h-48 overflow-hidden sm:min-h-56 lg:min-h-full">
          {/* Seam blend into navy panel (RTL: image is on the left / end) */}
          <div
            className="pointer-events-none absolute inset-y-0 inset-s-0 z-10 w-24 bg-linear-to-e from-navy-900 to-transparent lg:w-36"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-linear-to-b from-navy-900 to-transparent lg:hidden"
            aria-hidden
          />

          <motion.img
            src={banner.imageSrc}
            alt={banner.imageAlt}
            width={1280}
            height={720}
            decoding="async"
            className="h-full w-full object-cover object-[center_35%] lg:absolute lg:inset-0 lg:min-h-70"
            initial={reduceMotion ? false : { opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />

          {!reduceMotion ? (
            <motion.div
              className="pointer-events-none absolute inset-0 z-1 bg-linear-to-tr from-navy-950/35 via-transparent to-gold-500/10"
              aria-hidden
              animate={{ opacity: [0.55, 0.85, 0.55] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
          ) : (
            <div
              className="pointer-events-none absolute inset-0 z-1 bg-linear-to-tr from-navy-950/35 via-transparent to-gold-500/10"
              aria-hidden
            />
          )}
        </div>
      </div>
    </section>
  )
}
