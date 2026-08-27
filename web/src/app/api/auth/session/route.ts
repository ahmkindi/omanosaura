import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase/admin'
import {
  provisionUser,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from '@/lib/auth'

const MAX_AUTH_AGE_SECONDS = 5 * 60

export async function POST(request: NextRequest) {
  let idToken: unknown
  try {
    ;({ idToken } = await request.json())
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }
  if (typeof idToken !== 'string' || !idToken) {
    return NextResponse.json({ error: 'missing idToken' }, { status: 400 })
  }

  try {
    const decoded = await adminAuth().verifyIdToken(idToken)
    // Only mint session cookies from freshly-authenticated tokens
    // (Firebase session-cookie best practice).
    if (Date.now() / 1000 - decoded.auth_time > MAX_AUTH_AGE_SECONDS) {
      return NextResponse.json({ error: 'stale auth' }, { status: 401 })
    }

    const sessionCookie = await adminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_SECONDS * 1000,
    })

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    })

    await provisionUser(decoded.uid)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('session creation failed', error)
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  return NextResponse.json({ ok: true })
}
