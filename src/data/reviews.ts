import 'server-only'
import { prisma } from '@/lib/db'
import { toDateString } from './serialize'

export const REVIEWS_PAGE_SIZE = 10

export type ReviewDTO = {
  productId: string
  userId: string
  rating: number
  title: string
  review: string
  lastUpdated: string
  userName: string
}

export async function getProductReviews(
  productId: string,
  page: number,
): Promise<ReviewDTO[]> {
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true } } },
    // lastUpdated is date-only, so ties are common — the userId tiebreak keeps
    // offset pagination stable (no dupes/skips across pages).
    orderBy: [{ lastUpdated: 'desc' }, { userId: 'asc' }],
    skip: (page - 1) * REVIEWS_PAGE_SIZE,
    take: REVIEWS_PAGE_SIZE,
  })
  return reviews.map((r) => ({
    productId: r.productId,
    userId: r.userId,
    rating: r.rating,
    title: r.title,
    review: r.review,
    lastUpdated: toDateString(r.lastUpdated),
    userName: r.user.name,
  }))
}

export type AdminReviewDTO = ReviewDTO & { userEmail: string }

/** All reviews for one product, for the admin moderation panel. */
export async function getProductReviewsAdmin(
  productId: string,
): Promise<AdminReviewDTO[]> {
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true, email: true } } },
    orderBy: [{ lastUpdated: 'desc' }, { userId: 'asc' }],
  })
  return reviews.map((r) => ({
    productId: r.productId,
    userId: r.userId,
    rating: r.rating,
    title: r.title,
    review: r.review,
    lastUpdated: toDateString(r.lastUpdated),
    userName: r.user.name,
    userEmail: r.user.email,
  }))
}
