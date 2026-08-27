'use client'

import { useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { usePathname, useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'

export function LocaleSwitcher({ onDark = false }: { onDark?: boolean }) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const switchTo = (target: 'en' | 'ar') => {
    if (target === locale) return
    const query = searchParams.toString()
    router.replace(
      (query ? `${pathname}?${query}` : pathname) as never,
      { locale: target },
    )
  }

  return (
    <div
      className={`flex overflow-hidden rounded-md border ${
        onDark ? 'border-white/30 bg-white/10 backdrop-blur' : ''
      }`}
      dir="ltr"
    >
      {(['ar', 'en'] as const).map((l) => (
        <Button
          key={l}
          variant={locale === l ? 'default' : 'ghost'}
          size="sm"
          className={`rounded-none px-3 ${
            onDark && locale !== l ? 'text-white hover:bg-white/15 hover:text-white' : ''
          }`}
          onClick={() => switchTo(l)}
        >
          {l.toUpperCase()}
        </Button>
      ))}
    </div>
  )
}
