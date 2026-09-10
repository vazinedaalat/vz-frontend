import { motion, useReducedMotion } from 'framer-motion'
import { Scale, Wifi, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface FloatingBadgeProps {
  eyebrow: string
  title: string
  icon: LucideIcon
  className: string
  phase?: number
}

function FloatingBadge({ eyebrow, title, icon: Icon, className, phase = 0 }: FloatingBadgeProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return (
      <div
        className={`absolute rounded-2xl border border-navy-200 bg-white/95 px-4 py-3 shadow-soft backdrop-blur ${className}`}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-gold-100 text-gold-700">
            <Icon className="size-4" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-[0.7rem] font-semibold text-gold-700">{eyebrow}</p>
            <p className="font-display text-sm font-bold text-navy-900">{title}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className={`absolute rounded-2xl border border-navy-200/90 bg-white/95 px-4 py-3 shadow-lift backdrop-blur-md ${className}`}
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: [0, -10, 3, -7, 0],
        x: phase === 0 ? [0, 6, -3, 5, 0] : [0, -6, 4, -4, 0],
        rotate: phase === 0 ? [0, 1.6, -0.8, 1, 0] : [0, -1.5, 1, -0.8, 0],
      }}
      transition={{
        opacity: { duration: 0.65, delay: 0.45 + phase * 0.2, ease: [0.22, 1, 0.36, 1] },
        y: { duration: 8, repeat: Infinity, ease: 'easeInOut', delay: phase * 0.8 },
        x: { duration: 9.5, repeat: Infinity, ease: 'easeInOut', delay: phase * 0.8 },
        rotate: { duration: 9, repeat: Infinity, ease: 'easeInOut', delay: phase * 0.8 },
      }}
    >
      <div className="relative flex items-start gap-3">
        <span className="relative mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-navy-900 text-gold-300">
          <Icon className="size-4" strokeWidth={1.8} />
          <motion.span
            className="absolute -top-0.5 -left-0.5 size-2.5 rounded-full bg-gold-400 ring-2 ring-white"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.55, 1] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut', delay: phase * 0.35 }}
          />
        </span>
        <div>
          <p className="text-[0.7rem] font-semibold text-gold-700">{eyebrow}</p>
          <p className="font-display text-sm font-bold text-navy-900">{title}</p>
        </div>
      </div>
    </motion.div>
  )
}

/** Right-side hero mark: rotating rings, glowing scales, floating service badges. */
export function HeroVisual() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg lg:max-w-none" aria-hidden="true">
      <motion.div
        className="absolute inset-6 rounded-full border border-navy-200/70"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-14 rounded-full border border-dashed border-gold-400/55"
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-22 rounded-full border border-navy-100"
        animate={reduceMotion ? undefined : { scale: [1, 1.04, 1], opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 grid size-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[2rem] bg-navy-900 text-gold-400"
        animate={
          reduceMotion
            ? undefined
            : {
                boxShadow: [
                  '0 20px 44px -18px rgb(11 28 44 / 0.4)',
                  '0 24px 56px -14px rgb(201 168 108 / 0.5)',
                  '0 20px 44px -18px rgb(11 28 44 / 0.4)',
                ],
              }
        }
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          animate={reduceMotion ? undefined : { rotate: [0, -5, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Scale className="size-16" strokeWidth={1.15} />
        </motion.div>
      </motion.div>

      <FloatingBadge
        className="top-10 right-2 z-10 sm:right-4"
        eyebrow="بدون حضور در دفتر"
        title="خدمات کاملاً آنلاین"
        icon={Wifi}
        phase={0}
      />
      <FloatingBadge
        className="bottom-14 left-0 z-10 sm:bottom-16"
        eyebrow="سریع و دقیق"
        title="پیگیری لحظه‌ای پرونده"
        icon={Zap}
        phase={1}
      />
    </div>
  )
}
