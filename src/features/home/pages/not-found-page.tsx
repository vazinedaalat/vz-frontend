import { Link } from 'react-router-dom'
import { LogIn, Phone } from 'lucide-react'
import { Button } from '@/components/ui'
import { BrandMark } from '../components/brand-mark'
import { CONTACT_INFO, CTA, LOGIN_PATH } from '../constants'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-navy-50 px-5 text-center text-navy-900">
      <BrandMark />
      <p className="font-display text-6xl font-extrabold text-navy-900">۴۰۴</p>
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold text-navy-900">صفحه مورد نظر پیدا نشد</h1>
        <p className="max-w-md text-sm leading-7 text-navy-600">
          نشانی واردشده وجود ندارد. می‌توانید وارد اپ شوید یا برای راهنمایی با ما تماس بگیرید.
        </p>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
        <Button variant="accent" size="lg" asChild>
          <Link to={LOGIN_PATH}>
            <LogIn />
            {CTA.login}
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <a href={CONTACT_INFO.phoneHref}>
            <Phone />
            {CTA.contact}
          </a>
        </Button>
      </div>
    </div>
  )
}
