import { Product } from '../types/requests'

export const getTotalPrice = (
  lang: string,
  product: Product,
  quantity: number,
  payExtra: boolean,
  chosenDate: Date
) => {
  var total = Math.ceil(quantity / product.pricePer) * product.basePriceBaisa
  if (
    product.plannedDates.map((d) => new Date(d)).includes(new Date(chosenDate))
  ) {
    total *= 0.8
  }
  if (payExtra) {
    total += product.extraPriceBaisa * quantity
  }

  return new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: 'OMR',
  }).format(total / 1000)
}
