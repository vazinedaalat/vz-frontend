/**
 * Fixes filenames that arrived as UTF-8 bytes misread as Latin-1 (classic Nest/multer mojibake).
 * Leaves already-correct Persian/ASCII names untouched.
 */
export function normalizeFileName(name: string): string {
  const raw = name?.trim() ?? ''
  if (!raw) return raw

  // Already contains Arabic / Persian letters — trust it.
  if (ARABIC_SCRIPT.test(raw)) return raw

  // Percent-encoded UTF-8 (rare but cheap to handle).
  if (/%[0-9A-Fa-f]{2}/.test(raw)) {
    try {
      const decoded = decodeURIComponent(raw)
      if (decoded && decoded !== raw) return normalizeFileName(decoded)
    } catch {
      // keep going
    }
  }

  // Only attempt latin1→utf8 when high Latin-1 bytes that look like mojibake are present.
  if (!MOJIBAKE_HINT.test(raw)) return raw
  if ([...raw].some((ch) => ch.charCodeAt(0) > 255)) return raw

  try {
    const bytes = Uint8Array.from(raw, (ch) => ch.charCodeAt(0))
    const fixed = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    // Accept when we gained Arabic script or at least got a non-empty distinct string.
    if (!fixed) return raw
    if (ARABIC_SCRIPT.test(fixed) || fixed.includes('�') === false) return fixed
    return raw
  } catch {
    return raw
  }
}

const ARABIC_SCRIPT = /[\u0600-\u06FF]/
/** Typical UTF-8-as-Latin-1 markers for Persian (Ø Ù Ú Û …). */
const MOJIBAKE_HINT = /[À-ÿ]/
