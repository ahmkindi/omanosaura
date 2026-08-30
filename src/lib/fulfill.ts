import 'server-only'
import { prisma } from '@/lib/db'
import { notifyOfPurchase } from '@/lib/purchase-notify'

/**
 * Idempotently marks a purchase complete after Thawani confirms payment.
 * Returns true only on the first transition, so callers can avoid duplicate
 * notification emails (webhook + redirect + cron may all race here).
 */
export async function fulfillPurchase(purchaseId: string): Promise<boolean> {
  const result = await prisma.purchase.updateMany({
    // `expired` included so a session paid after the reconcile sweep expired
    // the row still confirms. `complete` is dual-written until it is dropped.
    where: { id: purchaseId, status: { in: ['pending', 'expired'] } },
    data: { status: 'confirmed', complete: true },
  })
  return result.count > 0
}

export { notifyOfPurchase }
