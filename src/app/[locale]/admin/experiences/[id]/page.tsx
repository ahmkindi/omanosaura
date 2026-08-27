import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { toDateString } from '@/data/serialize'
import { ProductForm } from '@/components/admin/product-form'

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })
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
    </div>
  )
}
