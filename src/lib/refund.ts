import 'server-only'
import { prisma } from '@/lib/db'
import { thawani, type ThawaniSession } from '@/lib/thawani'
import type { Purchase } from '@/generated/prisma/client'

/**
 * Issues a full Thawani refund for a paid card purchase. Resolves the
 * payment_id lazily: stored session id (falls back to the client-reference
 * lookup for legacy rows) -> session invoice -> payments list. The resolved
 * payment_id is persisted before the refund call so the manual-refund email
 * can include it even when the refund API fails (e.g. already settled).
 */
export async function refundPurchase(
  purchase: Pick<Purchase, 'id' | 'thawaniSessionId'>,
): Promise<{ ok: true; paymentId: string } | { ok: false }> {
  try {
    let session: ThawaniSession
    if (purchase.thawaniSessionId) {
      session = await thawani.getSession(purchase.thawaniSessionId)
    } else {
      session = await thawani.getSessionByClientReference(purchase.id)
    }
    if (session.payment_status !== 'paid') {
      console.error('refundPurchase: session not paid', purchase.id)
      return { ok: false }
    }

    const payments = await thawani.getPaymentsByInvoice(session.invoice)
    const paid = payments.find((p) =>
      ['successful', 'success', 'paid'].includes(p.status.toLowerCase()),
    )
    if (!paid) {
      console.error('refundPurchase: no successful payment', purchase.id)
      return { ok: false }
    }

    await prisma.purchase.update({
      where: { id: purchase.id },
      data: { thawaniPaymentId: paid.payment_id },
    })

    await thawani.createRefund({
      payment_id: paid.payment_id,
      reason: `Booking cancellation ${purchase.id}`,
      metadata: { purchase_id: purchase.id },
    })
    return { ok: true, paymentId: paid.payment_id }
  } catch (error) {
    console.error('refundPurchase failed', purchase.id, error)
    return { ok: false }
  }
}
