/**
 * Prefix a public/ asset path with Vite's configured base
 * (needed for GitHub Pages project sites like /vz-frontend/).
 */
export function publicUrl(path: string): string {
  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `${import.meta.env.BASE_URL}${normalized}`
}
