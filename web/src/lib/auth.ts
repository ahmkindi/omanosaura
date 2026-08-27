import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { after } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'
import { prisma } from '@/lib/db'
import type { User, UserRole } from '@/generated/prisma/client'
import { sendWelcomeEmail } from '@/lib/email'

export const SESSION_COOKIE = 'session'
export const SESSION_MAX_AGE_SECONDS = 5 * 24 * 60 * 60

/**
 * Ensures a users row exists for the Firebase UID (mirrors the legacy Go
 * auto-provision in HandlerGetUser). Sends the welcome email on first create.
 */
export async function provisionUser(uid: string): Promise<User> {
  const existing = await prisma.user.findUnique({ where: { id: uid } })
  if (existing) return existing

  const firebaseUser = await adminAuth().getUser(uid)
  const user = await prisma.user.upsert({
    where: { id: uid },
    update: {},
    create: {
      id: uid,
      email: firebaseUser.email ?? '',
      name: firebaseUser.displayName ?? '',
      phone: firebaseUser.phoneNumber ?? '',
      role: 'none',
    },
  })
  after(async () => {
    try {
      await sendWelcomeEmail(user.email)
    } catch (error) {
      console.error('failed to send welcome email', error)
    }
  })
  return user
}

/**
 * Verifies the session cookie and returns the DB user, or null.
 * Cached per-request via React cache().
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  if (!session?.value) return null
  try {
    const decoded = await adminAuth().verifySessionCookie(session.value)
    return await provisionUser(decoded.uid)
  } catch {
    return null
  }
})

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) throw new UnauthorizedError()
  return user
}

export async function requireRole(...roles: UserRole[]): Promise<User> {
  const user = await requireUser()
  if (!roles.includes(user.role)) throw new UnauthorizedError('Forbidden')
  return user
}
