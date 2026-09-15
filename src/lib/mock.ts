import { isMockEnabled } from '@/config/env'

/**
 * Local mock datasets — enabled only when `VITE_USE_MOCK=true`
 * and never in production builds.
 */
export const USE_MOCK_DATA = isMockEnabled

export function withMockData<T>(factory: () => T, empty: T): T {
  return USE_MOCK_DATA ? factory() : empty
}
