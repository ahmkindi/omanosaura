'use server'

import { revalidatePath } from 'next/cache'
import { after } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { refundPurchase } from '@/lib/refund'
import {
  notifyOfPurchase,
  notifyOfCancellation,
  notifyOfReschedule,
  sendRefundActionRequired,
} from '@/lib/purchase-notify'

export type AdminPurchaseResult =
  | { ok: true; refund?: 'none' | 'refunded' | 'processing' }
  | {
      ok: false
      error: 'invalid' | 'unauthorized' | 'not-found' | 'conflict' | 'failed'
    }

function revalidatePurchases() {
  for (const prefix of ['', '/ar']) {
    revalidatePath(`${prefix}/purchases`)
    revalidatePath(`${prefix}/admin/purchases`)
  }
}

const idSchema = z.object({ purchaseId: z.uuid() })

export async function adminCancelPurchase(input: {
  purchaseId: string
}): Promise<AdminPurchaseResult> {
  try {
    await requireRole('admin')
  } catch {
    return { ok: false, error: 'unauthorized' }
  }
  const parsed = idSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const { purchaseId } = parsed.data

  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
  })
  if (!purchase) return { ok: false, error: 'not-found' }
  if (purchase.status !== 'confirmed' && purchase.status !== 'pending') {
    return { ok: false, error: 'conflict' }
  }

  const now = new Date()

  if (!purchase.paid || purchase.status === 'pending') {
    const claimed = await prisma.purchase.updateMany({
      where: { id: purchaseId, status: { in: ['confirmed', 'pending'] } },
      data: { status: 'cancelled', cancelledAt: now, cancelledBy: 'admin' },
    })
    if (claimed.count === 0) return { ok: false, error: 'conflict' }
    after(() => notifyOfCancellation(purchaseId, 'none'))
    revalidatePurchases()
    return { ok: true, refund: 'none' }
  }

  const claimed = await prisma.purchase.updateMany({
    where: { id: purchaseId, status: 'confirmed' },
    data: { status: 'refund_pending', cancelledAt: now, cancelledBy: 'admin' },
  })
  if (claimed.count === 0) return { ok: false, error: 'conflict' }

  const refund = await refundPurchase(purchase)
  if (refund.ok) {
    await prisma.purchase.updateMany({
      where: { id: purchaseId, status: 'refund_pending' },
      data: { status: 'refunded', refundedAt: new Date() },
    })
    after(() => notifyOfCancellation(purchaseId, 'refunded'))
    revalidatePurchases()
    return { ok: true, refund: 'refunded' }
  }

  after(() => sendRefundActionRequired(purchaseId))
  after(() => notifyOfCancellation(purchaseId, 'processing'))
  revalidatePurchases()
  return { ok: true, refund: 'processing' }
}

const rescheduleSchema = z.object({
  purchaseId: z.uuid(),
  newDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export async function adminReschedulePurchase(input: {
  purchaseId: string
  newDate: string
}): Promise<AdminPurchaseResult> {
  try {
    await requireRole('admin')
  } catch {
    return { ok: false, error: 'unauthorized' }
  }
  const parsed = rescheduleSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const { purchaseId, newDate } = parsed.data

  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
  })
  if (!purchase) return { ok: false, error: 'not-found' }
  if (purchase.status !== 'confirmed') return { ok: false, error: 'conflict' }

  const updated = await prisma.purchase.updateMany({
    where: { id: purchaseId, status: 'confirmed', chosenDate: purchase.chosenDate },
    data: {
      chosenDate: new Date(`${newDate}T00:00:00Z`),
      rescheduledFrom: purchase.chosenDate,
      reminderSentAt: null,
    },
  })
  if (updated.count === 0) return { ok: false, error: 'conflict' }

  after(() => notifyOfReschedule(purchaseId, purchase.chosenDate))
  revalidatePurchases()
  return { ok: true }
}

export async function adminResendConfirmation(input: {
  purchaseId: string
}): Promise<AdminPurchaseResult> {
  try {
    await requireRole('admin')
  } catch {
    return { ok: false, error: 'unauthorized' }
  }
  const parsed = idSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }

  const purchase = await prisma.purchase.findUnique({
    where: { id: parsed.data.purchaseId },
    select: { status: true },
  })
  if (!purchase) return { ok: false, error: 'not-found' }
  if (purchase.status !== 'confirmed') return { ok: false, error: 'conflict' }

  await notifyOfPurchase(parsed.data.purchaseId, { customer: true, admin: false })
  return { ok: true }
}

export async function adminMarkRefunded(input: {
  purchaseId: string
}): Promise<AdminPurchaseResult> {
  try {
    await requireRole('admin')
  } catch {
    return { ok: false, error: 'unauthorized' }
  }
  const parsed = idSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }

  const updated = await prisma.purchase.updateMany({
    where: { id: parsed.data.purchaseId, status: 'refund_pending' },
    data: { status: 'refunded', refundedAt: new Date() },
  })
  if (updated.count === 0) return { ok: false, error: 'conflict' }

  revalidatePurchases()
  return { ok: true }
}
