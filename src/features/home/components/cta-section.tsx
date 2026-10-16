import { Link } from 'react-router-dom'
import { LogIn, Phone } from 'lucide-react'
import { Button } from '@/components/ui'
import { Container } from '@/components/shared/container'
import { Reveal } from '@/components/animated/reveal'
import { CONTACT_INFO, CTA, LOGIN_PATH, SECTION_IDS } from '../constants'

export function CtaSection() {
  return (
    <section id={SECTION_IDS.contact} className="pb-16 sm:pb-20 lg:pb-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-navy-900 px-5 py-12 text-center text-white shadow-lift sm:rounded-[2rem] sm:px-12 sm:py-16 lg:px-20 lg:py-20">
            <div className="pointer-events-none absolute inset-3 rounded-[1.35rem] border border-white/10 sm:inset-4 sm:rounded-[1.6rem]" />
            <div className="pointer-events-none absolute -top-24 right-10 size-72 rounded-full bg-gold-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-10 size-72 rounded-full bg-navy-500/40 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-linear-to-l from-transparent via-gold-400/50 to-transparent" />

            <p className="relative text-[0.7rem] font-semibold tracking-[0.18em] text-gold-300 uppercase sm:text-xs">
              آماده شروع هستید؟
            </p>
            <h2 className="font-display relative mx-auto mt-4 max-w-3xl text-[1.65rem] leading-[1.35] font-extrabold tracking-tight text-balance text-white sm:mt-5 sm:text-4xl lg:text-[2.85rem] lg:leading-[1.2]">
              وارد اپ شوید یا همین حالا با ما تماس بگیرید
            </h2>
            <p className="relative mx-auto mt-5 max-w-2xl text-sm leading-8 text-white/75 sm:mt-6 sm:text-base lg:text-lg lg:leading-9">
              پرونده را آنلاین پیگیری کنید؛ یا برای راهنمایی سریع، مستقیم با تیم حقوقی وزین عدالت در ارتباط
              باشید.
            </p>

            <div className="relative mt-9 flex flex-col items-stretch justify-center gap-3 sm:mt-11 sm:flex-row sm:items-center">
              <Button variant="accent" size="xl" className="w-full rounded-2xl sm:w-auto" asChild>
                <Link to={LOGIN_PATH}>
                  <LogIn />
                  {CTA.login}
                </Link>
              </Button>
              <Button
                variant="outlineOnDark"
                size="xl"
                className="w-full rounded-2xl sm:w-auto"
                asChild
              >
                <a href={CONTACT_INFO.phoneHref}>
                  <Phone />
                  {CTA.contact}
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
