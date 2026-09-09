import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.string().url().optional().default('http://localhost:3000/api'),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  VITE_APP_NAME: z.string().default('Frontend Boilerplate'),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment configuration')
}

export const env = parsed.data
