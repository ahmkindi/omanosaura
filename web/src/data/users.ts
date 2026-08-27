import 'server-only'
import { prisma } from '@/lib/db'
import { toDateString } from './serialize'

export type AdminUserDTO = {
  id: string
  email: string
  name: string
  phone: string
  role: 'none' | 'admin' | 'writer'
  avgRating: number | null
  lastTrip: string | null
  purchaseCount: number
}

export async function getAllUsers(): Promise<AdminUserDTO[]> {
  const [users, ratings, trips] = await Promise.all([
    prisma.user.findMany({ orderBy: { id: 'asc' } }),
    prisma.review.groupBy({ by: ['userId'], _avg: { rating: true } }),
    prisma.purchase.groupBy({
      by: ['userId'],
      where: { complete: true },
      _max: { chosenDate: true },
      _count: { _all: true },
    }),
  ])

  const ratingMap = new Map(ratings.map((r) => [r.userId, r._avg.rating]))
  const tripMap = new Map(
    trips.map((t) => [
      t.userId,
      { last: t._max.chosenDate, count: t._count._all },
    ]),
  )

  return users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    phone: u.phone,
    role: u.role,
    avgRating: ratingMap.get(u.id) ?? null,
    lastTrip: tripMap.get(u.id)?.last
      ? toDateString(tripMap.get(u.id)!.last!)
      : null,
    purchaseCount: tripMap.get(u.id)?.count ?? 0,
  }))
}
