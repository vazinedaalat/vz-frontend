import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpLeft, Clock3, UserRound } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Reveal } from '@/components/animated/reveal'
import { Container } from '@/components/shared/container'
import { DocumentHead } from '@/components/shared/document-head'
import { BlogPostDetailSkeleton } from '@/components/shared/skeletons'
import { Button } from '@/components/ui'
import { useLazySkeleton } from '@/hooks/use-lazy-skeleton'
import { SiteFooter } from '@/features/home/components/site-footer'
import { SiteHeader } from '@/features/home/components/site-header'
import { CTA, LOGIN_PATH } from '@/features/home/constants'
import { formatFaNumber } from '@/lib/format'
import { formatFaDate } from '@/lib/jalali'
import { fetchBlogBySlug, fetchBlogList } from '../api/blog'
import { BlogPostCard } from '../components/blog-post-card'
import { BlogFaqSection, BlogKeyTakeaways } from '../components/blog-seo-blocks'
import { buildBlogNotFoundSeo, buildBlogPostSeo } from '../lib/seo'
import { sanitizeBlogHtml } from '../lib/sanitize-blog-html'
import type { BlogBodyBlock } from '../types'

function BlogBody({
  blocks,
  bodyHtml,
}: {
  blocks: BlogBodyBlock[]
  bodyHtml?: string
}) {
  if (bodyHtml?.trim()) {
    return (
      <div
        className="blog-prose prose-legal max-w-none text-base leading-9 text-navy-700 lg:text-lg lg:leading-10 [&_a]:font-semibold [&_a]:text-gold-700 [&_a]:underline-offset-2 hover:[&_a]:text-gold-800 [&_blockquote]:border-s-4 [&_blockquote]:border-gold-400 [&_blockquote]:bg-navy-50/80 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:text-navy-700 [&_em]:italic [&_h2]:font-display [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-28 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-navy-900 [&_h3]:font-display [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-navy-900 [&_li]:my-1.5 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:ps-6 [&_p]:mb-5 [&_p]:last:mb-0 [&_strong]:font-bold [&_strong]:text-navy-900 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:ps-6 [&_ul]:marker:text-gold-600"
        dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(bodyHtml) }}
      />
    )
  }

  return (
    <div className="prose-legal space-y-6 text-base leading-9 text-navy-700 lg:text-lg lg:leading-10">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <h2
              key={`h-${index}`}
              className="font-display scroll-mt-28 pt-4 text-2xl font-extrabold text-navy-900 lg:scroll-mt-32 lg:text-[1.75rem]"
            >
              {block.text}
            </h2>
          )
        }
        if (block.type === 'list') {
          return (
            <ul key={`l-${index}`} className="list-disc space-y-2 ps-6 marker:text-gold-600">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )
        }
        return <p key={`p-${index}`}>{block.text}</p>
      })}
    </div>
  )
}

