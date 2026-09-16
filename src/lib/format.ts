const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'] as const

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

/** react-hook-form `register` options for digit-only fields (phone, OTP, national ID). */
export const asciiDigitsField = {
  setValueAs: (value: unknown) => toAsciiDigits(String(value ?? '')),
} as const

/** react-hook-form options for amount-like fields (digits + separators). */
export const asciiAmountField = {
  setValueAs: (value: unknown) => normalizeNumericInput(String(value ?? '')),
} as const

/** Formats a number with Persian digits and locale-aware thousand separators. */
export function formatFaNumber(value: number): string {
  return toPersianDigits(new Intl.NumberFormat('fa-IR').format(value))
}
