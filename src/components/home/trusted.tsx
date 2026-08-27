'use client'

import { useMessages, useTranslations } from 'next-intl'
import { Landmark } from 'lucide-react'
import { Reveal } from '@/components/reveal'

export function Trusted() {
  const t = useTranslations('home.trusted')
  const messages = useMessages() as {
    home?: { partners?: string[] }
  }
  const partners = messages.home?.partners ?? []

  return (
    <section className="bg-sand px-5 pb-16 sm:pb-24">
      <div className="mx-auto max-w-6xl space-y-8">
        <Reveal>
          <h2 className="font-display text-3xl font-bold uppercase sm:text-5xl">
            {t('title')}
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">{t('sub')}</p>
        </Reveal>

        <Reveal index={1}>
          <ul className="flex flex-wrap gap-2.5">
            {partners.map((name) => (
              <li
                key={name}
                className="border-primary/15 text-primary rounded-full border bg-white px-4 py-2 text-sm font-medium"
              >
                {name}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal index={2}>
          <div className="bg-primary flex flex-col gap-4 rounded-3xl p-6 text-white sm:flex-row sm:items-center sm:p-8">
            <Landmark className="text-secondary size-10 shrink-0" />
            <div>
              <h3 className="font-display text-xl font-bold">{t('ainTitle')}</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/75">
                {t('ainDesc')}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal index={3}>
          <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
            {t('license')} · {t('tagline')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
