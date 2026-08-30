import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { sendTripReminder, sendReviewRequest } from '@/lib/purchase-notify'
import { env } from '@/env'

/**
 * Daily booking emails (09:00 Muscat):
 *  - trip reminders for confirmed bookings 1–3 days out
 *  - review requests the days after the trip
 * Windows (not exact-day matches) tolerate missed cron runs; the *SentAt
 * columns provide claim-then-send idempotency so a re-run never re-emails.
 */
export async function GET(request: NextRequest) {
  if (request.headers.get('authorization') !== `Bearer ${env.cronSecret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // chosenDate is a calendar date stored at midnight UTC — build the window
  // bounds the same way, never via local-time conversions.
  const now = new Date()
  const todayUtc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  )
  const day = 86_400_000
  const utcDate = (offsetDays: number) => new Date(todayUtc + offsetDays * day)

  let reminders = 0
  const upcoming = await prisma.purchase.findMany({
    where: {
      status: 'confirmed',
      reminderSentAt: null,
      chosenDate: { gte: utcDate(1), lte: utcDate(3) },
    },
    select: { id: true },
    take: 100,
  })
  for (const { id } of upcoming) {
    const claimed = await prisma.purchase.updateMany({
      where: { id, reminderSentAt: null },
      data: { reminderSentAt: now },
    })
    if (claimed.count === 0) continue
    try {
      await sendTripReminder(id)
      reminders++
    } catch (error) {
      console.error(`booking-emails: reminder failed for ${id}`, error)
    }
  }

  let reviews = 0
  const past = await prisma.purchase.findMany({
    where: {
      status: 'confirmed',
      reviewRequestSentAt: null,
      chosenDate: { gte: utcDate(-3), lte: utcDate(-1) },
    },
    select: { id: true },
    take: 100,
  })
  for (const { id } of past) {
    const claimed = await prisma.purchase.updateMany({
      where: { id, reviewRequestSentAt: null },
      data: { reviewRequestSentAt: now },
    })
    if (claimed.count === 0) continue
    try {
      await sendReviewRequest(id)
      reviews++
    } catch (error) {
      console.error(`booking-emails: review request failed for ${id}`, error)
    }
  }

  return NextResponse.json({ reminders, reviews })
}
