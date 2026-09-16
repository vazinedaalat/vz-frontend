import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { showErrorToast } from '@/hooks/use-toast'

interface ErrorBadgeProps {
  children?: ReactNode
  className?: string
  /**
   * `field` = compact under inputs (scrolls into view).
   * `page` = bottom toast via Radix (visible even if the form error sits off-screen).
   */
  variant?: 'field' | 'page'
}

function messageFromChildren(children: ReactNode): string | null {
  if (children == null || children === false) return null
  if (typeof children === 'string' || typeof children === 'number') return String(children)
  return null
}

/** Accessible error badge for form fields; page-level errors open as a bottom toast. */
export function ErrorBadge({ children, className, variant = 'field' }: ErrorBadgeProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const message = messageFromChildren(children)

  useLayoutEffect(() => {
    if (!message) return

    if (variant === 'page') {
      showErrorToast(message)
      return
    }

    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
  }, [message, variant])

  if (children == null || children === false || children === '') return null

  // Page errors are surfaced via bottom toast; keep a live region for screen readers / scroll targets.
  if (variant === 'page') {
    return (
      <p role="alert" className="sr-only">
        {children}
      </p>
    )
  }

  return (
    <p
      ref={ref}
      role="alert"
      className={cn(
        'inline-flex max-w-full scroll-mt-28 rounded-lg border border-destructive/30 bg-destructive/5 px-2.5 py-1 text-xs leading-5 text-destructive',
        className,
      )}
    >
      {children}
    </p>
  )
}

interface ErrorBadgeListProps {
  messages: string[]
  className?: string
  variant?: 'field' | 'page'
}

/** Renders multiple error badges stacked (file validation, etc.). */
export function ErrorBadgeList({ messages, className, variant = 'field' }: ErrorBadgeListProps) {
  const listRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (messages.length === 0 || variant === 'page') return
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
  }, [messages, variant])

  if (messages.length === 0) return null

  if (variant === 'page') {
    return (
      <>
        {messages.map((message) => (
          <ErrorBadge key={message} variant="page">
            {message}
          </ErrorBadge>
        ))}
      </>
    )
  }

  return (
    <div ref={listRef} className={cn('flex scroll-mt-28 flex-col items-start gap-1.5', className)}>
      {messages.map((message) => (
        <ErrorBadge key={message} variant="field">
          {message}
        </ErrorBadge>
      ))}
    </div>
  )
}
