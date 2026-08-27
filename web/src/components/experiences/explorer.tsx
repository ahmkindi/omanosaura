'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ProductDTO } from '@/data/serialize'

const KINDS = ['all', 'exp', 'school', 'team'] as const

/**
 * Client-side search/filter over the statically-rendered product list.
 * Receives both the DTOs (for filtering) and the server-rendered cards keyed
 * by product id (so cards stay server components).
 */
export function ExperiencesExplorer({
  products,
  cards,
}: {
  products: ProductDTO[]
  cards: Record<string, ReactNode>
}) {
  const t = useTranslations('experiences')
  const tc = useTranslations('common')
  const locale = useLocale()
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<(typeof KINDS)[number]>('all')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (kind !== 'all' && p.kind !== kind) return false
      if (!q) return true
      const haystack =
        locale === 'ar'
          ? `${p.titleAr} ${p.subtitleAr}`
          : `${p.title} ${p.subtitle}`
      return haystack.toLowerCase().includes(q)
    })
  }, [products, query, kind, locale])

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            className="ps-9"
            placeholder={t('searchExp')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Tabs value={kind} onValueChange={(v) => setKind(v as typeof kind)}>
          <TabsList>
            {KINDS.map((k) => (
              <TabsTrigger key={k} value={k}>
                {k === 'all' ? tc('experiences') : tc(`productkind.${k}.title`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => cards[p.id])}
      </div>
      {visible.length === 0 && (
        <p className="text-muted-foreground py-12 text-center">—</p>
      )}
    </div>
  )
}
