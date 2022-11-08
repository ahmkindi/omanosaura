import { Product, ProductKind } from '../types/requests'

export const getTotalPrice = (
  lang: string,
  product: Product,
  quantity: number,
  chosenDate: Date
) => {
  var total = (product.priceBaisa * quantity) / 1000
  if (
    product.plannedDates
      .map((d) => new Date(d))
      .includes(new Date(chosenDate)) ||
    (quantity > 4 && product.kind === ProductKind.trip)
  ) {
    total *= 0.8
  }

  return new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: 'OMR',
  }).format(total)
}
