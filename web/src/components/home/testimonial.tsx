'use client'

import { useTranslations } from 'next-intl'
import { Star } from 'lucide-react'
import { Reveal } from '@/components/reveal'

export function Testimonial() {
  const t = useTranslations('home')

  return (
    <section className="bg-primary relative overflow-hidden py-16 text-white sm:py-24">
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -top-8 start-2 text-[12rem] leading-none text-white/5 select-none"
      >
        “
      </span>
      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          <div className="mb-5 flex justify-center gap-1" dir="ltr">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="fill-secondary text-secondary size-5" />
            ))}
          </div>
          <blockquote className="font-display text-xl leading-snug font-semibold text-balance sm:text-3xl">
            {t('reviewDesc')}
          </blockquote>
          <p className="mt-6 font-mono text-sm tracking-wider uppercase">
            {t('reviewName')}
            <span className="text-wadi"> · {t('reviewNameDesc')}</span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