export default function BlogPostPage() {
  const { slug = '' } = useParams<{ slug: string }>()

  const postQuery = useQuery({
    queryKey: ['marketing', 'blog', 'detail', slug],
    queryFn: () => fetchBlogBySlug(slug),
    enabled: Boolean(slug),
  })

  const relatedQuery = useQuery({
    queryKey: ['marketing', 'blog', 'list'],
    queryFn: fetchBlogList,
  })

  const post = postQuery.data
  const showSkeleton = useLazySkeleton(postQuery.isPending)
  const related =
    relatedQuery.data?.filter((item) => item.slug !== post?.slug && item.id !== post?.id).slice(0, 2) ??
    []

  const seo = useMemo(() => {
    if (postQuery.isPending) return null
    if (!post) return buildBlogNotFoundSeo(slug)
    return buildBlogPostSeo(post)
  }, [post, postQuery.isPending, slug])

  return (
    <div className="min-h-screen bg-navy-50 text-navy-900">
      {seo ? <DocumentHead {...seo} /> : null}
      <SiteHeader />
      <main>
        {showSkeleton ? (
          <Container className="py-20">
            <BlogPostDetailSkeleton />
          </Container>
        ) : null}

        {!showSkeleton && !postQuery.isPending && !post ? (
          <Container className="py-20 text-center">
            <h1 className="font-display text-3xl font-extrabold text-navy-900">مطلب پیدا نشد</h1>
            <p className="mt-4 text-navy-600">این مطلب حذف شده یا آدرس آن اشتباه است.</p>
            <Button variant="accent" size="lg" className="mt-8" asChild>
              <Link to="/blog">بازگشت به بلاگ</Link>
            </Button>
          </Container>
        ) : null}

        {post ? (
          <>
            <article itemScope itemType="https://schema.org/BlogPosting">
              <meta itemProp="headline" content={post.title} />
              <meta itemProp="datePublished" content={post.publishedAt} />
              <meta itemProp="dateModified" content={post.updatedAt ?? post.publishedAt} />
              <header className="border-b border-navy-100 bg-white">
                <Container className="py-12 lg:py-16">
                  <Reveal>
                    <nav aria-label="مسیر صفحه" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-navy-500">
                      <Link to="/" className="transition-colors hover:text-navy-900">
                        خانه
                      </Link>
                      <span aria-hidden="true">/</span>
                      <Link to="/blog" className="transition-colors hover:text-navy-900">
                        بلاگ
                      </Link>
                      <span aria-hidden="true">/</span>
                      <span className="line-clamp-1 text-navy-700">{post.title}</span>
                    </nav>
                  </Reveal>

                  <Reveal delay={0.06}>
                    <div className="mx-auto max-w-3xl">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-navy-500">
                        <span className="rounded-lg bg-gold-100 px-2.5 py-1 font-semibold text-gold-800">
                          {post.category}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 className="size-3.5" strokeWidth={1.7} aria-hidden="true" />
                          {formatFaNumber(post.readMinutes)} دقیقه مطالعه
                        </span>
                        <time dateTime={post.publishedAt} itemProp="datePublished">
                          {formatFaDate(post.publishedAt)}
                        </time>
                        {post.updatedAt && post.updatedAt !== post.publishedAt ? (
                          <time dateTime={post.updatedAt} itemProp="dateModified">
                            به‌روزرسانی: {formatFaDate(post.updatedAt)}
                          </time>
                        ) : null}
                      </div>

                      <h1
                        itemProp="headline"
                        className="font-display mt-5 text-3xl leading-[1.3] font-extrabold text-balance text-navy-900 sm:text-4xl lg:text-[2.75rem]"
                      >
                        {post.title}
                      </h1>

                      <p
                        data-seo-summary
                        itemProp="description"
                        className="mt-5 text-base leading-8 text-navy-600 lg:text-lg"
                      >
                        {post.excerpt}
                      </p>

                      <div
                        className="mt-8 flex items-center gap-3 border-t border-navy-100 pt-6"
                        itemProp="author"
                        itemScope
                        itemType="https://schema.org/Person"
                      >
                        <span className="grid size-11 place-items-center rounded-xl bg-navy-900 text-gold-300">
                          <UserRound className="size-5" strokeWidth={1.6} aria-hidden="true" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-navy-900" itemProp="name">
                            {post.authorName}
                          </p>
                          {post.authorRole ? (
                            <p className="text-xs text-navy-500" itemProp="jobTitle">
                              {post.authorRole}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </Container>
              </header>

              {post.coverImage ? (
                <Container className="pt-8 lg:pt-12">
                  <Reveal>
                    <div className="overflow-hidden rounded-[1.5rem] border border-navy-200 shadow-soft">
                      <img
                        src={post.coverImage}
                        alt={post.coverImageAlt ?? post.title}
                        itemProp="image"
                        className="aspect-[16/9] w-full object-cover"
                      />
                    </div>
                  </Reveal>
                </Container>
              ) : null}

              <Container className="py-12 lg:py-16">
                <Reveal delay={0.08}>
                  <div className="mx-auto max-w-3xl">
                    {post.keyTakeaways?.length ? (
                      <div className="mb-10">
                        <BlogKeyTakeaways items={post.keyTakeaways} />
                      </div>
                    ) : null}

                    <div itemProp="articleBody">
                      <BlogBody blocks={post.body} bodyHtml={post.bodyHtml} />
                    </div>

                    {post.faq?.length ? <BlogFaqSection items={post.faq} /> : null}

                    <div className="mt-12 flex flex-col gap-3 rounded-[1.5rem] border border-navy-200 bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-8">
                      <div>
                        <p className="font-display text-lg font-bold text-navy-900">نیاز به اقدام حقوقی دارید؟</p>
                        <p className="mt-1 text-sm leading-7 text-navy-600">
                          از مشاوره تا پیگیری پرونده را آنلاین در اپ وزین عدالت انجام دهید.
                        </p>
                      </div>
                      <Button variant="accent" size="lg" className="w-full shrink-0 sm:w-auto" asChild>
                        <Link to={LOGIN_PATH}>{CTA.login}</Link>
                      </Button>
                    </div>

                    <div className="mt-10">
                      <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gold-700 hover:text-gold-800"
                      >
                        <ArrowUpLeft className="size-4 rotate-180" strokeWidth={1.8} aria-hidden="true" />
                        بازگشت به فهرست مطالب
                      </Link>
                    </div>
                  </div>
                </Reveal>
              </Container>
            </article>

            {related.length > 0 ? (
              <section className="border-t border-navy-100 bg-white py-14 lg:py-20">
                <Container>
                  <h2 className="font-display text-2xl font-extrabold text-navy-900">مطالب مرتبط</h2>
                  <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:gap-6">
                    {related.map((item, index) => (
                      <BlogPostCard key={item.id} post={item} delay={index * 0.06} />
                    ))}
                  </div>
                </Container>
              </section>
            ) : null}
          </>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  )
}
