import { Product } from '../types/requests'

export const getTotalPrice = (
  lang: string,
  product: Product,
  quantity: number,
  payExtra: boolean,
  chosenDate: Date
) => {
  var total = Math.ceil(quantity / 4) * product.basePriceBaisa
  if (
    product.plannedDates.map((d) => new Date(d)).includes(new Date(chosenDate))
  ) {
    total *= 0.8
  }
  if (payExtra) {
    console.log('total is', total)
    total += product.extraPriceBaisa * quantity
  }

  return new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: 'OMR',
  }).format(total / 100)
}
