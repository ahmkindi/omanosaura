import { getTranslations, setRequestLocale } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'
import { getProducts } from '@/data/products'
import { Hero } from '@/components/home/hero'
import { Featured } from '@/components/home/featured'
import { Kinds } from '@/components/home/kinds'
import { WhyUs } from '@/components/home/why-us'
import { Testimonial } from '@/components/home/testimonial'
import { TailoredCta } from '@/components/home/tailored-cta'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  return {
    description: t('description'),
    alternates: localeAlternates(''),
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const products = await getProducts()

  const featured = [...products]
    .sort((a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount)
    .slice(0, 6)

  return (
    <main>
      <Hero
        trips={products.map((p) => ({
          id: p.id,
          title: p.title,
          titleAr: p.titleAr,
          photo: p.photo,
          latitude: p.latitude,
          longitude: p.longitude,
          basePriceBaisa: p.basePriceBaisa,
        }))}
      />
      <Featured products={featured} />
      <Kinds />
      <WhyUs />
      <Testimonial />
      <TailoredCta />
    </main>
  )
}
