import 'server-only'
import { prisma } from '@/lib/db'
import { toProductDTO, type ProductDTO } from './serialize'

type Aggregates = Map<
  string,
  { rating: number; ratingCount: number; reviewCount: number }
>

async function reviewAggregates(productIds?: string[]): Promise<Aggregates> {
  const where = productIds ? { productId: { in: productIds } } : {}
  const [ratings, titled] = await Promise.all([
    prisma.review.groupBy({
      by: ['productId'],
      where,
      _avg: { rating: true },
      _count: { _all: true },
    }),
    prisma.review.groupBy({
      by: ['productId'],
      where: { ...where, title: { not: '' } },
      _count: { _all: true },
    }),
  ])
  const agg: Aggregates = new Map()
  for (const r of ratings) {
    agg.set(r.productId, {
      rating: r._avg.rating ?? 0,
      ratingCount: r._count._all,
      reviewCount: 0,
    })
  }
  for (const r of titled) {
    const entry = agg.get(r.productId)
    if (entry) entry.reviewCount = r._count._all
  }
  return agg
}

const NO_AGG = { rating: 0, ratingCount: 0, reviewCount: 0 }

export async function getProducts(): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    orderBy: { lastUpdated: 'desc' },
  })
  const agg = await reviewAggregates(products.map((p) => p.id))
  return products.map((p) => toProductDTO(p, agg.get(p.id) ?? NO_AGG))
}

export async function getProduct(
  id: string,
): Promise<(ProductDTO & { purchasesCount: number }) | null> {
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product || product.isDeleted) return null
  const [agg, purchasesCount] = await Promise.all([
    reviewAggregates([id]),
    prisma.purchase.count({ where: { productId: id } }),
  ])
  return { ...toProductDTO(product, agg.get(id) ?? NO_AGG), purchasesCount }
}

export async function getProductIds(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: { isDeleted: false },
    select: { id: true },
  })
  return rows.map((r) => r.id)
}
