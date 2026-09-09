import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui'
import { logger } from '@/lib/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ErrorBoundary caught an error', { error: error.message, componentStack: errorInfo.componentStack })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground text-sm">An unexpected error occurred.</p>
          <Button onClick={() => this.setState({ hasError: false, error: undefined })}>
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
