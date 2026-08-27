const BASE = 'https://omanosaura.com'

/** hreflang alternates for a path ('' = home, '/experiences', …). */
export function localeAlternates(path: string) {
  return {
    canonical: `${BASE}${path || '/'}`,
    languages: {
      en: `${BASE}${path || '/'}`,
      ar: `${BASE}/ar${path}`,
      'x-default': `${BASE}${path || '/'}`,
    },
  }
}
