import type { Metadata } from 'next'
import { Suspense } from 'react'
import { localeAlternates } from '@/lib/seo'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getProducts } from '@/data/products'
import { ExperiencesExplorer } from '@/components/experiences/explorer'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'experiences' })
  return {
    title: t('title').split('|')[0].trim(),
    alternates: localeAlternates('/experiences'),
  }
}

export default async function ExperiencesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, tc, products] = await Promise.all([
    getTranslations('experiences'),
    getTranslations('common'),
    getProducts(),
  ])

  return (
    <main className="bg-sand min-h-svh">
      <header className="bg-night relative overflow-hidden px-5 py-12 text-white sm:py-16">
        <div
          aria-hidden
          className="bg-wadi/10 absolute -top-20 -end-20 size-72 rounded-full blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-wadi mb-2 font-mono text-xs tracking-[0.3em] uppercase">
            {'23.58°N 58.38°E'}
          </p>
          <h1 className="font-display text-4xl font-bold uppercase sm:text-5xl">
            {t('title').split('|')[0]}
          </h1>
          <p className="mt-2 max-w-2xl text-white/65">{tc('description')}</p>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8 sm:py-10">
        <Suspense>
          <ExperiencesExplorer products={products} />
        </Suspense>
      </div>
    </main>
  )
}
