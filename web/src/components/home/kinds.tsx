'use client'

import { useTranslations } from 'next-intl'
import { GraduationCap, Mountain, Users2 } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Reveal } from '@/components/reveal'

const KINDS = [
  { key: 'exp', icon: Mountain },
  { key: 'team', icon: Users2 },
  { key: 'school', icon: GraduationCap },
] as const

export function Kinds() {
  const t = useTranslations('common')
  const th = useTranslations('experiences')
  const thome = useTranslations('home')

  return (
    <section className="bg-night py-16 text-white sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <h2 className="font-display mb-2 text-3xl font-bold uppercase sm:text-5xl">
            {thome('services')}
          </h2>
          <p className="mb-10 max-w-2xl text-white/60">{th('threeProducts')}</p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {KINDS.map(({ key, icon: Icon }, i) => (
            <Reveal key={key} index={i}>
              <Link
                href={key === 'exp' ? '/experiences' : '/contact'}
                className="group hover:border-secondary/60 block h-full rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors sm:p-8"
              >
                <Icon className="text-secondary mb-4 size-9 transition-transform duration-300 group-hover:-translate-y-1" />
                <h3 className="font-display text-xl font-bold">
                  {t(`productkind.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {t(`productkind.${key}.desc`)}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
