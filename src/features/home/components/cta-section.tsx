import { Link } from 'react-router-dom'
import { LogIn, Phone } from 'lucide-react'
import { Button } from '@/components/ui'
import { Container } from '@/components/shared/container'
import { Reveal } from '@/components/animated/reveal'
import { CONTACT_INFO, CTA, LOGIN_PATH, SECTION_IDS } from '../constants'

export function CtaSection() {
  return (
    <section id={SECTION_IDS.contact} className="pb-14 sm:pb-16 lg:pb-24">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-navy-900 px-5 py-12 text-center text-white shadow-lift sm:rounded-[2rem] sm:px-12 sm:py-14 lg:px-20 lg:py-20">
            <div className="pointer-events-none absolute -top-24 right-10 size-72 rounded-full bg-gold-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-10 size-72 rounded-full bg-navy-500/40 blur-3xl" />

            <p className="relative text-sm font-semibold text-gold-300">آماده شروع هستید؟</p>
            <h2 className="font-display relative mx-auto mt-3 max-w-3xl text-2xl leading-[1.35] font-extrabold text-balance text-white sm:mt-4 sm:text-4xl lg:text-5xl">
              وارد اپ شوید یا همین حالا با ما تماس بگیرید
            </h2>
            <p className="relative mx-auto mt-5 max-w-2xl text-sm leading-8 text-white/80 sm:mt-6 sm:text-base lg:text-lg">
              پرونده را آنلاین پیگیری کنید؛ یا برای راهنمایی سریع، مستقیم با تیم حقوقی وزین عدالت در ارتباط
              باشید.
            </p>

            <div className="relative mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center">
              <Button variant="accent" size="xl" className="w-full sm:w-auto" asChild>
                <Link to={LOGIN_PATH}>
                  <LogIn />
                  {CTA.login}
                </Link>
              </Button>
              <Button variant="outlineOnDark" size="xl" className="w-full sm:w-auto" asChild>
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
