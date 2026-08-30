'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { containsProfanity } from '@/lib/profanity'
import { getProductReviews, type ReviewDTO } from '@/data/reviews'
import { toDateString } from '@/data/serialize'

export async function fetchReviews(
  productId: string,
  page: number,
): Promise<ReviewDTO[]> {
  const parsed = z
    .object({ productId: z.string().min(1), page: z.number().int().min(1) })
    .safeParse({ productId, page })
  if (!parsed.success) return []
  return getProductReviews(parsed.data.productId, parsed.data.page)
}

export type MyReview = {
  rating: number
  title: string
  review: string
  lastUpdated: string
} | null

export async function getMyReview(productId: string): Promise<MyReview> {
  let user
  try {
    user = await requireUser()
  } catch {
    return null
  }
  const review = await prisma.review.findUnique({
    where: { productId_userId: { productId, userId: user.id } },
  })
  return review
    ? {
        rating: review.rating,
        title: review.title,
        review: review.review,
        lastUpdated: toDateString(review.lastUpdated),
      }
    : null
}

const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().gt(0).max(5),
  title: z.string().max(200),
  review: z.string().max(5000),
})

export type ReviewInput = z.infer<typeof reviewSchema>

function revalidateProduct(productId: string) {
  for (const prefix of ['', '/ar']) {
    revalidatePath(`${prefix}/experiences/${productId}`)
    revalidatePath(`${prefix}/experiences`)
  }
}

export async function upsertReview(
  input: ReviewInput,
): Promise<{ ok: boolean; error?: 'not-allowed' | 'invalid' | 'profane' }> {
  let user
  try {
    user = await requireUser()
  } catch {
    return { ok: false, error: 'not-allowed' }
  }

  const parsed = reviewSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const { productId, rating, title, review } = parsed.data

  if (containsProfanity(title) || containsProfanity(review)) {
    return { ok: false, error: 'profane' }
  }

  // Any signed-in user may review; the (productId, userId) unique key caps it
  // at one review per user per trip (upsert edits in place).
  const exists = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  })
  if (!exists) return { ok: false, error: 'invalid' }

  await prisma.review.upsert({
    where: { productId_userId: { productId, userId: user.id } },
    update: { rating, title, review, lastUpdated: new Date() },
    create: { productId, userId: user.id, rating, title, review },
  })
  revalidateProduct(productId)
  return { ok: true }
}

export async function deleteReview(
  productId: string,
): Promise<{ ok: boolean }> {
  let user
  try {
    user = await requireUser()
  } catch {
    return { ok: false }
  }
  await prisma.review
    .delete({
      where: { productId_userId: { productId, userId: user.id } },
    })
    .catch(() => {})
  revalidateProduct(productId)
  return { ok: true }
}
