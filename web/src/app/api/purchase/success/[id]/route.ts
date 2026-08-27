import { NextResponse, type NextRequest } from 'next/server'
import { after } from 'next/server'
import { z } from 'zod'
import { thawani } from '@/lib/thawani'
import { fulfillPurchase, notifyOfPurchase } from '@/lib/fulfill'
import { env } from '@/env'

/**
 * Thawani redirects the customer's browser here after checkout. Payment is
 * verified server-to-server via the reference lookup — query params are never
 * trusted. Fulfillment is idempotent; the webhook may have completed it first.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  if (!z.uuid().safeParse(id).success) {
    return NextResponse.redirect(`${env.baseUrl}/`, 303)
  }

  try {
    const session = await thawani.getSessionByClientReference(id)
    if (session.payment_status === 'paid') {
      const transitioned = await fulfillPurchase(id)
      if (transitioned) after(() => notifyOfPurchase(id))
    }
  } catch (error) {
    console.error('purchase success verification failed', error)
  }

  return NextResponse.redirect(`${env.baseUrl}/purchases`, 303)
}
