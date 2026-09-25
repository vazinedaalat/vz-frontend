/** Pure pagination helpers — client-side lists until APIs support page params. */

export type PaginationToken = number | 'ellipsis'

export function getTotalPages(totalItems: number, pageSize: number): number {
  if (totalItems <= 0 || pageSize <= 0) return 1
  return Math.max(1, Math.ceil(totalItems / pageSize))
}

export function clampPage(page: number, totalPages: number): number {
  if (!Number.isFinite(page) || page < 1) return 1
  return Math.min(Math.max(1, Math.floor(page)), Math.max(1, totalPages))
}

export function getPageSlice<T>(items: readonly T[], page: number, pageSize: number): T[] {
  if (pageSize <= 0 || items.length === 0) return []
  const totalPages = getTotalPages(items.length, pageSize)
  const safePage = clampPage(page, totalPages)
  const start = (safePage - 1) * pageSize
  return items.slice(start, start + pageSize)
}

export function getPageItemRange(
  page: number,
  pageSize: number,
  totalItems: number,
): { from: number; to: number } {
  if (totalItems <= 0 || pageSize <= 0) return { from: 0, to: 0 }
  const totalPages = getTotalPages(totalItems, pageSize)
  const safePage = clampPage(page, totalPages)
  const from = (safePage - 1) * pageSize + 1
  const to = Math.min(safePage * pageSize, totalItems)
  return { from, to }
}

/**
 * Compact page list with ellipsis, e.g. `1 … 4 5 6 … 12`.
 * Always includes first/last; keeps `siblingCount` neighbors around current.
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): PaginationToken[] {
  const total = Math.max(1, totalPages)
  const current = clampPage(currentPage, total)
  const siblings = Math.max(0, Math.floor(siblingCount))

  // first + last + current + 2*siblings + 2 ellipsis slots
  const maxVisible = siblings * 2 + 5
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const leftSibling = Math.max(current - siblings, 1)
  const rightSibling = Math.min(current + siblings, total)
  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < total - 1

  const range: PaginationToken[] = [1]

  if (showLeftEllipsis) {
    range.push('ellipsis')
  } else {
    for (let page = 2; page < leftSibling; page += 1) range.push(page)
  }

  for (let page = leftSibling; page <= rightSibling; page += 1) {
    if (page !== 1 && page !== total) range.push(page)
  }

  if (showRightEllipsis) {
    range.push('ellipsis')
  } else {
    for (let page = rightSibling + 1; page < total; page += 1) range.push(page)
  }

  if (total > 1) range.push(total)

  return range
}
