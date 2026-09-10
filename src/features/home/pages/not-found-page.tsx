import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui'
import { BrandMark } from '../components/brand-mark'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-navy-50 px-5 text-center text-navy-900">
      <BrandMark />
      <p className="font-display text-6xl font-extrabold text-navy-900">۴۰۴</p>
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold text-navy-900">صفحه مورد نظر پیدا نشد</h1>
        <p className="max-w-md text-sm leading-7 text-navy-500">
          نشانی واردشده وجود ندارد یا جابه‌جا شده است. می‌توانید به صفحه اصلی وزین عدالت بازگردید.
        </p>
      </div>
      <Button variant="accent" size="lg" asChild>
        <Link to="/">
          <Home />
          بازگشت به خانه
        </Link>
      </Button>
    </div>
  )
}
