import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import { resetUserScopedCache } from '@/lib/query-client'

describe('resetUserScopedCache', () => {
  it("drops the previous user's cached data", async () => {
    const client = new QueryClient()
    client.setQueryData(['cases'], [{ id: 'case-of-previous-user' }])
    client.setQueryData(['me'], { id: 'u1' })

    await resetUserScopedCache(client)

    expect(client.getQueryData(['cases'])).toBeUndefined()
    expect(client.getQueryData(['me'])).toBeUndefined()
    expect(client.getQueryCache().getAll()).toHaveLength(0)
  })

  it('cancels in-flight requests so they cannot repopulate the cache', async () => {
    const client = new QueryClient()
    let aborted = false
    const pending = client
      .fetchQuery({
        queryKey: ['slow'],
        queryFn: ({ signal }) =>
          new Promise((resolve) => {
            signal.addEventListener('abort', () => {
              aborted = true
              resolve('late')
            })
          }),
      })
      .catch(() => undefined)

    await resetUserScopedCache(client)
    await pending

    expect(aborted).toBe(true)
    expect(client.getQueryData(['slow'])).toBeUndefined()
  })
})
