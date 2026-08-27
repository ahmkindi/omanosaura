import Image from 'next/image'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { pickLocalized } from '@/lib/localized'
import { formatOMR } from '@/lib/price'
import type { ProductDTO } from '@/data/serialize'
import { StarRating } from '@/components/star-rating'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export async function ProductCard({ product }: { product: ProductDTO }) {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations('common'),
  ])

  return (
    <Link href={`/experiences/${product.id}`}>
      <Card className="group h-full overflow-hidden pt-0 transition-shadow hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.photo}
            alt={pickLocalized(product, 'title', locale)}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Badge className="absolute top-3 end-3" variant="secondary">
            {formatOMR(product.basePriceBaisa, locale)}
          </Badge>
        </div>
        <CardContent className="space-y-1.5">
          <h3 className="line-clamp-1 font-semibold">
            {pickLocalized(product, 'title', locale)}
          </h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {pickLocalized(product, 'subtitle', locale)}
          </p>
          {product.ratingCount > 0 ? (
            <StarRating rating={product.rating} count={product.ratingCount} />
          ) : (
            <span className="text-muted-foreground text-xs">
              {t('ratings')}: —
            </span>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
