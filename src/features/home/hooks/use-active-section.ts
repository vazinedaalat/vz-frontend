import { useEffect, useState } from 'react'

/**
 * Highlights the nav item for the section currently under the sticky header.
 * Uses document position (not nav order) so consecutive sections don't collide.
 */
export function useActiveSection(sectionIds: readonly string[], offset = 120): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? '')

  useEffect(() => {
    const resolveActiveSection = () => {
      const header = document.querySelector('[data-site-header]')
      const headerOffset =
        header instanceof HTMLElement ? header.getBoundingClientRect().height + 16 : offset

      const measured = sectionIds
        .map((id) => {
          const element = document.getElementById(id)
          if (!element) return null
          return { id, top: element.getBoundingClientRect().top }
        })
        .filter((item): item is { id: string; top: number } => item !== null)
        .sort((a, b) => a.top - b.top)

      let current = measured[0]?.id ?? ''
      for (const item of measured) {
        if (item.top <= headerOffset) current = item.id
      }

      setActiveId(current)
    }

    resolveActiveSection()
    window.addEventListener('scroll', resolveActiveSection, { passive: true })
    window.addEventListener('resize', resolveActiveSection)

    return () => {
      window.removeEventListener('scroll', resolveActiveSection)
      window.removeEventListener('resize', resolveActiveSection)
    }
  }, [sectionIds, offset])

  return activeId
}
