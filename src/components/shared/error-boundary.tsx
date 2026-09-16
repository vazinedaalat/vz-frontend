import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui'
import { ErrorBadge } from '@/components/shared/error-badge'
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
    logger.error('ErrorBoundary caught an error', {
      error: error.message,
      componentStack: errorInfo.componentStack,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8">
          <h2 className="font-display text-xl font-semibold text-navy-900">مشکلی پیش آمد</h2>
          <ErrorBadge variant="page" className="max-w-md text-center">
            خطای غیرمنتظره‌ای رخ داد. لطفاً دوباره تلاش کنید.
          </ErrorBadge>
          <Button onClick={() => this.setState({ hasError: false, error: undefined })}>
            تلاش مجدد
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
