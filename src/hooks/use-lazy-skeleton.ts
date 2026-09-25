import { useEffect, useState } from 'react'

export const LAZY_SKELETON_DELAY_MS = 180

/**
 * Delayed (lazy) reveal for pending states — avoids skeleton flash on fast/cached responses.
 * When `pending` flips false, hide immediately.
 */
export function useLazySkeleton(pending: boolean, delayMs = LAZY_SKELETON_DELAY_MS): boolean {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!pending) {
      setShow(false)
      return
    }

    const id = window.setTimeout(() => setShow(true), Math.max(0, delayMs))
    return () => window.clearTimeout(id)
  }, [pending, delayMs])

  return show
}
