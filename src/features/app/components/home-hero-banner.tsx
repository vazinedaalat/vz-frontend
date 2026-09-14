import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
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
const SWIPE_THRESHOLD_PX = 44

export function HomeHeroBanner({ slides }: HomeHeroBannerProps) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
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
      className="relative overflow-hidden rounded-2xl border border-navy-800 bg-navy-900 shadow-lift sm:rounded-[1.75rem]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false)
        }
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null
        setPaused(true)
      }}
      onTouchEnd={(event) => {
        const startX = touchStartX.current
        touchStartX.current = null
        setPaused(false)
        if (startX == null || count <= 1) return
        const endX = event.changedTouches[0]?.clientX
        if (endX == null) return
        const deltaX = endX - startX
        if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return
        // RTL: swipe toward start (right) → previous; toward end (left) → next
        go(deltaX > 0 ? -1 : 1)
      }}
    >
      <div
        className="pointer-events-none absolute -inset-s-16 top-1/2 size-48 -translate-y-1/2 rounded-full bg-gold-500/15 blur-3xl sm:-inset-s-24 sm:size-72"
        aria-hidden
      />

      <div className="relative grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        {/* Media: first on mobile for a cinematic open */}
        <div className="relative order-1 aspect-[16/10] overflow-hidden sm:aspect-[16/9] lg:order-2 lg:aspect-auto lg:min-h-full">
          <div
            className="pointer-events-none absolute inset-y-0 inset-s-0 z-10 hidden w-36 bg-linear-to-e from-navy-900 to-transparent lg:block"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-linear-to-t from-navy-900 via-navy-900/70 to-transparent lg:hidden"
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
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover object-center select-none lg:min-h-70 lg:object-[center_35%]"
              initial={reduceMotion ? false : { opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.65, ease: EASE }}
            />
          </AnimatePresence>

          <div
            className="pointer-events-none absolute inset-0 z-1 bg-linear-to-tr from-navy-950/45 via-transparent to-gold-500/10"
            aria-hidden
          />

          {count > 1 ? (
            <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-2 px-3 pb-3 sm:px-4 lg:hidden">
              <BannerProgress
                slides={slides}
                index={index}
                paused={paused}
                reduceMotion={Boolean(reduceMotion)}
                onSelect={setIndex}
              />
              <p className="shrink-0 font-display text-[0.7rem] tabular-nums text-white/70">
                {formatFaNumber(index + 1)}
                <span className="mx-0.5 text-white/35">/</span>
                {formatFaNumber(count)}
              </p>
            </div>
          ) : null}
        </div>

        {/* Copy */}
        <div className="relative z-10 order-2 flex flex-col justify-center px-4 py-5 sm:px-8 sm:py-9 lg:order-1 lg:min-h-80 lg:px-10 lg:py-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slide.id}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex flex-col"
              aria-live="polite"
            >
              <p className="font-display text-[0.7rem] font-semibold tracking-wide text-gold-400 sm:text-sm">
                {slide.eyebrow}
              </p>
              <h2 className="font-display mt-2 max-w-xl text-[1.35rem] leading-[1.4] font-extrabold text-balance text-white sm:mt-3 sm:text-3xl sm:leading-[1.35] lg:text-[2.05rem]">
                {slide.title}
              </h2>
              <p className="mt-2.5 line-clamp-3 max-w-lg text-[0.8125rem] leading-7 text-white/75 sm:mt-4 sm:line-clamp-none sm:text-base sm:leading-8">
                {slide.description}
              </p>
              <div className="mt-5 sm:mt-7">
                <Button variant="accent" size="lg" className="h-12 w-full sm:h-12 sm:w-auto" asChild>
                  <Link to={slide.ctaTo}>{slide.ctaLabel}</Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          {count > 1 ? (
            <div className="mt-5 hidden items-center gap-3 sm:mt-8 lg:flex">
              <BannerProgress
                slides={slides}
                index={index}
                paused={paused}
                reduceMotion={Boolean(reduceMotion)}
                onSelect={setIndex}
              />
              <p className="shrink-0 font-display text-xs tabular-nums text-white/50">
                {formatFaNumber(index + 1)}
                <span className="mx-1 text-white/30">/</span>
                {formatFaNumber(count)}
              </p>
              <div className="flex shrink-0 gap-1.5">
                <NavButton label="بنر قبلی" onClick={() => go(-1)}>
                  <ChevronRight className="size-4" />
                </NavButton>
                <NavButton label="بنر بعدی" onClick={() => go(1)}>
                  <ChevronLeft className="size-4" />
                </NavButton>
              </div>
            </div>
          ) : null}

          {/* Compact mobile arrows under CTA */}
          {count > 1 ? (
            <div className="mt-4 flex items-center justify-between gap-3 lg:hidden">
              <p className="text-[0.7rem] text-white/45">برای تعویض، بکشید</p>
              <div className="flex gap-1.5">
                <NavButton label="بنر قبلی" onClick={() => go(-1)} compact>
                  <ChevronRight className="size-4" />
                </NavButton>
                <NavButton label="بنر بعدی" onClick={() => go(1)} compact>
                  <ChevronLeft className="size-4" />
                </NavButton>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function BannerProgress({
  slides,
  index,
  paused,
  reduceMotion,
  onSelect,
}: {
  slides: readonly HomeHeroBannerSlide[]
  index: number
  paused: boolean
  reduceMotion: boolean
  onSelect: (index: number) => void
}) {
  const count = slides.length

  return (
    <div className="flex min-w-0 flex-1 items-center gap-1" role="tablist" aria-label="انتخاب بنر">
      {slides.map((item, i) => {
        const active = i === index
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={`بنر ${formatFaNumber(i + 1)} از ${formatFaNumber(count)}: ${item.eyebrow}`}
            onClick={() => onSelect(i)}
            className="relative h-9 min-w-0 flex-1 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 sm:h-8"
          >
            <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/25">
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
                    active ? 'w-full' : 'w-0',
                  )}
                />
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function NavButton({
  label,
  onClick,
  children,
  compact = false,
}: {
  label: string
  onClick: () => void
  children: ReactNode
  compact?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'grid place-items-center rounded-xl border border-white/15 text-white/80 transition-colors',
        'hover:border-gold-400/50 hover:bg-white/5 hover:text-gold-300',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400',
        compact ? 'size-11' : 'size-10',
      )}
    >
      {children}
    </button>
  )
}
