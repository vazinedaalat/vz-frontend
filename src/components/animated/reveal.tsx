import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type RevealDirection = 'up' | 'down' | 'right' | 'left' | 'none'

interface RevealProps {
  children: ReactNode
  /** Entrance offset direction. */
  from?: RevealDirection
  /** Delay in seconds, useful for staggering siblings. */
  delay?: number
  className?: string
}

const OFFSET: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  right: { x: 32, y: 0 },
  left: { x: -32, y: 0 },
  none: { x: 0, y: 0 },
}

/** Subtle scroll-triggered entrance animation that respects reduced-motion. */
export function Reveal({ children, from = 'up', delay = 0, className }: RevealProps) {
  const reduceMotion = useReducedMotion()
  const offset = OFFSET[from]

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
