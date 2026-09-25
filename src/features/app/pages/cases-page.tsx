import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui'
import { CaseCardSkeletonGrid } from '@/components/shared/skeletons'
import { useLazySkeleton } from '@/hooks/use-lazy-skeleton'
import { usePagination } from '@/hooks/use-pagination'
import { isMockEnabled } from '@/config/env'
import { appKeys, fetchCases } from '../api'
import { getCases } from '../mocks/data'
import { AppEmptyState } from '../components/app-empty-state'
import { CaseCard } from '../components/case-card'
import { PageHeader } from '../components/page-header'
import { Pagination } from '@/components/shared/pagination'

const PAGE_SIZE = 6

export default function CasesPage() {
  const { data: cases = [], isPending } = useQuery({
    queryKey: appKeys.cases.all,
    queryFn: isMockEnabled ? async () => getCases() : fetchCases,
  })

  const showSkeleton = useLazySkeleton(isPending)
  const pagination = usePagination(cases, PAGE_SIZE)

  return (
    <div>
      <PageHeader
        eyebrow="پرونده‌ها"
        title="وضعیت پرونده‌های من"
        description="هر پرونده را مرحله‌به‌مرحله ببینید و از چت اختصاصی آن پیگیری کنید."
        action={
          <Button variant="accent" asChild>
            <Link to="/app/cases/new">ایجاد پرونده</Link>
          </Button>
        }
      />

      {showSkeleton ? <CaseCardSkeletonGrid count={PAGE_SIZE} /> : null}

      {!showSkeleton && cases.length > 0 ? (
        <div className="space-y-5">
          <div id="cases-list" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pagination.pageItems.map((item) => (
              <CaseCard key={item.id} item={item} />
            ))}
          </div>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            from={pagination.from}
            to={pagination.to}
            onPageChange={pagination.setPage}
            listId="cases-list"
          />
        </div>
      ) : null}

      {!showSkeleton && !isPending && cases.length === 0 ? (
        <AppEmptyState
          title="پرونده‌ای وجود ندارد"
          description="پرونده‌های شما از سرور بارگذاری می‌شوند."
          action={
            <Button variant="accent" asChild>
              <Link to="/app/cases/new">ایجاد پرونده آنلاین</Link>
            </Button>
          }
        />
      ) : null}
    </div>
  )
}
