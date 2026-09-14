/** Wrap an index into `[0, length)` with support for negative deltas. */
export function cycleIndex(current: number, delta: number, length: number): number {
  if (length <= 0) return 0
  return ((current + delta) % length + length) % length
}
