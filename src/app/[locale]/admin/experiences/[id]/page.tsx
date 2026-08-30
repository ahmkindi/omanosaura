import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { toDateString } from '@/data/serialize'
import { getProductReviewsAdmin } from '@/data/reviews'
import { ProductForm } from '@/components/admin/product-form'
import { ProductReviewsPanel } from '@/components/admin/product-reviews-panel'

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, reviews] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    getProductReviewsAdmin(id),
  ])
  if (!product) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" dir="ltr">
        Edit: {product.title}
      </h1>
      <ProductForm
        initial={{
          id: product.id,
          kind: product.kind,
          title: product.title,
          titleAr: product.titleAr,
          subtitle: product.subtitle,
          subtitleAr: product.subtitleAr,
          description: product.description,
          descriptionAr: product.descriptionAr,
          photo: product.photo,
          photos: product.photos,
          basePriceBaisa: Number(product.basePriceBaisa),
          extraPriceBaisa: Number(product.extraPriceBaisa),
          pricePer: product.pricePer,
          plannedDates: product.plannedDates.map(toDateString),
          longitude: product.longitude,
          latitude: product.latitude,
        }}
      />
      <ProductReviewsPanel reviews={reviews} />
    </div>
  )
}
