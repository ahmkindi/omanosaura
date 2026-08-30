import 'server-only'
import { prisma } from '@/lib/db'
import { thawani } from '@/lib/thawani'
import { env } from '@/env'
import type { User } from '@/generated/prisma/client'

type CheckoutInput = {
  purchaseId: string
  costBaisa: number
  participants: number
  product: { id: string; title: string }
  user: Pick<User, 'id' | 'name' | 'email' | 'phone'>
}

/**
 * Creates (or reuses) the Thawani customer and opens a checkout session for a
 * purchase row. Persists the session id on the purchase so refunds and
 * reconciliation can address the exact session. Shared by purchaseProduct and
 * retryPayment.
 */
export async function createCheckoutForPurchase({
  purchaseId,
  costBaisa,
  participants,
  product,
  user,
}: CheckoutInput): Promise<string> {
  // Reuse the stored Thawani customer; create + persist it once if missing.
  let customerId = (
    await prisma.userCustomerId.findUnique({ where: { userId: user.id } })
  )?.customerId
  if (!customerId) {
    customerId = await thawani.createCustomer(user.id)
    await prisma.userCustomerId.upsert({
      where: { userId: user.id },
      update: { customerId },
      create: { userId: user.id, customerId },
    })
  }

  const { session, redirectUrl } = await thawani.createSession({
    client_reference_id: purchaseId,
    mode: 'payment',
    // Single line item with the exact total — avoids the legacy
    // unit_amount = cost/quantity rounding loss.
    products: [
      {
        name: product.title.slice(0, 40),
        quantity: 1,
        unit_amount: costBaisa,
      },
    ],
    success_url: `${env.baseUrl}/api/purchase/success/${purchaseId}`,
    cancel_url: `${env.baseUrl}/experiences/${product.id}`,
    customer_id: customerId,
    expire_in_minutes: 60,
    metadata: {
      customer_name: user.name,
      customer_email: user.email,
      customer_phone: user.phone,
      product_id: product.id,
      participants,
    },
  })

  await prisma.purchase.update({
    where: { id: purchaseId },
    data: { thawaniSessionId: session.session_id },
  })

  return redirectUrl
}
