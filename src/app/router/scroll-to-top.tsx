import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToSection } from '@/utils/scroll'

/** Jump to top on pathname change; honor hash anchors after navigation. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    const html = document.documentElement
    const previous = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'

    if (hash) {
      const id = hash.replace(/^#/, '')
      requestAnimationFrame(() => {
        scrollToSection(id)
      })
    } else {
      window.scrollTo(0, 0)
    }

    html.style.scrollBehavior = previous
  }, [pathname, hash])

  return null
}
