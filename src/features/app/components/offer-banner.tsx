import { Link } from 'react-router-dom'
import { formatFaDate } from '@/lib/jalali'
import { toPersianDigits } from '@/lib/format'
import type { SpecialOffer } from '../types'

interface OfferBannerProps {
  offers: SpecialOffer[]
}

export function OfferBanner({ offers }: OfferBannerProps) {
  if (offers.length === 0) return null

  return (
    <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
      {offers.map((offer) => (
        <Link
          key={offer.id}
          to={offer.href}
          className="min-w-[min(85%,18.5rem)] max-w-[20rem] shrink-0 snap-start overflow-hidden rounded-[1.5rem] border border-navy-800 bg-navy-900 p-5 text-white shadow-lift transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:min-w-[22rem] sm:max-w-none"
        >
          <div className="flex items-start justify-between gap-3">
            <span
              className="max-w-[70%] truncate rounded-full bg-gold-500/20 px-2.5 py-1 text-[0.7rem] font-semibold text-gold-300"
              title={offer.badge}
            >
              {offer.badge}
            </span>
            <span className="font-display shrink-0 text-2xl font-extrabold text-gold-400">
              {toPersianDigits(offer.discountPercent)}٪
            </span>
          </div>
          <h3 className="font-display mt-4 truncate text-lg font-bold" title={offer.title}>
            {offer.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-7 text-white/75" title={offer.subtitle}>
            {offer.subtitle}
          </p>
          <div className="mt-4 flex items-center justify-between gap-2 text-xs text-white/60">
            <span className="min-w-0 truncate">تا {formatFaDate(offer.expiresAt)}</span>
            <span
              className="max-w-[55%] shrink-0 truncate rounded-lg bg-white/10 px-2 py-1 font-semibold tracking-wide text-gold-300"
              dir="ltr"
              title={offer.ctaLabel}
            >
              {offer.ctaLabel}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
