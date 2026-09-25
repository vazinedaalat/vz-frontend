import { z } from 'zod'

const envSchema = z.object({
  /** Nest base including version, e.g. http://localhost:3000/api/v1 */
  VITE_API_URL: z.string().url().optional().default('http://localhost:3000/api/v1'),
  /** Origin for static uploads (/uploads/...), without /api */
  VITE_ASSET_BASE_URL: z.string().url().optional().default('http://localhost:3000'),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  VITE_APP_NAME: z.string().default('وزین عدالت'),
  /** Public site origin for canonical / Open Graph / JSON-LD (no trailing slash). */
  VITE_SITE_URL: z.string().url().optional(),
  /**
   * When true (and not production), UI may fall back to local mock datasets.
   * Default false — prefer live Nest API.
   */
  VITE_USE_MOCK: z
    .enum(['true', 'false'])
    .optional()
    .default('false')
    .transform((value) => value === 'true'),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment configuration')
}

export const env = parsed.data

/** Local mock datasets — never in production builds. */
export const isMockEnabled = env.VITE_APP_ENV !== 'production' && env.VITE_USE_MOCK
