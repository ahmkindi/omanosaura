'use server'

import { randomUUID } from 'node:crypto'
import { after } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireUser, rememberUserLocale } from '@/lib/auth'
import { computeCostBaisa } from '@/lib/pricing'
import { canModifyBooking } from '@/lib/booking-policy'
import { createCheckoutForPurchase } from '@/lib/checkout'
import { refundPurchase } from '@/lib/refund'
import {
  notifyOfPurchase,
  notifyOfCancellation,
  notifyOfReschedule,
  sendRefundActionRequired,
} from '@/lib/purchase-notify'

const purchaseSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(100),
  chosenDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  cash: z.boolean(),
  payExtra: z.boolean(),
})

export type PurchaseInput = z.infer<typeof purchaseSchema>

export type PurchaseResult =
  | { ok: true; cash: true }
  | { ok: true; cash: false; redirectUrl: string }
  | { ok: false; error: 'invalid' | 'too-early' | 'unauthorized' | 'failed' }

const MIN_TOTAL_BAISA = 100

// Legacy rule: bookings must be at least one day out.
function isBeforeTomorrow(chosenDate: string | Date): boolean {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const date =
    typeof chosenDate === 'string'
      ? new Date(`${chosenDate}T00:00:00Z`)
      : chosenDate
  return date < new Date(tomorrow.toISOString().slice(0, 10))
}

export async function purchaseProduct(
  input: PurchaseInput,
): Promise<PurchaseResult> {
  let user
  try {
    user = await requireUser()
  } catch {
    return { ok: false, error: 'unauthorized' }
  }

  const parsed = purchaseSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const { productId, quantity, chosenDate, cash, payExtra } = parsed.data

  if (isBeforeTomorrow(chosenDate)) {
    return { ok: false, error: 'too-early' }
  }

  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product || product.isDeleted) return { ok: false, error: 'invalid' }

  const costBaisa = computeCostBaisa({
    quantity,
    basePriceBaisa: Number(product.basePriceBaisa),
    extraPriceBaisa: Number(product.extraPriceBaisa),
    pricePer: product.pricePer,
    payExtra,
  })
  if (costBaisa < MIN_TOTAL_BAISA) return { ok: false, error: 'invalid' }

  const purchaseId = randomUUID()
  try {
    await prisma.purchase.create({
      data: {
        id: purchaseId,
        productId: product.id,
        userId: user.id,
        numOfParticipants: quantity,
        paid: !cash,
        costBaisa,
        chosenDate: new Date(`${chosenDate}T00:00:00Z`),
        status: cash ? 'confirmed' : 'pending',
        complete: cash,
        extraPriceChosen: payExtra,
      },
    })
  } catch (error) {
    console.error('purchase insert failed', error)
    return { ok: false, error: 'failed' }
  }

  after(() => rememberUserLocale(user.id))

  if (cash) {
    after(() => notifyOfPurchase(purchaseId))
    return { ok: true, cash: true }
  }

  try {
    const redirectUrl = await createCheckoutForPurchase({
      purchaseId,
      costBaisa,
      participants: quantity,
      product,
      user,
    })
    return { ok: true, cash: false, redirectUrl }
  } catch (error) {
    console.error('thawani session failed', error)
    return { ok: false, error: 'failed' }
  }
}

const cancelSchema = z.object({ purchaseId: z.uuid() })

export type CancelInput = z.infer<typeof cancelSchema>

export type CancelResult =
  | { ok: true; refund: 'none' | 'refunded' | 'processing' }
  | {
      ok: false
      error:
        | 'invalid'
        | 'unauthorized'
        | 'not-found'
        | 'too-late'
        | 'conflict'
        | 'failed'
    }

export async function cancelPurchase(input: CancelInput): Promise<CancelResult> {
  let user
  try {
    user = await requireUser()
  } catch {
    return { ok: false, error: 'unauthorized' }
  }

  const parsed = cancelSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const { purchaseId } = parsed.data

  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
  })
  if (!purchase || purchase.userId !== user.id) {
    return { ok: false, error: 'not-found' }
  }
  if (purchase.status !== 'confirmed' && purchase.status !== 'pending') {
    return { ok: false, error: 'conflict' }
  }
  // A pending booking took no money, so cancelling it is always allowed.
  if (purchase.status === 'confirmed' && !canModifyBooking(purchase.chosenDate)) {
    return { ok: false, error: 'too-late' }
  }

  after(() => rememberUserLocale(user.id))

  const now = new Date()

  // Cash bookings and unpaid card bookings: pure state change.
  if (!purchase.paid || purchase.status === 'pending') {
    const claimed = await prisma.purchase.updateMany({
      where: {
        id: purchaseId,
        userId: user.id,
        status: { in: ['confirmed', 'pending'] },
      },
      data: { status: 'cancelled', cancelledAt: now, cancelledBy: 'user' },
    })
    if (claimed.count === 0) return { ok: false, error: 'conflict' }
    after(() => notifyOfCancellation(purchaseId, 'none'))
    return { ok: true, refund: 'none' }
  }

  // Paid card booking: claim the row first so racing cancels can't double-refund.
  const claimed = await prisma.purchase.updateMany({
    where: { id: purchaseId, userId: user.id, status: 'confirmed' },
    data: { status: 'refund_pending', cancelledAt: now, cancelledBy: 'user' },
  })
  if (claimed.count === 0) return { ok: false, error: 'conflict' }

  const refund = await refundPurchase(purchase)
  if (refund.ok) {
    await prisma.purchase.updateMany({
      where: { id: purchaseId, status: 'refund_pending' },
      data: { status: 'refunded', refundedAt: new Date() },
    })
    after(() => notifyOfCancellation(purchaseId, 'refunded'))
    return { ok: true, refund: 'refunded' }
  }

  // Refund API failed (e.g. already settled) — leave refund_pending for the
  // admin to resolve manually in the Thawani portal.
  after(() => sendRefundActionRequired(purchaseId))
  after(() => notifyOfCancellation(purchaseId, 'processing'))
  return { ok: true, refund: 'processing' }
}

