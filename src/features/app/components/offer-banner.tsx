import { Link } from 'react-router-dom'
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
          className="min-w-[85%] snap-start rounded-[1.5rem] border border-navy-800 bg-navy-900 p-5 text-white shadow-lift transition-transform hover:-translate-y-0.5 sm:min-w-[22rem]"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-full bg-gold-500/20 px-2.5 py-1 text-[0.7rem] font-semibold text-gold-300">
              {offer.badge}
            </span>
            <span className="font-display text-2xl font-extrabold text-gold-400">
              {offer.discountPercent}٪
            </span>
          </div>
          <h3 className="font-display mt-4 text-lg font-bold">{offer.title}</h3>
          <p className="mt-2 text-sm leading-7 text-white/75">{offer.subtitle}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-white/60">
            <span>تا {offer.expiresAt}</span>
            <span className="font-semibold text-gold-300">{offer.ctaLabel}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
