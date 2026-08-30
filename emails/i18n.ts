// Emails render outside the next-intl request pipeline (crons, after()
// callbacks), so each template carries its own tiny {en, ar} copy dict
// instead of reading messages/*.json.

export type EmailLocale = 'en' | 'ar'

export function pick<T>(locale: EmailLocale, dict: { en: T; ar: T }): T {
  return locale === 'ar' ? dict.ar : dict.en
}

export function asEmailLocale(locale: string | null | undefined): EmailLocale {
  return locale === 'ar' ? 'ar' : 'en'
}
