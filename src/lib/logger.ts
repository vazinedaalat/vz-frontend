type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const isDev = import.meta.env.DEV

const sensitiveKeys = ['password', 'token', 'accessToken', 'refreshToken', 'authorization', 'secret', 'apiKey']

function sanitize(data: unknown): unknown {
  if (data === null || data === undefined) return data
  if (typeof data !== 'object') return data

  if (Array.isArray(data)) {
    return data.map(sanitize)
  }

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
      result[key] = '[REDACTED]'
    } else {
      result[key] = sanitize(value)
    }
  }
  return result
}

function log(level: LogLevel, message: string, meta?: unknown) {
  if (!isDev && level === 'debug') return

  const sanitizedMeta = meta !== undefined ? sanitize(meta) : undefined
  const timestamp = new Date().toISOString()

  const payload = {
    timestamp,
    level,
    message,
    ...(sanitizedMeta !== undefined && { meta: sanitizedMeta }),
  }

  switch (level) {
    case 'debug':
      console.debug(payload)
      break
    case 'info':
      console.info(payload)
      break
    case 'warn':
      console.warn(payload)
      break
    case 'error':
      console.error(payload)
      break
  }

  // Future: send to Sentry / external logger in production
}

export const logger = {
  debug: (message: string, meta?: unknown) => log('debug', message, meta),
  info: (message: string, meta?: unknown) => log('info', message, meta),
  warn: (message: string, meta?: unknown) => log('warn', message, meta),
  error: (message: string, meta?: unknown) => log('error', message, meta),
}
