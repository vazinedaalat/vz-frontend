import { PhoneCall } from 'lucide-react'
import { Button } from '@/components/ui'
import { CONTACT_INFO, CTA } from '@/features/home/constants'

/** Help strip above case intake — contact when the client cannot complete the form. */
export function CaseFormHelpBanner() {
  return (
    <aside className="overflow-hidden rounded-[1.5rem] border border-navy-200 bg-gradient-to-l from-navy-900 via-navy-800 to-navy-900 p-5 text-white shadow-soft sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[0.7rem] font-semibold tracking-wide text-gold-300">راهنمای تکمیل فرم</p>
          <h2 className="font-display mt-2 text-lg font-bold sm:text-xl">
            در تکمیل فرم مشکل دارید یا مطمئن نیستید چه بنویسید؟
          </h2>
          <p className="mt-2 text-sm leading-7 text-white/75">
            اگر نمی‌دانید فیلدها را چگونه پر کنید یا پرونده‌تان پیچیده است، با کارشناسان حقوقی وزین عدالت تماس
            بگیرید تا مرحله‌به‌مرحله راهنمایی شوید.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={CONTACT_INFO.phoneHref}
            dir="ltr"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-gold-200 transition hover:border-gold-400/50 hover:bg-white/10"
          >
            <PhoneCall className="size-4" aria-hidden />
            {CONTACT_INFO.phone}
          </a>
          <Button asChild variant="accent" size="lg" className="w-full sm:w-auto">
            <a href={CONTACT_INFO.phoneHref}>
              <PhoneCall className="size-4" aria-hidden />
              {CTA.contact}
            </a>
          </Button>
        </div>
      </div>
    </aside>
  )
}
