import 'server-only'
import { prisma } from '@/lib/db'
import { sendEmail, ADMIN_EMAIL } from '@/lib/email'
import { toDateString } from '@/data/serialize'
import PurchaseConfirmationEmail from '../../emails/purchase-confirmation'
import PurchaseInternalEmail from '../../emails/purchase-internal'

/**
 * Sends the customer confirmation + internal notification for a purchase
 * (port of the legacy NotifyOfPurchase goroutine).
 */
export async function notifyOfPurchase(purchaseId: string) {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        user: { select: { email: true, name: true } },
        product: { select: { title: true, id: true } },
      },
    })
    if (!purchase) return

    const details = {
      purchaseId,
      name: purchase.user.name,
      email: purchase.user.email,
      productTitle: purchase.product.title,
      paid: purchase.paid,
      chosenDate: toDateString(purchase.chosenDate),
      costOMR: Number(purchase.costBaisa) / 1000,
      participants: purchase.numOfParticipants,
    }

    await Promise.all([
      sendEmail({
        to: details.email,
        subject: `Purchase Success ${purchaseId}`,
        react: PurchaseConfirmationEmail(details),
      }),
      sendEmail({
        to: ADMIN_EMAIL,
        subject: `New Purchase: ${details.productTitle}`,
        react: PurchaseInternalEmail(details),
      }),
    ])
  } catch (error) {
    console.error('notifyOfPurchase failed', error)
  }
}