const rescheduleSchema = z.object({
  purchaseId: z.uuid(),
  newDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export type RescheduleInput = z.infer<typeof rescheduleSchema>

export type RescheduleResult =
  | { ok: true }
  | {
      ok: false
      error:
        | 'invalid'
        | 'unauthorized'
        | 'not-found'
        | 'too-late'
        | 'too-early'
        | 'conflict'
        | 'failed'
    }

export async function reschedulePurchase(
  input: RescheduleInput,
): Promise<RescheduleResult> {
  let user
  try {
    user = await requireUser()
  } catch {
    return { ok: false, error: 'unauthorized' }
  }

  const parsed = rescheduleSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const { purchaseId, newDate } = parsed.data

  if (isBeforeTomorrow(newDate)) return { ok: false, error: 'too-early' }

  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
  })
  if (!purchase || purchase.userId !== user.id) {
    return { ok: false, error: 'not-found' }
  }
  if (purchase.status !== 'confirmed') return { ok: false, error: 'conflict' }
  if (!canModifyBooking(purchase.chosenDate)) {
    return { ok: false, error: 'too-late' }
  }

  // Include the old date in the WHERE so a concurrent reschedule loses cleanly.
  const updated = await prisma.purchase.updateMany({
    where: {
      id: purchaseId,
      userId: user.id,
      status: 'confirmed',
      chosenDate: purchase.chosenDate,
    },
    data: {
      chosenDate: new Date(`${newDate}T00:00:00Z`),
      rescheduledFrom: purchase.chosenDate,
      // A reminder already sent for the old date shouldn't suppress the one
      // for the new date.
      reminderSentAt: null,
    },
  })
  if (updated.count === 0) return { ok: false, error: 'conflict' }

  after(() => rememberUserLocale(user.id))
  after(() => notifyOfReschedule(purchaseId, purchase.chosenDate))
  return { ok: true }
}

const retrySchema = z.object({ purchaseId: z.uuid() })

export type RetryInput = z.infer<typeof retrySchema>

export type RetryResult =
  | { ok: true; redirectUrl: string }
  | {
      ok: false
      error:
        | 'invalid'
        | 'unauthorized'
        | 'not-found'
        | 'too-early'
        | 'conflict'
        | 'failed'
    }

export async function retryPayment(input: RetryInput): Promise<RetryResult> {
  let user
  try {
    user = await requireUser()
  } catch {
    return { ok: false, error: 'unauthorized' }
  }

  const parsed = retrySchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const { purchaseId } = parsed.data

  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: { product: { select: { id: true, title: true, isDeleted: true } } },
  })
  if (!purchase || purchase.userId !== user.id) {
    return { ok: false, error: 'not-found' }
  }
  if (purchase.status !== 'pending' && purchase.status !== 'expired') {
    return { ok: false, error: 'conflict' }
  }
  if (purchase.product.isDeleted) return { ok: false, error: 'conflict' }
  // Trip already too close to pay for — the booking has to be remade.
  if (isBeforeTomorrow(purchase.chosenDate)) {
    return { ok: false, error: 'too-early' }
  }

  try {
    const redirectUrl = await createCheckoutForPurchase({
      purchaseId,
      costBaisa: Number(purchase.costBaisa),
      participants: purchase.numOfParticipants,
      product: purchase.product,
      user,
    })
    // An expired row goes back to pending now that a fresh session exists.
    await prisma.purchase.updateMany({
      where: { id: purchaseId, status: 'expired' },
      data: { status: 'pending' },
    })
    after(() => rememberUserLocale(user.id))
    return { ok: true, redirectUrl }
  } catch (error) {
    console.error('retry payment failed', error)
    return { ok: false, error: 'failed' }
  }
}
