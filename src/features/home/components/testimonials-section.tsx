import { Quote, Star } from 'lucide-react'
import { Container } from '@/components/shared/container'
import { Reveal } from '@/components/animated/reveal'
import { SECTION_IDS, TESTIMONIALS } from '../constants'
import { SectionHeading } from './section-heading'

export function TestimonialsSection() {
  return (
    <section id={SECTION_IDS.testimonials} className="py-20 lg:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="نظر موکلین"
            title="اعتماد، بعد از نتیجه معنا پیدا می‌کند"
            description="نقل‌قول‌های زیر از موکلین پرونده‌های مختومه گردآوری شده و هویت آن‌ها برای حفظ محرمانگی خلاصه شده است."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {TESTIMONIALS.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.08}>
              <figure className="flex h-full flex-col rounded-[1.5rem] border border-navy-200 bg-white p-8 text-navy-900 shadow-soft">
                <Quote className="size-8 text-gold-500" strokeWidth={1.4} />
                <blockquote className="mt-5 flex-1 text-base leading-8 text-navy-800">{item.quote}</blockquote>
                <figcaption className="mt-8 flex items-center justify-between gap-4 border-t border-navy-100 pt-5">
                  <div>
                    <p className="font-display font-bold text-navy-900">{item.author}</p>
                    <p className="mt-1 text-sm text-navy-500">{item.role}</p>
                  </div>
                  <span className="flex items-center gap-0.5 text-gold-500" aria-label={`${item.rating} از ۵`}>
                    {Array.from({ length: item.rating }, (_, starIndex) => (
                      <Star key={starIndex} className="size-4 fill-current" />
                    ))}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
