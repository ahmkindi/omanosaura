import 'server-only'

/**
 * Server-side env access. Values are read lazily so that build-time page
 * data collection doesn't require the full production env.
 */
const OPTIONAL = new Set(['THAWANI_WEBHOOK_SECRET'])

function read(name: string): string {
  const value = process.env[name]
  if (!value && !OPTIONAL.has(name)) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value ?? ''
}

export const env = {
  get databaseUrl() {
    return read('DATABASE_URL')
  },
  get baseUrl() {
    return read('BASE_URL')
  },
  get thawaniApiKey() {
    return read('THAWANI_API_KEY')
  },
  get thawaniBaseUrl() {
    return read('THAWANI_BASE_URL')
  },
  get thawaniPublishableKey() {
    return read('THAWANI_PUBLISHABLE_KEY')
  },
  get thawaniWebhookSecret() {
    return read('THAWANI_WEBHOOK_SECRET')
  },
  get emailUsername() {
    return read('EMAIL_USERNAME')
  },
  get emailPassword() {
    return read('EMAIL_PASSWORD')
  },
  get firebaseServiceAccount() {
    return read('FIREBASE_SERVICE_ACCOUNT')
  },
  get cronSecret() {
    return read('CRON_SECRET')
  },
}
