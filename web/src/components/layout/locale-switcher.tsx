'use client'

import { useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { usePathname, useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'

export function LocaleSwitcher() {
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
    <div className="flex overflow-hidden rounded-md border" dir="ltr">
      {(['ar', 'en'] as const).map((l) => (
        <Button
          key={l}
          variant={locale === l ? 'default' : 'ghost'}
          size="sm"
          className="rounded-none px-3"
          onClick={() => switchTo(l)}
        >
          {l.toUpperCase()}
        </Button>
      ))}
    </div>
  )
}
