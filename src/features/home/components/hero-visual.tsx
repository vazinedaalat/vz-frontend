import { Scale } from 'lucide-react'

/** Abstract, non-photographic composition for the hero — scales, rings, and gold light. */
export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg lg:max-w-none" aria-hidden="true">
      <div className="bg-gold-300/40 absolute top-8 left-10 size-40 rounded-full blur-3xl" />
      <div className="bg-navy-400/20 absolute right-6 bottom-10 size-52 rounded-full blur-3xl" />

      <div className="absolute inset-8 rounded-full border border-navy-200/80" />
      <div className="absolute inset-16 rounded-full border border-dashed border-gold-400/50" />
      <div className="absolute inset-24 rounded-full border border-navy-100" />

      <div className="absolute top-1/2 left-1/2 grid size-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[2rem] bg-navy-900 text-gold-400 shadow-lift">
        <Scale className="size-16" strokeWidth={1.15} />
      </div>

      <div className="animate-float absolute top-10 right-4 rounded-2xl border border-border bg-white/90 px-4 py-3 shadow-soft backdrop-blur">
        <p className="text-gold-700 text-[0.7rem] font-semibold">لایحه‌نویسی تخصصی</p>
        <p className="font-display text-navy-900 text-sm font-bold">مستند به رویه قضایی</p>
      </div>

      <div
        className="animate-float absolute bottom-16 left-0 rounded-2xl border border-border bg-white/90 px-4 py-3 shadow-soft backdrop-blur"
        style={{ animationDelay: '1.4s' }}
      >
        <p className="text-gold-700 text-[0.7rem] font-semibold">مشاوره اولیه</p>
        <p className="font-display text-navy-900 text-sm font-bold">ارزیابی شفاف پرونده</p>
      </div>

      <div className="absolute top-1/3 left-4 size-2.5 rounded-full bg-gold-500" />
      <div className="absolute right-10 bottom-1/3 size-2 rounded-full bg-navy-400" />
    </div>
  )
}
