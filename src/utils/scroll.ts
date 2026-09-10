/** Smoothly scrolls an in-page section into view, honoring reduced-motion. */
export function scrollToSection(sectionId: string): void {
  const target = document.getElementById(sectionId)
  if (!target) return

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start',
  })
}
