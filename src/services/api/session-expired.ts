type SessionExpiredHandler = () => void

let handler: SessionExpiredHandler | null = null

/** Register once from the app shell so the API client can end the UX session without importing the store. */
export function onSessionExpired(next: SessionExpiredHandler | null): void {
  handler = next
}

/** Access/refresh rejected: clear local auth so protected routes send the user back to login. */
export function notifySessionExpired(): void {
  handler?.()
}
