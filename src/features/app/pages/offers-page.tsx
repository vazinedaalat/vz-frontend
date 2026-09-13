import { OfferBanner } from '../components/offer-banner'
import { AppEmptyState } from '../components/app-empty-state'
import { PageHeader } from '../components/page-header'
import { getSpecialOffers } from '../mocks/data'

export default function OffersPage() {
  const offers = getSpecialOffers()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="پیشنهاد ویژه"
        title="پیشنهادهای فعال"
        description="پکیج‌ها و تخفیف‌های محدود زمانی برای مشاوره و خدمات تنظیم اسناد."
      />
      {offers.length > 0 ? (
        <OfferBanner offers={offers} />
      ) : (
        <AppEmptyState
          title="پیشنهاد فعالی نیست"
          description="در محیط تولید، پیشنهادها از پنل مدیریت می‌آیند."
        />
      )}
    </div>
  )
}
