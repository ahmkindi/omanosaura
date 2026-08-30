import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { after } from 'next/server'
import { env } from '@/env'
import { prisma } from '@/lib/db'
import { fulfillPurchase, notifyOfPurchase } from '@/lib/fulfill'

type ThawaniWebhookBody = {
  event_type: string
  data?: {
    client_reference_id?: string
    payment_status?: string
    payment_id?: string
  }
}

function verifySignature(
  rawBody: string,
  timestamp: string,
  signature: string,
): boolean {
  const secret = env.thawaniWebhookSecret
  if (!secret) return false
  const expected = createHmac('sha256', secret)
    .update(`${rawBody}-${timestamp}`)
    .digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const timestamp = request.headers.get('thawani-timestamp') ?? ''
  const signature = request.headers.get('thawani-signature') ?? ''

  if (!timestamp || !signature || !verifySignature(rawBody, timestamp, signature)) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
  }

  let body: ThawaniWebhookBody
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  if (
    body.event_type === 'checkout.completed' &&
    body.data?.payment_status === 'paid' &&
    body.data.client_reference_id
  ) {
    const purchaseId = body.data.client_reference_id
    const transitioned = await fulfillPurchase(purchaseId)
    if (transitioned) after(() => notifyOfPurchase(purchaseId))
  } else if (body.event_type === 'payment.failed') {
    console.warn('thawani payment failed', rawBody)
  } else if (body.event_type.startsWith('refund')) {
    // Refund confirmation is normally synchronous in the cancel action; this
    // corroborates it (e.g. a manual portal refund). Event names are not
    // documented — match defensively and log the payload.
    console.info('thawani refund event', rawBody)
    const purchaseId = body.data?.client_reference_id
    if (purchaseId) {
      await prisma.purchase.updateMany({
        where: { id: purchaseId, status: 'refund_pending' },
        data: { status: 'refunded', refundedAt: new Date() },
      })
    } else if (body.data?.payment_id) {
      await prisma.purchase.updateMany({
        where: {
          thawaniPaymentId: body.data.payment_id,
          status: 'refund_pending',
        },
        data: { status: 'refunded', refundedAt: new Date() },
      })
    }
  } else {
    // Log unknown event types so we learn the real names (esp. refunds) in UAT.
    console.info('thawani webhook (unhandled)', body.event_type, rawBody)
  }

  // Always 200 for verified events so Thawani doesn't retry forever.
  return NextResponse.json({ ok: true })
}
