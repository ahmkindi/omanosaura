import Image from 'next/image'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MapPin, Users } from 'lucide-react'
import { getProduct, getProductIds } from '@/data/products'
import { getProductReviews } from '@/data/reviews'
import { routing } from '@/i18n/routing'
import { pickLocalized } from '@/lib/localized'
import { formatOMR } from '@/lib/price'
import { StarRating } from '@/components/star-rating'
import { RichContent } from '@/components/rich-content'
import { Gallery } from '@/components/experiences/gallery'
import { ReviewsSection } from '@/components/experiences/reviews-section'
import { PurchaseCard } from '@/components/experiences/purchase-card'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const ids = await getProductIds()
  return routing.locales.flatMap((locale) => ids.map((id) => ({ locale, id })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  const product = await getProduct(id)
  if (!product) return {}
  return {
    title: pickLocalized(product, 'title', locale),
    description: pickLocalized(product, 'subtitle', locale),
    openGraph: { images: [product.photo] },
  }
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)
  const [t, product, reviews] = await Promise.all([
    getTranslations('experiences'),
    getProduct(id),
    getProductReviews(id, 1),
  ])
  if (!product) notFound()

  const title = pickLocalized(product, 'title', locale)

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-muted-foreground text-lg">
          {pickLocalized(product, 'subtitle', locale)}
        </p>
        <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
          {product.ratingCount > 0 && (
            <StarRating rating={product.rating} count={product.ratingCount} />
          )}
          <span className="inline-flex items-center gap-1">
            <Users className="size-4" /> {product.purchasesCount}
          </span>
          <a
            className="inline-flex items-center gap-1 hover:underline"
            href={`https://maps.google.com/?q=${product.latitude},${product.longitude}`}
            target="_blank"
            rel="noreferrer"
          >
            <MapPin className="size-4" /> {product.latitude.toFixed(3)},{' '}
            {product.longitude.toFixed(3)}
          </a>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
            <Image
              src={product.photo}
              alt={title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
          </div>
          <RichContent html={pickLocalized(product, 'description', locale)} />
          {product.photos.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">{t('gallery')}</h2>
              <Gallery photos={product.photos} title={title} />
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Suspense>
            <PurchaseCard
            product={{
              id: product.id,
              title,
              basePriceBaisa: product.basePriceBaisa,
              extraPriceBaisa: product.extraPriceBaisa,
              pricePer: product.pricePer,
              plannedDates: product.plannedDates,
            }}
            />
          </Suspense>
        </aside>
      </div>

      <ReviewsSection productId={product.id} initialReviews={reviews} />
    </main>
  )
}
