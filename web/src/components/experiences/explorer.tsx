'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { MessageCircle, Search } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { ProductDTO } from '@/data/serialize'
import { AdventureCard } from './adventure-card'
import { Reveal } from '@/components/reveal'

export function ExperiencesExplorer({ products }: { products: ProductDTO[] }) {
  const t = useTranslations('experiences')
  const tc = useTranslations('common')
  const th = useTranslations('home')
  const locale = useLocale()
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => {
      const haystack =
        locale === 'ar'
          ? `${p.titleAr} ${p.subtitleAr}`
          : `${p.title} ${p.subtitle}`
      return haystack.toLowerCase().includes(q)
    })
  }, [products, query, locale])

  return (
    <div className="space-y-6">
      <div className="relative mx-auto max-w-xl">
        <Search className="text-muted-foreground absolute start-4 top-1/2 size-4 -translate-y-1/2" />
        <Input
          className="h-12 rounded-full bg-white ps-11 shadow-sm"
          placeholder={t('searchExp')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => (
          <Reveal key={p.id} index={i % 6}>
            <AdventureCard product={p} />
          </Reveal>
        ))}
      </div>
      {visible.length === 0 && (
        <p className="text-muted-foreground py-12 text-center">—</p>
      )}

      {/* Team building & school trips are arranged directly — point to contact */}
      <Reveal>
        <div className="bg-night flex flex-col items-center gap-4 rounded-3xl px-6 py-10 text-center text-white sm:flex-row sm:justify-between sm:text-start">
          <div>
            <h2 className="font-display text-xl font-bold sm:text-2xl">
              {tc('productkind.team.title')} · {tc('productkind.school.title')}
            </h2>
            <p className="mt-1 text-sm text-white/65">{th('service.desc')}</p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shrink-0 font-semibold"
          >
            <Link href="/contact">
              <MessageCircle className="size-4" /> {tc('contact')}
            </Link>
          </Button>
        </div>
      </Reveal>
    </div>
  )
}
