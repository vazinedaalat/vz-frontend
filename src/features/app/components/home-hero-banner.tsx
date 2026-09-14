import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { formatFaNumber } from '@/lib/format'
import { HOME_BANNER_INTERVAL_MS } from '../constants/home-banner'
import { cycleIndex } from '../lib/home-banner'
import type { HomeHeroBannerSlide } from '../types'

interface HomeHeroBannerProps {
  slides: readonly HomeHeroBannerSlide[]
}

const EASE = [0.22, 1, 0.36, 1] as const

export function HomeHeroBanner({ slides }: HomeHeroBannerProps) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = slides.length
  const slide = slides[index]

  useEffect(() => {
    slides.forEach((item) => {
      const img = new Image()
      img.src = item.imageSrc
    })
  }, [slides])

  useEffect(() => {
    if (count <= 1 || paused || reduceMotion) return
    const timer = window.setInterval(() => {
      setIndex((current) => cycleIndex(current, 1, count))
    }, HOME_BANNER_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [count, paused, reduceMotion, index])

  if (!slide || count === 0) return null

  const go = (delta: number) => {
    setIndex((current) => cycleIndex(current, delta, count))
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="بنرهای ویژه وزین عدالت"
      className="relative overflow-hidden rounded-[1.75rem] border border-navy-800 bg-navy-900 shadow-lift"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false)
        }
      }}
    >
      <div
        className="pointer-events-none absolute -inset-s-24 top-1/2 size-72 -translate-y-1/2 rounded-full bg-gold-500/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-e-0 top-0 size-64 rounded-full bg-gold-400/10 blur-3xl"
        aria-hidden
      />

      <div className="relative grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="relative z-10 flex min-h-64 flex-col justify-center px-5 py-8 sm:min-h-72 sm:px-8 sm:py-10 lg:min-h-80 lg:px-10 lg:py-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slide.id}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -14 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="flex flex-col"
              aria-live="polite"
            >
              <p className="font-display text-xs font-semibold tracking-wide text-gold-400 sm:text-sm">
                {slide.eyebrow}
              </p>
              <h2 className="font-display mt-3 max-w-xl text-2xl leading-[1.35] font-extrabold text-balance text-white sm:text-3xl lg:text-[2.05rem]">
                {slide.title}
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-8 text-white/75 sm:text-base sm:leading-8">
                {slide.description}
              </p>
              <div className="mt-7">
                <Button variant="accent" size="lg" className="w-full sm:w-auto" asChild>
                  <Link to={slide.ctaTo}>{slide.ctaLabel}</Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          {count > 1 ? (
            <div className="mt-8 flex items-center gap-3 sm:mt-10">
              <div className="flex min-w-0 flex-1 items-center gap-1.5" role="tablist" aria-label="انتخاب بنر">
                {slides.map((item, i) => {
                  const active = i === index
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-label={`بنر ${formatFaNumber(i + 1)} از ${formatFaNumber(count)}: ${item.eyebrow}`}
                      onClick={() => setIndex(i)}
                      className="relative h-8 min-w-0 flex-1 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
                    >
                      <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/20">
                        {active && !paused && !reduceMotion ? (
                          <motion.span
                            key={`${item.id}-progress`}
                            className="block h-full w-full rounded-full bg-gold-400"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                              duration: HOME_BANNER_INTERVAL_MS / 1000,
                              ease: 'linear',
                            }}
                            style={{ transformOrigin: 'right center' }}
                          />
                        ) : (
                          <span
                            className={cn(
                              'block h-full rounded-full bg-gold-400 transition-[width] duration-300',
                              active ? 'w-full' : 'w-0'
                            )}
                          />
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>

              <p className="shrink-0 font-display text-xs tabular-nums text-white/50">
                {formatFaNumber(index + 1)}
                <span className="mx-1 text-white/30">/</span>
                {formatFaNumber(count)}
              </p>

              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  aria-label="بنر قبلی"
                  onClick={() => go(-1)}
                  className="grid size-10 place-items-center rounded-xl border border-white/15 text-white/80 transition-colors hover:border-gold-400/50 hover:bg-white/5 hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
                >
                  <ChevronRight className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="بنر بعدی"
                  onClick={() => go(1)}
                  className="grid size-10 place-items-center rounded-xl border border-white/15 text-white/80 transition-colors hover:border-gold-400/50 hover:bg-white/5 hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
                >
                  <ChevronLeft className="size-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative min-h-48 overflow-hidden sm:min-h-56 lg:min-h-full">
          <div
            className="pointer-events-none absolute inset-y-0 inset-s-0 z-10 w-24 bg-linear-to-e from-navy-900 to-transparent lg:w-36"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-linear-to-b from-navy-900 to-transparent lg:hidden"
            aria-hidden
          />

          <AnimatePresence mode="sync" initial={false}>
            <motion.img
              key={slide.id}
              src={slide.imageSrc}
              alt={slide.imageAlt}
              width={1280}
              height={720}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[center_35%] lg:min-h-70"
              initial={reduceMotion ? false : { opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.7, ease: EASE }}
            />
          </AnimatePresence>

          <div
            className="pointer-events-none absolute inset-0 z-1 bg-linear-to-tr from-navy-950/40 via-transparent to-gold-500/10"
            aria-hidden
          />
        </div>
      </div>
    </section>
  )
}
