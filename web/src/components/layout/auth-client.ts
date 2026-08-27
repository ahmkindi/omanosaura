'use client'

import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
  signOut,
  type UserCredential,
} from 'firebase/auth'
import { auth } from '@/lib/firebase/client'

const EMAIL_STORAGE_KEY = 'emailForSignIn'

async function establishSession(credential: UserCredential) {
  const idToken = await credential.user.getIdToken()
  const res = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })
  if (!res.ok) throw new Error('Failed to establish session')
  // The Firebase client session is only needed long enough to mint the
  // HttpOnly cookie; the cookie is the source of truth from here on.
  await signOut(auth).catch(() => {})
}

export async function loginWithGoogle() {
  await establishSession(await signInWithPopup(auth, new GoogleAuthProvider()))
}

export async function loginWithFacebook() {
  await establishSession(
    await signInWithPopup(auth, new FacebookAuthProvider()),
  )
}

export async function sendMagicLink(email: string) {
  await sendSignInLinkToEmail(auth, email, {
    url: `${window.location.origin}/auth/complete`,
    handleCodeInApp: true,
  })
  window.localStorage.setItem(EMAIL_STORAGE_KEY, email)
}

export function isMagicLink(url: string) {
  return isSignInWithEmailLink(auth, url)
}

export async function completeMagicLink(url: string, emailOverride?: string) {
  const email =
    emailOverride ?? window.localStorage.getItem(EMAIL_STORAGE_KEY) ?? ''
  if (!email) throw new Error('missing-email')
  await establishSession(await signInWithEmailLink(auth, email, url))
  window.localStorage.removeItem(EMAIL_STORAGE_KEY)
}

export async function logout() {
  await fetch('/api/auth/session', { method: 'DELETE' })
  await signOut(auth).catch(() => {})
}
