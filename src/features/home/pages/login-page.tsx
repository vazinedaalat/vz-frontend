import { Link } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { Button } from '@/components/ui'
import { BrandMark } from '../components/brand-mark'
import { CONTACT_INFO, CTA } from '../constants'

/** Placeholder login surface — replace with real auth when the API is connected. */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-50 px-5">
      <div className="w-full max-w-md rounded-[2rem] border border-navy-200 bg-white p-8 text-navy-900 shadow-soft sm:p-10">
        <BrandMark />
        <h1 className="font-display mt-8 text-2xl font-bold text-navy-900">{CTA.login}</h1>
        <p className="mt-3 text-sm leading-7 text-navy-600">
          سامانه ورود به‌زودی فعال می‌شود. تا آن زمان می‌توانید برای پیگیری پرونده یا دریافت راهنمایی، با ما تماس بگیرید.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Button variant="accent" size="lg" className="w-full" asChild>
            <a href={CONTACT_INFO.phoneHref}>
              <Phone />
              {CTA.contact}
            </a>
          </Button>
          <Button variant="outline" size="lg" className="w-full" asChild>
            <Link to="/">بازگشت به صفحه اصلی</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
