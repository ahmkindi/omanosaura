import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getProducts } from '@/data/products'
import { ProductCard } from '@/components/experiences/product-card'
import { ExperiencesExplorer } from '@/components/experiences/explorer'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'experiences' })
  return { title: t('title') }
}

export default async function ExperiencesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, products] = await Promise.all([
    getTranslations('experiences'),
    getProducts(),
  ])

  const cards: Record<string, ReactNode> = {}
  for (const p of products) {
    cards[p.id] = <ProductCard key={p.id} product={p} />
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-12">
      <header className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">{t('title').split('|')[0]}</h1>
        <p className="text-muted-foreground">{t('threeProducts')}</p>
      </header>
      <ExperiencesExplorer products={products} cards={cards} />
    </main>
  )
}
