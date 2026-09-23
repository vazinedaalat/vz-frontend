import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { Container } from '@/components/shared/container'
import { cn } from '@/lib/utils'
import { scrollToSection } from '@/utils/scroll'
import {
  LOGIN_PATH,
  CTA,
  NAV_LINKS,
  NAV_SECTION_IDS,
  SECTION_IDS,
  CONTACT_INFO,
  BLOG_PATH,
} from '../constants'
import { useActiveSection } from '../hooks/use-active-section'
import { useScrolled } from '../hooks/use-scrolled'
import { isHashNavHref, marketingNavSectionId, resolveMarketingNavHref } from '../lib/nav'
import { BrandMark } from './brand-mark'

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const scrolled = useScrolled(12)
  const activeSection = useActiveSection(NAV_SECTION_IDS)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const onHome = pathname === '/'
  const onBlog = pathname === BLOG_PATH || pathname.startsWith(`${BLOG_PATH}/`)

  const goHomeBrand = () => {
    setMenuOpen(false)
    if (onHome) {
      scrollToSection(SECTION_IDS.home)
      return
    }
    navigate('/')
  }

  const closeAndNavigate = (href: string) => {
    setMenuOpen(false)
    if (isHashNavHref(href)) {
      const id = href.slice(1)
      if (onHome) {
        scrollToSection(id)
        return
      }
      navigate({ pathname: '/', hash: id })
      return
    }
    navigate(href)
  }

  return (
    <header
      data-site-header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-300',
        scrolled
          ? 'border-navy-200/80 bg-white/95 shadow-soft backdrop-blur-xl'
          : 'border-transparent bg-white/80 backdrop-blur-md'
      )}
    >
      <a
        href={onHome ? `#${SECTION_IDS.home}` : '/'}
        className="bg-navy-900 text-gold-100 sr-only focus:not-sr-only focus:absolute focus:top-3 focus:right-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2"
      >
        پرش به محتوا
      </a>

      <Container className="flex h-[4.5rem] items-center justify-between gap-4 lg:h-[5.5rem]">
        <BrandMark href={onHome ? `#${SECTION_IDS.home}` : '/'} onClick={goHomeBrand} />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="منوی اصلی">
          {NAV_LINKS.map((link) => {
            const sectionId = marketingNavSectionId(link.href)
            const resolved = resolveMarketingNavHref(link.href, pathname)
            const isActive = sectionId
              ? onHome && activeSection === sectionId
              : link.href === BLOG_PATH
                ? onBlog
                : pathname === link.href

            return isHashNavHref(link.href) ? (
              <a
                key={link.href}
                href={resolved}
                onClick={(event) => {
                  event.preventDefault()
                  closeAndNavigate(link.href)
                }}
                className={cn(
                  'rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-navy-900 text-white'
                    : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900'
                )}
                aria-current={isActive ? 'location' : undefined}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-navy-900 text-white'
                    : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="outline" size="lg" asChild>
            <Link to={LOGIN_PATH}>{CTA.login}</Link>
          </Button>
          <Button variant="accent" size="lg" asChild>
            <a href={CONTACT_INFO.phoneHref}>{CTA.contact}</a>
          </Button>
        </div>

        <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Dialog.Trigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'}
            >
              {menuOpen ? <X /> : <Menu />}
            </Button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="data-[state=open]:animate-fade-in fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm" />
            <Dialog.Content
              className="fixed inset-y-0 right-0 z-50 flex w-[min(100%,22rem)] flex-col gap-8 bg-white p-6 text-navy-900 shadow-lift focus:outline-none"
              aria-describedby={undefined}
            >
              <div className="flex items-center justify-between">
                <Dialog.Title className="sr-only">منوی اصلی</Dialog.Title>
                <BrandMark href={onHome ? `#${SECTION_IDS.home}` : '/'} onClick={goHomeBrand} />
                <Dialog.Close asChild>
                  <Button variant="ghost" size="icon" aria-label="بستن منو">
                    <X />
                  </Button>
                </Dialog.Close>
              </div>

              <nav className="flex flex-col gap-1" aria-label="منوی موبایل">
                {NAV_LINKS.map((link) => {
                  const sectionId = marketingNavSectionId(link.href)
                  const resolved = resolveMarketingNavHref(link.href, pathname)
                  const isActive = sectionId
                    ? onHome && activeSection === sectionId
                    : link.href === BLOG_PATH
                      ? onBlog
                      : pathname === link.href

                  return isHashNavHref(link.href) ? (
                    <a
                      key={link.href}
                      href={resolved}
                      onClick={(event) => {
                        event.preventDefault()
                        closeAndNavigate(link.href)
                      }}
                      className={cn(
                        'rounded-2xl px-4 py-3 text-base font-medium transition-colors',
                        isActive
                          ? 'bg-navy-900 text-white'
                          : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900'
                      )}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        'rounded-2xl px-4 py-3 text-base font-medium transition-colors',
                        isActive
                          ? 'bg-navy-900 text-white'
                          : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900'
                      )}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </nav>

              <div className="mt-auto flex flex-col gap-3">
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link to={LOGIN_PATH} onClick={() => setMenuOpen(false)}>
                    {CTA.login}
                  </Link>
                </Button>
                <Button variant="accent" size="lg" className="w-full" asChild>
                  <a href={CONTACT_INFO.phoneHref} onClick={() => setMenuOpen(false)}>
                    {CTA.contact}
                  </a>
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </Container>
    </header>
  )
}
