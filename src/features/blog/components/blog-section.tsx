import { useQuery } from '@tanstack/react-query'
import { ArrowUpLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/animated/reveal'
import { Container } from '@/components/shared/container'
import { Button } from '@/components/ui'
import { SectionHeading } from '@/features/home/components/section-heading'
import { SECTION_IDS } from '@/features/home/constants'
import { fetchBlogList } from '../api/blog'
import { BlogPostCard } from './blog-post-card'

const HOME_BLOG_LIMIT = 3

/** Marketing homepage blog strip — list preview + link to full archive. */
export function BlogSection() {
  const { data: posts = [], isLoading, isError } = useQuery({
    queryKey: ['marketing', 'blog', 'list'],
    queryFn: fetchBlogList,
  })

  const preview = posts.slice(0, HOME_BLOG_LIMIT)

  return (
    <section id={SECTION_IDS.blog} className="scroll-mt-28 bg-white py-20 lg:scroll-mt-32 lg:py-28">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              align="start"
              eyebrow="دانش حقوقی"
              title="از بلاگ وزین عدالت"
              description="نکات کاربردی درباره اظهارنامه، دادخواست، پیگیری پرونده و مشاوره آنلاین — به‌زبان ساده و تخصصی."
              className="max-w-2xl"
            />
            <Button variant="outline" size="lg" className="w-full shrink-0 sm:w-auto" asChild>
              <Link to="/blog">
                همه مطالب
                <ArrowUpLeft className="size-4" strokeWidth={1.8} aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Reveal>

        {isLoading ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6" aria-busy="true">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-[1.5rem] border border-navy-100 bg-navy-50"
              />
            ))}
          </div>
        ) : null}

        {isError ? (
          <p className="mt-12 text-center text-sm text-navy-500" role="alert">
            بارگذاری مطالب بلاگ با خطا مواجه شد. لطفاً دوباره تلاش کنید.
          </p>
        ) : null}

        {!isLoading && !isError && preview.length === 0 ? (
          <p className="mt-12 text-center text-sm text-navy-500">به‌زودی مطالب جدید منتشر می‌شود.</p>
        ) : null}

        {!isLoading && preview.length > 0 ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6">
            {preview.map((post, index) => (
              <BlogPostCard key={post.id} post={post} delay={index * 0.06} />
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  )
}
