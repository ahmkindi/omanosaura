import 'server-only'
import { env } from '@/env'

export type ThawaniPaymentStatus = 'unpaid' | 'paid' | 'cancelled'

export type ThawaniSession = {
  session_id: string
  client_reference_id: string
  customer_id: string | null
  invoice: string
  total_amount: number
  currency: string
  payment_status: ThawaniPaymentStatus
  created_at: string
  expire_at: string
}

export type CreateSessionRequest = {
  client_reference_id: string
  mode: 'payment'
  products: Array<{ name: string; unit_amount: number; quantity: number }>
  success_url: string
  cancel_url: string
  customer_id?: string
  expire_in_minutes?: number
  metadata: Record<string, string | number>
}

export type ThawaniPayment = {
  payment_id: string
  status: string
  amount: number
  checkout_invoice?: string
  created_at?: string
}

type ThawaniEnvelope<T> = { success: boolean; code: number; data: T }

const TIMEOUT_MS = 20_000

async function request<T>(
  method: 'GET' | 'POST',
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${env.thawaniBaseUrl}/api/v1${path}`, {
    method,
    headers: {
      'thawani-api-key': env.thawaniApiKey,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: 'no-store',
  })
  const json = (await res.json().catch(() => null)) as ThawaniEnvelope<T> | null
  if (!res.ok || !json?.success) {
    throw new Error(
      `Thawani ${method} ${path} failed: ${res.status} ${JSON.stringify(json)}`,
    )
  }
  return json.data
}

export const thawani = {
  async createCustomer(clientCustomerId: string): Promise<string> {
    const data = await request<{ id: string }>('POST', '/customers', {
      client_customer_id: clientCustomerId,
    })
    return data.id
  },

  async createSession(
    req: CreateSessionRequest,
  ): Promise<{ session: ThawaniSession; redirectUrl: string }> {
    const session = await request<ThawaniSession>(
      'POST',
      '/checkout/session',
      req,
    )
    return {
      session,
      redirectUrl: `${env.thawaniBaseUrl}/pay/${session.session_id}?key=${env.thawaniPublishableKey}`,
    }
  },

  getSessionByClientReference(ref: string): Promise<ThawaniSession> {
    return request<ThawaniSession>(
      'GET',
      `/checkout/reference/${encodeURIComponent(ref)}`,
    )
  },

  getSession(sessionId: string): Promise<ThawaniSession> {
    return request<ThawaniSession>(
      'GET',
      `/checkout/session/${encodeURIComponent(sessionId)}`,
    )
  },

  getPaymentsByInvoice(invoice: string): Promise<ThawaniPayment[]> {
    return request<ThawaniPayment[]>(
      'GET',
      `/payments?checkout_invoice=${encodeURIComponent(invoice)}`,
    )
  },

  createRefund(req: {
    payment_id: string
    reason: string
    metadata?: Record<string, string | number>
  }): Promise<unknown> {
    return request<unknown>('POST', '/refunds', req)
  },
}
