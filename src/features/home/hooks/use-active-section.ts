import { useEffect, useState } from 'react'

/**
 * Tracks which in-page section is currently under the header,
 * used to highlight the matching navigation link.
 */
export function useActiveSection(sectionIds: readonly string[], offset = 160): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? '')

  useEffect(() => {
    const resolveActiveSection = () => {
      let current = sectionIds[0] ?? ''

      for (const id of sectionIds) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= offset) {
          current = id
        }
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
