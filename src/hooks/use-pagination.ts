import { useEffect, useState } from 'react'
import {
  clampPage,
  getPageItemRange,
  getPageSlice,
  getTotalPages,
} from '@/lib/pagination'

export type UsePaginationResult<T> = {
  page: number
  setPage: (page: number) => void
  pageSize: number
  pageItems: T[]
  totalItems: number
  totalPages: number
  from: number
  to: number
  showPagination: boolean
}

/**
 * Client-side pagination for fetched arrays.
 * Clamps the page when the list shrinks; resets to page 1 when `resetKey` changes.
 */
export function usePagination<T>(
  items: readonly T[],
  pageSize: number,
  resetKey?: string | number,
): UsePaginationResult<T> {
  const [page, setPage] = useState(1)
  const totalItems = items.length
  const totalPages = getTotalPages(totalItems, pageSize)
  const safePage = clampPage(page, totalPages)

  useEffect(() => {
    setPage(1)
  }, [pageSize, resetKey])

  useEffect(() => {
    if (page !== safePage) setPage(safePage)
  }, [page, safePage])

  const pageItems = getPageSlice(items, safePage, pageSize)
  const { from, to } = getPageItemRange(safePage, pageSize, totalItems)

  return {
    page: safePage,
    setPage,
    pageSize,
    pageItems,
    totalItems,
    totalPages,
    from,
    to,
    showPagination: totalItems > pageSize,
  }
}
