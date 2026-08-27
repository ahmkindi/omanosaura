'use client'

import { useEffect, useState } from 'react'

export type SessionUser = {
  id: string
  name: string
  email: string
  phone: string
  isAdmin: boolean
}

let cached: SessionUser | null | undefined
const listeners = new Set<() => void>()

async function load() {
  try {
    const res = await fetch('/api/auth/me')
    const data = (await res.json()) as { user: SessionUser | null }
    cached = data.user
  } catch {
    cached = null
  }
  listeners.forEach((fn) => fn())
}

/** Invalidate the cached session (call after login/logout) and refetch. */
export function refreshSessionUser() {
  cached = undefined
  void load()
}

/**
 * Client-side session state. Fetched once per page load from /api/auth/me so
 * server components (and ISR pages) never need request cookies for the navbar.
 */
export function useSessionUser(): {
  user: SessionUser | null
  loading: boolean
} {
  const [, force] = useState(0)

  useEffect(() => {
    const rerender = () => force((n) => n + 1)
    listeners.add(rerender)
    if (cached === undefined) void load()
    return () => {
      listeners.delete(rerender)
    }
  }, [])

  return { user: cached ?? null, loading: cached === undefined }
}
