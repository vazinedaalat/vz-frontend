import { motion, useReducedMotion } from 'framer-motion'

/**
 * Calm editorial atmosphere — soft aurora + vignette.
 * Particles only on md+ to keep mobile crisp.
 */
export function HeroBackdrop() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-navy-50" />
      <div className="absolute inset-0 bg-linear-to-b from-white via-navy-50/80 to-navy-50" />
      <div className="absolute inset-0 bg-linear-to-l from-gold-100/40 via-transparent to-navy-100/30" />
      <div className="bg-dot-grid absolute inset-0 opacity-[0.28]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgb(201_168_108_/0.14),transparent_42%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(242_245_248)_95%)]" />

      <motion.div
        className="absolute -top-28 -right-20 size-[30rem] rounded-full bg-gold-300/25 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 28, -12, 0],
                y: [0, 22, 8, 0],
                scale: [1, 1.08, 0.97, 1],
              }
        }
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -left-24 size-[26rem] rounded-full bg-navy-300/20 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 22, -10, 0],
                y: [0, -28, 14, 0],
                scale: [1, 0.94, 1.06, 1],
              }
        }
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Thin gold horizon — editorial accent */}
      <div className="absolute right-[10%] bottom-[14%] left-[10%] hidden h-px bg-linear-to-l from-transparent via-gold-400/45 to-transparent md:block" />
    </div>
  )
}
