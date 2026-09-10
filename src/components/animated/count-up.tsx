import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { formatFaNumber } from '@/lib/format'

interface CountUpProps {
  to: number
  /** Duration in milliseconds. */
  duration?: number
  className?: string
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/** Counts up to `to` when scrolled into view, rendered with Persian digits. */
export function CountUp({ to, duration = 1600, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduceMotion = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduceMotion) {
      setValue(to)
      return
    }

    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setValue(Math.round(easeOut(progress) * to))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduceMotion, to, duration])

  return (
    <span ref={ref} className={className}>
      {formatFaNumber(value)}
    </span>
  )
}
