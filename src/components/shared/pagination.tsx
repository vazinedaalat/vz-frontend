import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { formatFaNumber, toPersianDigits } from '@/lib/format'
import { getPaginationRange } from '@/lib/pagination'
import { cn } from '@/lib/utils'

export type PaginationProps = {
  page: number
  totalPages: number
  totalItems: number
  from: number
  to: number
  onPageChange: (page: number) => void
  className?: string
  /** Hide the whole control when only one page (default true). */
  hideWhenSinglePage?: boolean
  /** Optional id for aria-controls on the list region. */
  listId?: string
}

/**
 * RTL-aware page controls with Persian digits and range summary.
 * Visual order follows document direction; labels stay semantic (قبلی / بعدی).
 */
export function Pagination({
  page,
  totalPages,
  totalItems,
  from,
  to,
  onPageChange,
  className,
  hideWhenSinglePage = true,
  listId,
}: PaginationProps) {
  if (hideWhenSinglePage && totalPages <= 1) return null
  if (totalItems <= 0) return null

  const range = getPaginationRange(page, totalPages)
  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <nav
      className={cn(
        'flex flex-col gap-3 border-t border-navy-100 pt-5 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
      aria-label="صفحه‌بندی فهرست"
    >
      <p className="text-center text-xs leading-6 text-navy-500 sm:text-start sm:text-sm">
        نمایش{' '}
        <span className="font-semibold text-navy-800">{toPersianDigits(from)}</span>
        {' تا '}
        <span className="font-semibold text-navy-800">{toPersianDigits(to)}</span>
        {' از '}
        <span className="font-semibold text-navy-800">{formatFaNumber(totalItems)}</span>
      </p>

      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-10 gap-1.5 px-3"
          disabled={!canPrev}
          aria-controls={listId}
          aria-label="صفحه قبلی"
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronRight className="size-4" aria-hidden />
          <span className="hidden sm:inline">قبلی</span>
        </Button>

        <ul className="flex flex-wrap items-center justify-center gap-1" role="list">
          {range.map((token, index) =>
            token === 'ellipsis' ? (
              <li key={`ellipsis-${index}`} aria-hidden>
                <span className="inline-flex size-10 items-center justify-center text-sm text-navy-400">
                  …
                </span>
              </li>
            ) : (
              <li key={token}>
                <Button
                  type="button"
                  variant={token === page ? 'default' : 'ghost'}
                  size="icon"
                  className={cn(
                    'size-10 rounded-xl text-sm',
                    token === page
                      ? 'bg-navy-900 text-gold-300 shadow-soft hover:bg-navy-800 hover:text-gold-200'
                      : 'text-navy-700 hover:bg-navy-50',
                  )}
                  aria-controls={listId}
                  aria-label={`صفحه ${toPersianDigits(token)}`}
                  aria-current={token === page ? 'page' : undefined}
                  onClick={() => onPageChange(token)}
                >
                  {toPersianDigits(token)}
                </Button>
              </li>
            ),
          )}
        </ul>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-10 gap-1.5 px-3"
          disabled={!canNext}
          aria-controls={listId}
          aria-label="صفحه بعدی"
          onClick={() => onPageChange(page + 1)}
        >
          <span className="hidden sm:inline">بعدی</span>
          <ChevronLeft className="size-4" aria-hidden />
        </Button>
      </div>
    </nav>
  )
}
