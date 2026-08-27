'use client'

import { useTranslations } from 'next-intl'
import { ShieldCheck, Sparkles, Users } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const ITEMS = [
  { icon: Users, title: 'whyUsTitle1', desc: 'whyUsDesc1' },
  { icon: Sparkles, title: 'whyUsTitle2', desc: 'whyUsDesc2' },
  { icon: ShieldCheck, title: 'whyUsTitle3', desc: 'whyUsDesc3' },
] as const

export function WhyUs() {
  const t = useTranslations('home')

  return (
    <section className="bg-sand py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <h2 className="font-display mb-10 text-3xl font-bold uppercase sm:text-5xl">
            {t('whyUs')}
          </h2>
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          {ITEMS.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} index={i}>
              <div className="border-secondary/70 border-s-2 ps-5">
                <Icon className="text-primary mb-3 size-7" />
                <h3 className="font-display text-lg font-bold">{t(title)}</h3>
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                  {t(desc)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
