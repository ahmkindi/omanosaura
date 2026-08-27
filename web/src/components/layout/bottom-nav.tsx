'use client'

import { useTranslations } from 'next-intl'
import { Compass, Home, Newspaper, User } from 'lucide-react'
import { motion } from 'motion/react'
import { Link, usePathname } from '@/i18n/navigation'

const ITEMS = [
  { href: '/', key: 'homeTab', icon: Home, exact: true },
  { href: '/experiences', key: 'experiences', icon: Compass, exact: false },
  { href: '/blogs', key: 'blogs', icon: Newspaper, exact: false },
  { href: '/profile', key: 'profile', icon: User, exact: false },
] as const

export function BottomNav() {
  const t = useTranslations('common')
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) return null

  return (
    <nav
      className="border-border/60 bg-background/85 fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur-lg md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary"
    >
      <div className="grid h-16 grid-cols-4">
        {ITEMS.map(({ href, key, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center gap-0.5"
            >
              {active && (
                <motion.span
                  layoutId="bottom-nav-pill"
                  transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                  className="bg-secondary/15 absolute inset-x-3 inset-y-1.5 rounded-2xl"
                />
              )}
              <Icon
                className={`relative size-5 transition-colors ${
                  active ? 'text-secondary' : 'text-muted-foreground'
                }`}
                strokeWidth={active ? 2.4 : 1.8}
              />
              <span
                className={`relative text-[10px] font-medium ${
                  active ? 'text-secondary' : 'text-muted-foreground'
                }`}
              >
                {t(key)}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
