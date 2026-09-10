import { useEffect } from 'react'

/** The public brand site is designed as a light, high-contrast palette. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('dark')
    root.classList.add('light')
  }, [])

  return <>{children}</>
}
