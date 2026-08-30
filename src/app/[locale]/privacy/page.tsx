import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacy' })
  return {
    title: t('pageTitle'),
    description: t('desc'),
    alternates: localeAlternates('/privacy'),
  }
}

// Section key + number of paragraphs, matching messages/{en,ar}.json privacy.sections.
const SECTIONS = [
  { key: 'collected', ps: 3 },
  { key: 'use', ps: 2 },
  { key: 'processors', ps: 4 },
  { key: 'payments', ps: 1 },
  { key: 'retention', ps: 2 },
  { key: 'rights', ps: 2 },
  { key: 'contact', ps: 1 },
] as const

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('privacy')

  return (
    <main className="mx-auto max-w-3xl space-y-10 px-4 py-12">
      <header className="space-y-4">
        <h1 className="font-display text-4xl font-bold uppercase sm:text-5xl">
          {t('pageTitle')}
        </h1>
        <p className="text-muted-foreground">{t('updated')}</p>
        <p className="leading-relaxed">{t('intro')}</p>
      </header>

      {SECTIONS.map(({ key, ps }, i) => (
        <section key={key} className="space-y-3">
          <h2 className="font-display text-xl font-bold sm:text-2xl">
            {i + 1}. {t(`sections.${key}.title`)}
          </h2>
          {Array.from({ length: ps }, (_, n) => (
            <p key={n} className="text-muted-foreground leading-relaxed">
              {t(`sections.${key}.p${n + 1}`)}
            </p>
          ))}
        </section>
      ))}
    </main>
  )
}
