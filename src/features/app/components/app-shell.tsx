import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LogOut, Scale } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { isMockEnabled } from '@/config/env'
import { APP_NAV } from '../constants/nav'
import { useAuthStore } from '../store/auth-store'

export function AppShell() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-navy-50 text-navy-900">
      <div className="mx-auto flex min-h-screen max-w-(--container-page)">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-l border-navy-200 bg-white lg:flex">
          <div className="flex items-center gap-3 border-b border-navy-100 px-5 py-5">
            <span className="grid size-10 place-items-center rounded-2xl bg-navy-900 text-gold-400">
              <Scale className="size-5" strokeWidth={1.6} />
            </span>
            <div>
              <p className="font-display text-base font-extrabold">وزین عدالت</p>
              <p className="text-xs text-navy-500">پنل موکل</p>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="منوی اپ">
            {APP_NAV.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-navy-900 text-white'
                        : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900'
                    )
                  }
                >
                  <Icon className="size-4 shrink-0" strokeWidth={1.7} />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="border-t border-navy-100 p-4">
            <p className="truncate text-sm font-semibold">{user?.fullName ?? 'کاربر'}</p>
            <p className="mt-1 text-xs text-navy-500" dir="ltr">
              {user?.phone}
            </p>
            {!isMockEnabled ? (
              <p className="mt-2 text-[0.7rem] leading-5 text-navy-400">
                داده نمایشی در محیط تولید غیرفعال است.
              </p>
            ) : (
              <p className="mt-2 text-[0.7rem] leading-5 text-gold-700">حالت نمایشی · داده آزمایشی</p>
            )}
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={handleLogout}>
              <LogOut />
              خروج
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-navy-200/80 bg-white/95 backdrop-blur-xl lg:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-display text-sm font-bold">وزین عدالت</p>
                <p className="text-xs text-navy-500">{user?.fullName}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut />
                خروج
              </Button>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 pb-28 sm:px-6 lg:px-10 lg:py-8 lg:pb-10">
            <Outlet />
          </main>

          <nav
            className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-200 bg-white/95 backdrop-blur-xl lg:hidden"
            aria-label="ناوبری موبایل"
          >
            <div className="mx-auto grid max-w-lg grid-cols-4 gap-1 px-2 py-2">
              {APP_NAV.slice(0, 4).map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[0.65rem] font-medium',
                        isActive ? 'bg-navy-900 text-white' : 'text-navy-500'
                      )
                    }
                  >
                    <Icon className="size-4" strokeWidth={1.7} />
                    {item.label}
                  </NavLink>
                )
              })}
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}
