/**
 * Session tokens live only in HttpOnly cookies set by the API; scripts can never read them.
 * The API accepts those cookies only when this header is present (CSRF defense).
 */
export const AUTH_CLIENT_HEADER = 'X-Auth-Client'
export const AUTH_CLIENT = 'web'

const LEGACY_TOKEN_KEYS = ['access_token', 'refresh_token'] as const

/** Older builds kept JWTs in localStorage; remove them so no token stays readable by scripts. */
export function clearLegacyTokens(storage: Pick<Storage, 'removeItem'> | undefined = globalThis.localStorage): void {
  if (!storage) return
  for (const key of LEGACY_TOKEN_KEYS) {
    try {
      storage.removeItem(key)
    } catch {
      // storage can throw in private mode; nothing to clean then
    }
  }
}

const NO_REFRESH_PATHS = ['/auth/refresh', '/auth/logout', '/auth/otp/']

/** A 401 is worth one silent refresh, except on the auth endpoints that create or end sessions. */
export function shouldAttemptRefresh(status: number | undefined, url: string | undefined, alreadyRetried: boolean): boolean {
  if (status !== 401 || alreadyRetried) return false
  return !NO_REFRESH_PATHS.some((path) => url?.includes(path))
}

type LockManagerLike = {
  request: <T>(name: string, callback: () => Promise<T>) => Promise<T>
}

/**
 * Serializes refreshes across tabs: a second tab waits, then sends the already-rotated cookie
 * instead of replaying the old one (which the API treats as token theft).
 */
export function withCrossTabLock<T>(name: string, task: () => Promise<T>): Promise<T> {
  const locks = (globalThis.navigator as { locks?: LockManagerLike } | undefined)?.locks
  return locks ? locks.request(name, task) : task()
}
