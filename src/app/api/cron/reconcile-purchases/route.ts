import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { thawani } from '@/lib/thawani'
import { fulfillPurchase, notifyOfPurchase } from '@/lib/fulfill'
import { env } from '@/env'

/**
 * Daily safety net: card purchases that never completed (missed webhook,
 * closed browser) are re-checked against Thawani for up to 7 days, then
 * expired so they stop cluttering the pending list.
 */
export async function GET(request: NextRequest) {
  if (request.headers.get('authorization') !== `Bearer ${env.cronSecret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const pending = await prisma.purchase.findMany({
    where: {
      status: 'pending',
      paid: true, // card purchases only; cash confirms at creation
      createdAtTs: { gte: weekAgo },
    },
    select: { id: true, thawaniSessionId: true },
    take: 100,
  })

  let completed = 0
  for (const { id, thawaniSessionId } of pending) {
    try {
      // Prefer the exact session — a payment retry can create several
      // sessions per client reference.
      const session = thawaniSessionId
        ? await thawani.getSession(thawaniSessionId)
        : await thawani.getSessionByClientReference(id)
      if (session.payment_status === 'paid') {
        if (await fulfillPurchase(id)) {
          completed++
          await notifyOfPurchase(id)
        }
      }
    } catch (error) {
      console.error(`reconcile: failed for ${id}`, error)
    }
  }

  const expired = await prisma.purchase.updateMany({
    where: { status: 'pending', createdAtTs: { lt: weekAgo } },
    data: { status: 'expired' },
  })

  return NextResponse.json({
    checked: pending.length,
    completed,
    expired: expired.count,
  })
}
