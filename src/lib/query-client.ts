import { QueryClient } from '@tanstack/react-query'
import { AuthenticationError } from '@/services/api/errors'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      // Session death already redirects to login — don't retry into an empty shell.
      retry: (count, error) => !(error instanceof AuthenticationError) && count < 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

/** Cached server data belongs to one user; drop it whenever the session changes hands. */
export async function resetUserScopedCache(client: QueryClient = queryClient): Promise<void> {
  await client.cancelQueries()
  client.clear()
}
