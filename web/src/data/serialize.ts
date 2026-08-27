import type { Product } from '@/generated/prisma/client'

/** Format a @db.Date DateTime as yyyy-MM-dd (values are midnight UTC). */
export function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export type ProductDTO = {
  id: string
  kind: 'school' | 'team' | 'exp'
  title: string
  titleAr: string
  subtitle: string
  subtitleAr: string
  description: string
  descriptionAr: string
  photo: string
  photos: string[]
  basePriceBaisa: number
  extraPriceBaisa: number
  pricePer: number
  plannedDates: string[]
  longitude: number
  latitude: number
  lastUpdated: string
  rating: number
  ratingCount: number
  reviewCount: number
}

export function toProductDTO(
  product: Product,
  agg: { rating: number; ratingCount: number; reviewCount: number },
): ProductDTO {
  return {
    id: product.id,
    kind: product.kind,
    title: product.title,
    titleAr: product.titleAr,
    subtitle: product.subtitle,
    subtitleAr: product.subtitleAr,
    description: product.description,
    descriptionAr: product.descriptionAr,
    photo: product.photo,
    photos: product.photos,
    basePriceBaisa: Number(product.basePriceBaisa),
    extraPriceBaisa: Number(product.extraPriceBaisa),
    pricePer: product.pricePer,
    plannedDates: product.plannedDates.map(toDateString),
    longitude: product.longitude,
    latitude: product.latitude,
    lastUpdated: toDateString(product.lastUpdated),
    ...agg,
  }
}
