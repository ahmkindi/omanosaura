import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { thawani } from '@/lib/thawani'
import { fulfillPurchase, notifyOfPurchase } from '@/lib/fulfill'
import { env } from '@/env'

/**
 * Daily safety net: card purchases that never completed (missed webhook,
 * closed browser) are re-checked against Thawani for up to 7 days.
 */
export async function GET(request: NextRequest) {
  if (request.headers.get('authorization') !== `Bearer ${env.cronSecret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const pending = await prisma.purchase.findMany({
    where: {
      complete: false,
      paid: true, // card purchases only; cash completes at creation
      createdAt: { gte: weekAgo },
    },
    select: { id: true },
    take: 100,
  })

  let completed = 0
  for (const { id } of pending) {
    try {
      const session = await thawani.getSessionByClientReference(id)
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

  return NextResponse.json({ checked: pending.length, completed })
}
