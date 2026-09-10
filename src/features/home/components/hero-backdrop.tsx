import { motion, useReducedMotion } from 'framer-motion'

const PARTICLES = [
  { top: '12%', left: '8%', size: 3, delay: 0.2, duration: 5.5 },
  { top: '22%', left: '78%', size: 2, delay: 1.1, duration: 6.2 },
  { top: '38%', left: '18%', size: 2.5, delay: 0.6, duration: 4.8 },
  { top: '48%', left: '88%', size: 3, delay: 1.8, duration: 7 },
  { top: '62%', left: '12%', size: 2, delay: 0.9, duration: 5.2 },
  { top: '71%', left: '72%', size: 2.5, delay: 1.4, duration: 6.6 },
  { top: '18%', left: '42%', size: 2, delay: 2.1, duration: 5.8 },
  { top: '82%', left: '38%', size: 3, delay: 0.4, duration: 4.6 },
  { top: '55%', left: '55%', size: 2, delay: 1.6, duration: 6 },
  { top: '30%', left: '62%', size: 2.5, delay: 0.3, duration: 5.4 },
] as const

/**
 * Full-bleed cinematic backdrop for the hero:
 * drifting aurora orbs, soft pulse rings, constellation particles, and a light sweep.
 */
export function HeroBackdrop() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Base atmosphere */}
      <div className="absolute inset-0 bg-navy-50" />
      <div className="bg-dot-grid absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-linear-to-b from-white/70 via-transparent to-navy-50" />
      <div className="absolute inset-0 bg-linear-to-l from-gold-100/35 via-transparent to-navy-100/40" />

      {/* Soft vignette so content stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgb(248_249_250)_92%)]" />

      {/* Aurora orbs */}
      <motion.div
        className="absolute -top-24 -right-16 size-[28rem] rounded-full bg-gold-300/30 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 40, -20, 0],
                y: [0, 30, 10, 0],
                scale: [1, 1.12, 0.96, 1],
                opacity: [0.35, 0.55, 0.4, 0.35],
              }
        }
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/4 -left-20 size-[24rem] rounded-full bg-navy-300/25 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 30, -15, 0],
                y: [0, -35, 20, 0],
                scale: [1, 0.92, 1.08, 1],
                opacity: [0.28, 0.45, 0.32, 0.28],
              }
        }
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      />
      <motion.div
        className="absolute right-1/4 bottom-0 size-[22rem] rounded-full bg-gold-200/40 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, -25, 35, 0],
                y: [0, -20, 15, 0],
                scale: [1, 1.15, 1, 1],
                opacity: [0.3, 0.5, 0.35, 0.3],
              }
        }
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
      />

      {/* Expanding pulse rings — visual “signal” of online service */}
      <div className="absolute top-[42%] left-[68%] hidden -translate-x-1/2 -translate-y-1/2 lg:block">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="absolute top-1/2 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-400/35"
            animate={
              reduceMotion
                ? undefined
                : {
                    scale: [0.55, 2.4],
                    opacity: [0.45, 0],
                  }
            }
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: 'easeOut',
              delay: index * 1.8,
            }}
          />
        ))}
        <span className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500 shadow-[0_0_24px_rgb(201_168_108_/0.8)]" />
      </div>

      {/* Slow diagonal light sweep */}
      {!reduceMotion ? (
        <motion.div
          className="absolute inset-y-[-20%] w-[28%] skew-x-[-18deg] bg-linear-to-l from-transparent via-white/35 to-transparent"
          initial={{ left: '-35%', opacity: 0 }}
          animate={{ left: ['-35%', '120%'], opacity: [0, 0.7, 0.7, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', repeatDelay: 4 }}
        />
      ) : null}

      {/* Constellation particles */}
      {PARTICLES.map((particle, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-navy-400/70"
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, -14, 0],
                  opacity: [0.25, 0.9, 0.25],
                  scale: [1, 1.4, 1],
                }
          }
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
          }}
        />
      ))}

      {/* Thin animated horizon line */}
      <motion.div
        className="absolute right-[8%] bottom-[18%] left-[8%] h-px origin-center bg-linear-to-l from-transparent via-gold-400/50 to-transparent"
        animate={reduceMotion ? undefined : { scaleX: [0.4, 1, 0.4], opacity: [0.2, 0.55, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
