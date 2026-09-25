const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'] as const

/** Persian / Arabic thousands separator used by `fa-IR`. */
const FA_THOUSANDS_SEP = '\u066C'

/** Converts every ASCII digit inside a value to its Persian counterpart. */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit)
}

/**
 * Converts Persian (۰-۹) and Arabic-Indic (٠-٩) digits to ASCII 0-9.
 * Leaves non-digit characters unchanged.
 */
export function toAsciiDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - '۰'.charCodeAt(0)))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - '٠'.charCodeAt(0)))
}

/**
 * Normalizes typed numeric fields: ASCII digits + strip common thousand separators / spaces.
 */
export function normalizeNumericInput(value: string): string {
  return toAsciiDigits(value).replace(/[,\u066C\u202F\u00A0\s]/g, '')
}

/** Digits-only ASCII string from any amount-like input (display or raw). */
export function parseAmountDigits(value: string): string {
  return normalizeNumericInput(value).replace(/\D/g, '')
}

/**
 * Live typing / display for money fields: Persian digits + groups of 3 (`۱٬۲۵۰٬۰۰۰`).
 * UI-only — never send this string to the API; use `parseAmountDigits` / `parseAmountNumber`.
 */
export function formatAmountInput(value: string | number | null | undefined): string {
  if (value == null || value === '') return ''
  const digits =
    typeof value === 'number' ? String(Math.trunc(Math.abs(value))) : parseAmountDigits(String(value))
  if (!digits) return ''
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, FA_THOUSANDS_SEP)
  return toPersianDigits(grouped)
}

/** Parse amount input to a finite number for API payloads; `NaN` when empty/invalid. */
export function parseAmountNumber(value: string | number | null | undefined): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN
  const digits = parseAmountDigits(String(value ?? ''))
  if (!digits) return NaN
  return Number(digits)
}

/** Display helper for optional amount strings/numbers from the API. */
export function formatFaAmount(value: string | number | null | undefined, empty = '—'): string {
  if (value == null || value === '') return empty
  const n = typeof value === 'number' ? value : parseAmountNumber(String(value))
  if (!Number.isFinite(n)) return String(value)
  return formatFaNumber(n)
}

/** react-hook-form `register` options for digit-only fields (phone, OTP, national ID). */
export const asciiDigitsField = {
  setValueAs: (value: unknown) => toAsciiDigits(String(value ?? '')),
} as const

/** react-hook-form options for amount-like fields (digits + separators → ASCII digits). */
export const asciiAmountField = {
  setValueAs: (value: unknown) => parseAmountDigits(String(value ?? '')),
} as const

/** Formats a number with Persian digits and locale-aware thousand separators. */
export function formatFaNumber(value: number): string {
  return toPersianDigits(new Intl.NumberFormat('fa-IR').format(value))
}
