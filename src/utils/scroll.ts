const HEADER_SELECTOR = '[data-site-header]'
const EXTRA_GAP_PX = 12

function getHeaderOffset(): number {
  const header = document.querySelector(HEADER_SELECTOR)
  if (!(header instanceof HTMLElement)) return 96
  return header.getBoundingClientRect().height + EXTRA_GAP_PX
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Smoothly scrolls an in-page section into view, stopping below the sticky header. */
export function scrollToSection(sectionId: string): void {
  const target = document.getElementById(sectionId)
  if (!target) return

  const top = window.scrollY + target.getBoundingClientRect().top - getHeaderOffset()

  window.scrollTo({
    top: Math.max(0, top),
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  })
}
