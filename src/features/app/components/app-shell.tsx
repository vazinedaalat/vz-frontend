import { useEffect, useId, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Menu, Scale, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { isMockEnabled } from '@/config/env'
import { APP_MOBILE_MORE_NAV, APP_MOBILE_PRIMARY_NAV, APP_NAV } from '../constants/nav'
import { useAuthStore } from '../store/auth-store'

export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const [moreOpen, setMoreOpen] = useState(false)
  const moreTitleId = useId()

  useEffect(() => {
    setMoreOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!moreOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMoreOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [moreOpen])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const moreActive = APP_MOBILE_MORE_NAV.some((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to),
  )

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
                        : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900',
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
            <div className="mx-auto grid max-w-lg grid-cols-5 gap-0.5 px-1.5 py-2">
              {APP_MOBILE_PRIMARY_NAV.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'flex min-h-11 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[0.62rem] font-medium',
                        isActive ? 'bg-navy-900 text-white' : 'text-navy-500',
                      )
                    }
                  >
                    <Icon className="size-4" strokeWidth={1.7} />
                    {item.label}
                  </NavLink>
                )
              })}
              <button
                type="button"
                aria-expanded={moreOpen}
                aria-controls="app-mobile-more"
                onClick={() => setMoreOpen((open) => !open)}
                className={cn(
                  'flex min-h-11 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[0.62rem] font-medium',
                  moreOpen || moreActive ? 'bg-navy-900 text-white' : 'text-navy-500',
                )}
              >
                <Menu className="size-4" strokeWidth={1.7} />
                بیشتر
              </button>
            </div>
          </nav>

          {moreOpen ? (
            <div className="fixed inset-0 z-50 lg:hidden" role="presentation">
              <button
                type="button"
                className="absolute inset-0 bg-navy-950/40"
                aria-label="بستن منو"
                onClick={() => setMoreOpen(false)}
              />
              <div
                id="app-mobile-more"
                role="dialog"
                aria-modal="true"
                aria-labelledby={moreTitleId}
                className="absolute inset-x-0 bottom-0 rounded-t-[1.5rem] border border-navy-200 bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-lift"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p id={moreTitleId} className="font-display text-base font-bold text-navy-900">
                      سایر بخش‌ها
                    </p>
                    <p className="mt-0.5 text-xs text-navy-500">اسناد، اطلاعیه‌ها و تخفیف‌ها</p>
                  </div>
                  <Button type="button" variant="ghost" size="icon" aria-label="بستن" onClick={() => setMoreOpen(false)}>
                    <X className="size-5" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {APP_MOBILE_MORE_NAV.map((item) => {
                    const Icon = item.icon
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          cn(
                            'flex min-h-14 items-center gap-3 rounded-2xl border px-3.5 py-3 text-sm font-medium transition-colors',
                            isActive
                              ? 'border-gold-400 bg-gold-100 text-navy-900'
                              : 'border-navy-200 bg-navy-50/60 text-navy-700 hover:border-gold-300',
                          )
                        }
                      >
                        <span className="inline-flex size-9 items-center justify-center rounded-xl bg-navy-900 text-gold-300">
                          <Icon className="size-4" strokeWidth={1.7} />
                        </span>
                        {item.label}
                      </NavLink>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
