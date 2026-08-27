'use client'

import { SafeImage } from '@/components/safe-image'
import { useLocale } from 'next-intl'
import { Star } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { pickLocalized } from '@/lib/localized'
import { formatOMR } from '@/lib/price'
import type { ProductDTO } from '@/data/serialize'

function coord(lat: number, lng: number): string {
  return `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lng).toFixed(2)}°${lng >= 0 ? 'E' : 'W'}`
}

export function AdventureCard({
  product,
  className = '',
}: {
  product: ProductDTO
  className?: string
}) {
  const locale = useLocale()
  const title = pickLocalized(product, 'title', locale)

  return (
    <Link
      href={`/experiences/${product.id}`}
      className={`group relative block overflow-hidden rounded-2xl ${className}`}
    >
      <div className="relative aspect-[4/5]">
        <SafeImage
          src={product.photo}
          alt={title}
          fill
          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 30vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        <div className="from-night/90 via-night/25 absolute inset-0 bg-gradient-to-t to-transparent" />

        <span className="bg-secondary text-secondary-foreground absolute top-3 end-3 rounded-full px-3 py-1 font-mono text-xs font-semibold shadow-md">
          {formatOMR(product.basePriceBaisa, locale)}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
          <p className="text-wadi mb-1 font-mono text-[10px] tracking-[0.25em] uppercase">
            {coord(product.latitude, product.longitude)}
          </p>
          <h3 className="font-display text-xl leading-tight font-bold sm:text-2xl">
            {title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-white/70">
            {pickLocalized(product, 'subtitle', locale)}
          </p>
          {product.ratingCount > 0 && (
            <p className="mt-2 flex items-center gap-1.5 font-mono text-xs text-white/80">
              <Star className="fill-secondary text-secondary size-3.5" />
              {product.rating.toFixed(1)} · {product.ratingCount}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
