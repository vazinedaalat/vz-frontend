import { motion, useReducedMotion } from 'framer-motion'
import { Scale } from 'lucide-react'

/**
 * Desktop hero mark — calm rotating rings + brand scales.
 * No floating promo badges (keeps the first viewport as one composition).
 */
export function HeroVisual() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg" aria-hidden="true">
      <div className="absolute inset-8 rounded-full bg-linear-to-br from-gold-100/50 via-transparent to-navy-100/40" />

      <motion.div
        className="absolute inset-4 rounded-full border border-navy-200/60"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-12 rounded-full border border-dashed border-gold-400/45"
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-20 rounded-full border border-navy-100"
        animate={reduceMotion ? undefined : { scale: [1, 1.03, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 grid size-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[1.75rem] bg-navy-900 text-gold-400 shadow-lift lg:size-36 lg:rounded-[2rem]"
        animate={
          reduceMotion
            ? undefined
            : {
                boxShadow: [
                  '0 20px 44px -18px rgb(11 28 44 / 0.35)',
                  '0 22px 52px -16px rgb(201 168 108 / 0.4)',
                  '0 20px 44px -18px rgb(11 28 44 / 0.35)',
                ],
              }
        }
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Scale className="size-14 lg:size-16" strokeWidth={1.15} />
      </motion.div>
    </div>
  )
}
