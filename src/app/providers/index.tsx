import { useEffect } from 'react'
import { ThemeProvider } from './theme-provider'
import { QueryProvider } from './query-provider'
import { Toaster } from '@/components/ui/toaster'
import { useAuthStore } from '@/features/app/store/auth-store'

function SessionHydrator({ children }: { children: React.ReactNode }) {
  const hydrateSession = useAuthStore((s) => s.hydrateSession)

  useEffect(() => {
    void hydrateSession()
  }, [hydrateSession])

  return children
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <SessionHydrator>
          {children}
          <Toaster />
        </SessionHydrator>
      </ThemeProvider>
    </QueryProvider>
  )
}
