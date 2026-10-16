import { motion, useReducedMotion } from 'framer-motion'
import { Scale } from 'lucide-react'

/** Desktop hero mark — quiet rings + brand scales (no floating stickers). */
export function HeroVisual() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg" aria-hidden="true">
      <div className="absolute inset-6 rounded-[2.5rem] border border-navy-200/70 bg-white/50 shadow-soft backdrop-blur-sm" />
      <div className="absolute inset-10 rounded-full bg-linear-to-br from-gold-100/60 via-white/20 to-navy-100/50" />

      <motion.div
        className="absolute inset-6 rounded-full border border-navy-200/50"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-14 rounded-full border border-dashed border-gold-400/40"
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-[5.5rem] rounded-full border border-navy-100/80"
        animate={reduceMotion ? undefined : { scale: [1, 1.025, 1], opacity: [0.45, 0.8, 0.45] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 grid size-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[1.75rem] bg-navy-900 text-gold-400 shadow-lift ring-1 ring-gold-400/25 lg:size-36 lg:rounded-[2rem]"
        animate={
          reduceMotion
            ? undefined
            : {
                boxShadow: [
                  '0 22px 48px -20px rgb(11 28 44 / 0.4)',
                  '0 24px 56px -18px rgb(201 168 108 / 0.42)',
                  '0 22px 48px -20px rgb(11 28 44 / 0.4)',
                ],
              }
        }
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Scale className="size-14 lg:size-16" strokeWidth={1.1} />
      </motion.div>
    </div>
  )
}
