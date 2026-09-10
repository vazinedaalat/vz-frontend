import { Link } from 'react-router-dom'
import { ArrowUpLeft } from 'lucide-react'
import { Button } from '@/components/ui'
import { BrandMark } from '../components/brand-mark'

/** Placeholder login surface — replace with real auth when the API is connected. */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-50 px-5">
      <div className="w-full max-w-md rounded-[2rem] border border-navy-200 bg-white p-8 text-navy-900 shadow-soft sm:p-10">
        <BrandMark />
        <h1 className="font-display mt-8 text-2xl font-bold text-navy-900">ورود به پنل آنلاین</h1>
        <p className="mt-3 text-sm leading-7 text-navy-600">
          به‌زودی پرونده را بدون حضور در دفتر، سریع و دقیق از همین‌جا پیگیری می‌کنید. تا فعال شدن سامانه، از صفحه اصلی مشاوره آنلاین بگیرید.
        </p>
        <Button variant="accent" size="lg" className="mt-8 w-full" asChild>
          <Link to="/">
            بازگشت به صفحه اصلی
            <ArrowUpLeft />
          </Link>
        </Button>
      </div>
    </div>
  )
}
