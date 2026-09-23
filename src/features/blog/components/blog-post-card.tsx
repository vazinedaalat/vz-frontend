import { ArrowUpLeft, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/animated/reveal'
import { formatFaNumber } from '@/lib/format'
import { formatFaDate } from '@/lib/jalali'
import { cn } from '@/lib/utils'
import type { BlogPostSummary } from '../types'

interface BlogPostCardProps {
  post: BlogPostSummary
  /** Featured card spans two columns on large screens. */
  featured?: boolean
  delay?: number
  className?: string
}

export function BlogPostCard({ post, featured = false, delay = 0, className }: BlogPostCardProps) {
  return (
    <Reveal delay={delay} className={cn(featured && 'lg:col-span-2', className)}>
      <article
        className={cn(
          'group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-navy-200 bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift',
          featured && 'lg:flex-row'
        )}
      >
        {post.coverImage ? (
          <div
            className={cn(
              'relative overflow-hidden bg-navy-100',
              featured ? 'aspect-[16/10] lg:aspect-auto lg:w-[42%] lg:min-h-[16rem]' : 'aspect-[16/10]'
            )}
          >
            <img
              src={post.coverImage}
              alt=""
              className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-navy-950/35 via-transparent to-transparent"
              aria-hidden="true"
            />
          </div>
        ) : null}

        <div className={cn('flex flex-1 flex-col gap-4 p-6 sm:p-7', featured && 'lg:justify-center lg:p-9')}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-navy-500">
            <span className="rounded-lg bg-gold-100 px-2.5 py-1 font-semibold text-gold-800">
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-3.5" strokeWidth={1.7} aria-hidden="true" />
              {formatFaNumber(post.readMinutes)} دقیقه مطالعه
            </span>
            <time dateTime={post.publishedAt}>{formatFaDate(post.publishedAt)}</time>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <h3
              className={cn(
                'font-display font-extrabold text-balance text-navy-900 transition-colors group-hover:text-navy-800',
                featured ? 'text-2xl leading-snug lg:text-[1.75rem]' : 'text-xl leading-snug'
              )}
            >
              <Link to={`/blog/${post.slug}`} className="outline-none focus-visible:underline">
                {post.title}
              </Link>
            </h3>
            <p className={cn('leading-8 text-navy-600', featured ? 'text-base' : 'text-sm')}>{post.excerpt}</p>
          </div>

          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-gold-700 transition-colors hover:text-gold-800"
          >
            ادامه مطلب
            <ArrowUpLeft className="size-4" strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </div>
      </article>
    </Reveal>
  )
}
