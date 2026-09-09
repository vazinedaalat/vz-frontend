import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { useUiStore } from '@/app/store'
import { Moon, Sun, Monitor } from 'lucide-react'

export default function HomePage() {
  const { theme, setTheme } = useUiStore()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <h1 className="text-lg font-semibold">Frontend Boilerplate</h1>
          <div className="flex items-center gap-2">
            <Button
              variant={theme === 'light' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setTheme('light')}
              aria-label="Light theme"
            >
              <Sun className="h-4 w-4" />
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setTheme('dark')}
              aria-label="Dark theme"
            >
              <Moon className="h-4 w-4" />
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setTheme('system')}
              aria-label="System theme"
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Production-Ready Frontend</h2>
            <p className="text-muted-foreground">
              Clean, fast, secure, maintainable infrastructure. Ready for backend connection.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Infrastructure Ready</CardTitle>
              <CardDescription>
                This is a boilerplate. Add your features under <code className="text-xs">src/features/</code>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• React + TypeScript (strict) + Vite</p>
              <p>• Tailwind CSS + Design Tokens + Theme system</p>
              <p>• shadcn/ui core components</p>
              <p>• React Router (lazy + protected routes)</p>
              <p>• TanStack Query + Axios API layer</p>
              <p>• Zustand (client state only)</p>
              <p>• Zod + React Hook Form</p>
              <p>• Centralized error handling & secure logger</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
