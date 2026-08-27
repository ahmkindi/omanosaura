import Image from 'next/image'
import { Suspense } from 'react'
import { getLocale, getTranslations } from 'next-intl/server'
import { Menu } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { LocaleSwitcher } from './locale-switcher'
import { UserMenu } from './user-menu'

const NAV_LINKS = ['experiences', 'blogs', 'about', 'contact'] as const

export async function Navbar() {
  const [t, locale] = await Promise.all([
    getTranslations('common'),
    getLocale(),
  ])

  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="shrink-0">
          <Image
            src={locale === 'ar' ? '/logo_ar.png' : '/main_logo.png'}
            alt="Omanosaura"
            width={160}
            height={43}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((key) => (
            <Link
              key={key}
              href={`/${key}` as never}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Suspense>
            <LocaleSwitcher />
            <UserMenu />
          </Suspense>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={locale === 'ar' ? 'left' : 'right'}>
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav className="mt-8 flex flex-col gap-4 px-4">
                {NAV_LINKS.map((key) => (
                  <Link
                    key={key}
                    href={`/${key}` as never}
                    className="text-lg font-medium"
                  >
                    {t(key)}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
