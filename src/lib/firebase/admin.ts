import 'server-only'
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getAuth, type Auth } from 'firebase-admin/auth'
import { env } from '@/env'

let app: App | undefined

// Lazy so that importing modules never require env at build time.
export function adminAuth(): Auth {
  if (!app) {
    app =
      getApps()[0] ??
      initializeApp({
        credential: cert(
          JSON.parse(
            Buffer.from(env.firebaseServiceAccount, 'base64').toString('utf8'),
          ),
        ),
      })
  }
  return getAuth(app)
}
