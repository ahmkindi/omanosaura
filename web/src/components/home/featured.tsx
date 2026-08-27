'use client'

import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { ProductDTO } from '@/data/serialize'
import { AdventureCard } from '@/components/experiences/adventure-card'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'

export function Featured({ products }: { products: ProductDTO[] }) {
  const t = useTranslations('home')

  return (
    <section className="bg-sand py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-bold uppercase sm:text-5xl">
              {t('featured')}
            </h2>
            <Button
              asChild
              variant="ghost"
              className="text-secondary hover:text-secondary shrink-0"
            >
              <Link href="/experiences">
                {t('viewAll')} <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>

      {/* Edge-to-edge snap carousel on mobile, grid on desktop */}
      <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 lg:mx-auto lg:grid lg:max-w-6xl lg:snap-none lg:grid-cols-3 lg:overflow-visible">
        {products.map((p, i) => (
          <Reveal
            key={p.id}
            index={i}
            className="w-[78vw] max-w-sm shrink-0 snap-center sm:w-[45vw] lg:w-auto"
          >
            <AdventureCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
