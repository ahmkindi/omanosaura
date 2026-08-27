import type { ReactNode } from 'react'
import { setRequestLocale } from 'next-intl/server'
import { getCurrentUser } from '@/lib/auth'
import { redirect, Link } from '@/i18n/navigation'

const ADMIN_LINKS = [
  { href: '/admin/experiences', label: 'Experiences' },
  { href: '/admin/purchases', label: 'Purchases' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/media', label: 'Media' },
] as const

// UX-level gate only — every admin server action and route handler
// independently re-checks requireRole('admin').
export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') redirect({ href: '/', locale })

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-8 flex flex-wrap gap-2 border-b pb-4" dir="ltr">
        {ADMIN_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href as never}
            className="hover:bg-accent rounded-md px-3 py-1.5 text-sm font-medium"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  )
}
