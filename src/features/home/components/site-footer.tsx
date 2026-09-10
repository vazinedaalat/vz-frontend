import { Mail, MapPin, Phone } from 'lucide-react'
import { Container } from '@/components/shared/container'
import { toPersianDigits } from '@/lib/format'
import { scrollToSection } from '@/utils/scroll'
import {
  BRAND,
  CONTACT_INFO,
  FOOTER_HIGHLIGHTS,
  NAV_LINKS,
} from '../constants'
import { BrandMark } from './brand-mark'

export function SiteFooter() {
  const year = toPersianDigits(new Date().getFullYear())

  return (
    <footer className="border-t border-navy-800 bg-navy-900 text-white">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_1fr] lg:gap-16">
          <div>
            <BrandMark tone="dark" />
            <p className="text-navy-200 mt-6 max-w-sm text-sm leading-7">
              مؤسسه خدمات حقوقی و قضایی {BRAND.name}؛ همراهی تخصصی از مشاوره تا صدور حکم، با تأکید بر
              شفافیت، محرمانگی و نتیجه.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {FOOTER_HIGHLIGHTS.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id} className="flex items-center gap-2 text-sm text-gold-300">
                    <Icon className="size-4" strokeWidth={1.7} />
                    {item.label}
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-lg font-bold text-white">دسترسی سریع</h2>
            <nav className="mt-5 flex flex-col gap-2" aria-label="لینک‌های فوتر">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => {
                    event.preventDefault()
                    scrollToSection(link.href.slice(1))
                  }}
                  className="text-navy-200 w-fit text-sm transition-colors hover:text-gold-400"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="font-display text-lg font-bold text-white">تماس با ما</h2>
            <ul className="mt-5 flex flex-col gap-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-gold-400" strokeWidth={1.7} />
                <a href={CONTACT_INFO.phoneHref} className="text-navy-100 hover:text-gold-400" dir="ltr">
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-gold-400" strokeWidth={1.7} />
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-navy-100 hover:text-gold-400"
                  dir="ltr"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold-400" strokeWidth={1.7} />
                <span className="text-navy-200 leading-7">{CONTACT_INFO.address}</span>
              </li>
            </ul>
            <p className="text-navy-300 mt-5 text-sm">{CONTACT_INFO.workingHours}</p>
          </div>
        </div>

        <div className="text-navy-300 mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {BRAND.name}. کلیه حقوق محفوظ است.
          </p>
          <p>طراحی‌شده برای ارائه خدمات حقوقی حرفه‌ای و قابل اعتماد.</p>
        </div>
      </Container>
    </footer>
  )
}
