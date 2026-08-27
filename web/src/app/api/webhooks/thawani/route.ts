import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { after } from 'next/server'
import { env } from '@/env'
import { fulfillPurchase, notifyOfPurchase } from '@/lib/fulfill'

type ThawaniWebhookBody = {
  event_type: string
  data?: {
    client_reference_id?: string
    payment_status?: string
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
  }

  // Always 200 for verified events so Thawani doesn't retry forever.
  return NextResponse.json({ ok: true })
}
