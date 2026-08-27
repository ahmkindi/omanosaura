import createIntlMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intl = createIntlMiddleware(routing)

const PROTECTED_PREFIXES = ['/profile', '/purchases', '/admin']

function stripLocale(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) return '/'
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1)
  }
  return pathname
}

export function proxy(request: NextRequest) {
  const path = stripLocale(request.nextUrl.pathname)

  // Optimistic redirect only — real authorization happens server-side in
  // layouts, server actions, and route handlers.
  if (
    PROTECTED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`)) &&
    !request.cookies.has('session')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.searchParams.set('login', '1')
    return NextResponse.redirect(url)
  }

  return intl(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
