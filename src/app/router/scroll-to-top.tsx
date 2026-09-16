import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Jump to the top of the window whenever the route pathname changes. */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const html = document.documentElement
    const previous = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    html.style.scrollBehavior = previous
  }, [pathname])

  return null
}
