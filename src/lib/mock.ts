import { isMockEnabled } from '@/config/env'

/**
 * Mock/demo datasets are available only outside production.
 * In production builds (`VITE_APP_ENV=production`) all mock getters return empty.
 */
export const USE_MOCK_DATA = isMockEnabled

export function withMockData<T>(factory: () => T, empty: T): T {
  return USE_MOCK_DATA ? factory() : empty
}
