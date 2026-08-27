'use server'

import { randomUUID } from 'node:crypto'
import { after } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { thawani } from '@/lib/thawani'
import { computeCostBaisa } from '@/lib/pricing'
import { env } from '@/env'
import { notifyOfPurchase } from '@/lib/purchase-notify'

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

  // Legacy rule: bookings must be at least one day out.
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (new Date(`${chosenDate}T00:00:00Z`) < new Date(tomorrow.toISOString().slice(0, 10))) {
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
        complete: cash,
        extraPriceChosen: payExtra,
      },
    })
  } catch (error) {
    console.error('purchase insert failed', error)
    return { ok: false, error: 'failed' }
  }

  if (cash) {
    after(() => notifyOfPurchase(purchaseId))
    return { ok: true, cash: true }
  }

  try {
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

    const { redirectUrl } = await thawani.createSession({
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
        participants: quantity,
      },
    })

    return { ok: true, cash: false, redirectUrl }
  } catch (error) {
    console.error('thawani session failed', error)
    return { ok: false, error: 'failed' }
  }
}
