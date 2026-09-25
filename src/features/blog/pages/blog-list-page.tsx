import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/animated/reveal'
import { Container } from '@/components/shared/container'
import { DocumentHead } from '@/components/shared/document-head'
import { Pagination } from '@/components/shared/pagination'
import { BlogPostCardSkeletonGrid } from '@/components/shared/skeletons'
import { Button } from '@/components/ui'
import { useLazySkeleton } from '@/hooks/use-lazy-skeleton'
import { usePagination } from '@/hooks/use-pagination'
import { SiteFooter } from '@/features/home/components/site-footer'
import { SiteHeader } from '@/features/home/components/site-header'
import { SectionHeading } from '@/features/home/components/section-heading'
import { CTA, LOGIN_PATH } from '@/features/home/constants'
import { fetchBlogList } from '../api/blog'
import { BlogPostCard } from '../components/blog-post-card'
import { buildBlogListSeo } from '../lib/seo'

const PAGE_SIZE = 6

export default function BlogListPage() {
  const { data: posts = [], isPending, isError } = useQuery({
    queryKey: ['marketing', 'blog', 'list'],
    queryFn: fetchBlogList,
  })

  const seo = useMemo(() => buildBlogListSeo(), [])
  const showSkeleton = useLazySkeleton(isPending)
  const pagination = usePagination(posts, PAGE_SIZE)

  return (
    <div className="min-h-screen bg-navy-50 text-navy-900">
      <DocumentHead {...seo} />
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-navy-100 bg-navy-900 text-white">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(var(--color-gold-500)/0.18),transparent_55%)]"
            aria-hidden="true"
          />
          <Container className="relative py-16 lg:py-24">
            <Reveal>
              <SectionHeading
                align="start"
                tone="dark"
                eyebrow="بلاگ حقوقی"
                title="دانش کاربردی برای پیگیری پرونده آنلاین"
                description="از تفاوت اظهارنامه و دادخواست تا چک‌لیست ثنا و پیگیری وضعیت پرونده — مطالب کوتاه، دقیق و قابل‌اجرا."
                className="max-w-3xl"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button variant="accent" size="lg" className="w-full sm:w-auto" asChild>
                  <Link to={LOGIN_PATH}>{CTA.login}</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-white/25 bg-white/5 text-white hover:bg-white/10 sm:w-auto"
                  asChild
                >
                  <Link to="/">
                    بازگشت به صفحه اصلی
                    <ArrowUpLeft className="size-4" strokeWidth={1.8} aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </Container>
        </section>

        <section className="py-14 lg:py-20" aria-labelledby="blog-list-heading">
          <h2 id="blog-list-heading" className="sr-only">
            فهرست مطالب بلاگ
          </h2>
          <Container>
            {showSkeleton ? <BlogPostCardSkeletonGrid count={PAGE_SIZE} /> : null}

            {!showSkeleton && isError ? (
              <p className="text-center text-sm text-navy-500" role="alert">
                بارگذاری مطالب بلاگ با خطا مواجه شد.
              </p>
            ) : null}

            {!showSkeleton && !isPending && !isError && posts.length === 0 ? (
              <p className="text-center text-sm text-navy-500">فعلاً مطلبی منتشر نشده است.</p>
            ) : null}

            {!showSkeleton && pagination.pageItems.length > 0 ? (
              <div className="space-y-8">
                <div id="blog-list" className="grid gap-5 lg:grid-cols-2 lg:gap-6">
                  {pagination.pageItems.map((post, index) => (
                    <BlogPostCard
                      key={post.id}
                      post={post}
                      featured={pagination.page === 1 && index === 0}
                      delay={0.06 + index * 0.05}
                    />
                  ))}
                </div>
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  from={pagination.from}
                  to={pagination.to}
                  onPageChange={(next) => {
                    pagination.setPage(next)
                    document.getElementById('blog-list-heading')?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    })
                  }}
                  listId="blog-list"
                />
              </div>
            ) : null}
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
