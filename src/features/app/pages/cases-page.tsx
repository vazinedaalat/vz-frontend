import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import { getCases } from '../mocks/data'
import { AppEmptyState } from '../components/app-empty-state'
import { CaseCard } from '../components/case-card'
import { PageHeader } from '../components/page-header'

export default function CasesPage() {
  const cases = getCases()

  return (
    <div>
      <PageHeader
        eyebrow="پرونده‌ها"
        title="وضعیت پرونده‌های من"
        description="هر پرونده را مرحله‌به‌مرحله ببینید؛ از پذیرش تا اطلاع‌رسانی."
        action={
          <Button variant="accent" asChild>
            <Link to="/app/cases/new">ایجاد پرونده</Link>
          </Button>
        }
      />

      {cases.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cases.map((item) => (
            <CaseCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <AppEmptyState
          title="پرونده‌ای وجود ندارد"
          description="در محیط تولید، پرونده‌ها از API بارگذاری می‌شوند."
          action={
            <Button variant="accent" asChild>
              <Link to="/app/cases/new">ایجاد پرونده آنلاین</Link>
            </Button>
          }
        />
      )}
    </div>
  )
}
