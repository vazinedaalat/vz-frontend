const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'] as const

/** Converts every ASCII digit inside a value to its Persian counterpart. */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit)
}

/** Formats a number with Persian digits and locale-aware thousand separators. */
export function formatFaNumber(value: number): string {
  return toPersianDigits(new Intl.NumberFormat('fa-IR').format(value))
}
