import { useEffect, useState } from 'react'

/** Returns `true` once the page is scrolled past `threshold` pixels. */
export function useScrolled(threshold = 16): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return scrolled
}
