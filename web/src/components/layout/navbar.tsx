'use client'

import Image from 'next/image'
import { Suspense, useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { LocaleSwitcher } from './locale-switcher'
import { UserMenu } from './user-menu'

const NAV_LINKS = ['experiences', 'blogs', 'about', 'contact'] as const

export function Navbar() {
  const t = useTranslations('common')
  const locale = useLocale()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Transparent chrome floating over the hero on the landing page only.
  const overHero = pathname === '/' && !scrolled

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        overHero
          ? 'border-b border-transparent bg-transparent'
          : 'bg-background/85 border-b backdrop-blur-lg'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="shrink-0">
          <Image
            src={locale === 'ar' ? '/logo_ar.png' : '/main_logo.png'}
            alt="Omanosaura"
            width={150}
            height={40}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((key) => (
            <Link
              key={key}
              href={`/${key}` as never}
              className={`text-sm font-medium transition-colors ${
                overHero
                  ? 'hover:text-secondary text-white/90'
                  : 'text-muted-foreground hover:text-secondary'
              }`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Suspense>
            <LocaleSwitcher onDark={overHero} />
            <UserMenu onDark={overHero} />
          </Suspense>
        </div>
      </div>
    </header>
  )
}
